import { supabase } from "../../../lib/supabase";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    if (!token)
      return new Response(JSON.stringify({ error: "missing_token" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });

    // find participant by token
    const { data: p, error: pErr } = await supabase
      .from("participants")
      .select("*")
      .eq("secret_token", token)
      .limit(1)
      .single();

    if (pErr)
      return new Response(
        JSON.stringify({ error: "supabase_error", message: pErr.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    if (!p)
      return new Response(JSON.stringify({ error: "invalid_token" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });

    // get assignment for this giver
    const { data: assign, error: aErr } = await supabase
      .from("assignments")
      .select("*")
      .eq("giver_id", p.id)
      .limit(1)
      .single();

    if (aErr)
      return new Response(
        JSON.stringify({ error: "supabase_error", message: aErr.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    if (!assign)
      return new Response(JSON.stringify({ error: "assignment_not_found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });

    // fetch receiver participant
    const { data: r, error: rErr } = await supabase
      .from("participants")
      .select("*")
      .eq("id", assign.receiver_id)
      .limit(1)
      .single();

    if (rErr)
      return new Response(
        JSON.stringify({ error: "supabase_error", message: rErr.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    if (!r)
      return new Response(JSON.stringify({ error: "receiver_not_found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });

    return new Response(
      JSON.stringify({
        receiver: {
          name: r.name,
          gift_1: r.gift_1,
          gift_2: r.gift_2,
          gift_3: r.gift_3,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
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
