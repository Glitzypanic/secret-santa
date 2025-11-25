import { supabase } from "../../../lib/supabase";

export async function POST(req) {
  try {
    const body = await req.json();
    const { visitorId } = body; // ID del participante que está revelando

    if (!visitorId) {
      return new Response(JSON.stringify({ error: "missing_visitor_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verificar que el participante existe
    const { data: visitor, error: vErr } = await supabase
      .from("participants")
      .select("*")
      .eq("id", visitorId)
      .single();

    if (vErr || !visitor) {
      return new Response(JSON.stringify({ error: "participant_not_found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Buscar la asignación de este participante
    const { data: assignment, error: aErr } = await supabase
      .from("assignments")
      .select("*")
      .eq("giver_id", visitorId)
      .single();

    if (aErr || !assignment) {
      return new Response(JSON.stringify({ error: "assignment_not_found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verificar si ya fue revelado
    if (assignment.revealed) {
      return new Response(
        JSON.stringify({
          error: "already_revealed",
          message: `${visitor.name} ya reveló su amigo secreto!`,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Marcar como revelado
    const { error: updateErr } = await supabase
      .from("assignments")
      .update({ revealed: true, revealed_at: new Date().toISOString() })
      .eq("id", assignment.id);

    if (updateErr) {
      return new Response(
        JSON.stringify({ error: "update_failed", message: updateErr.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Obtener datos del receiver (a quién le tiene que regalar)
    const { data: receiver, error: rErr } = await supabase
      .from("participants")
      .select("*")
      .eq("id", assignment.receiver_id)
      .single();

    if (rErr || !receiver) {
      return new Response(JSON.stringify({ error: "receiver_not_found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        receiver: {
          name: receiver.name,
          gift_1: receiver.gift_1,
          gift_2: receiver.gift_2,
          gift_3: receiver.gift_3,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: "internal_error",
        message: e.message || String(e),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
