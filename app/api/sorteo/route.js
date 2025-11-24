import { supabase } from "../../../lib/supabase";
import { derangementIndices } from "../../../lib/derangement";

export async function POST(req) {
  try {
    // Get first game record
    const { data: games, error: gErr } = await supabase
      .from("games")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(1);

    if (gErr)
      return new Response(
        JSON.stringify({ error: "supabase_error", message: gErr.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    if (!games || games.length === 0)
      return new Response(JSON.stringify({ error: "no_game" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });

    const game = games[0];
    if (game.sorteo_realizado)
      return new Response(JSON.stringify({ error: "sorteo_already_done" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });

    // fetch participants
    const { data: participants, error: pErr } = await supabase
      .from("participants")
      .select("*")
      .eq("game_id", game.id)
      .order("created_at", { ascending: true });

    if (pErr)
      return new Response(
        JSON.stringify({ error: "supabase_error", message: pErr.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    if (!participants || participants.length < 2)
      return new Response(
        JSON.stringify({ error: "need_at_least_two_participants" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );

    const n = participants.length;
    const indices = derangementIndices(n);
    if (!indices)
      return new Response(JSON.stringify({ error: "derangement_failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });

    // Generate 10-char token and prepare updates & assignments
    const updates = [];
    const assignments = [];

    for (let i = 0; i < n; i++) {
      const giver = participants[i];
      const receiver = participants[indices[i]];
      const token = Math.random().toString(36).slice(2, 12);

      updates.push({ id: giver.id, secret_token: token });
      assignments.push({
        game_id: game.id,
        giver_id: giver.id,
        receiver_id: receiver.id,
      });
    }

    // Update participants tokens in bulk
    // Supabase doesn't support bulk update by id array easily, perform updates sequentially
    for (const u of updates) {
      await supabase
        .from("participants")
        .update({ secret_token: u.secret_token })
        .eq("id", u.id);
    }

    // Insert assignments
    const { error: insErr } = await supabase
      .from("assignments")
      .insert(assignments);
    if (insErr)
      return new Response(
        JSON.stringify({ error: "supabase_error", message: insErr.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );

    // mark game as done
    const { error: updGameErr } = await supabase
      .from("games")
      .update({ sorteo_realizado: true })
      .eq("id", game.id);
    if (updGameErr)
      return new Response(
        JSON.stringify({
          error: "supabase_error",
          message: updGameErr.message,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: "internal_error",
        message: (e && e.message) || String(e),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
