"use client";

import SecretSantaReveal from "@/components/secret-santa-reveal";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RevealPage() {
  const router = useRouter();
  const [participants, setParticipants] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const { data: games } = await supabase
          .from("games")
          .select("id")
          .order("created_at", { ascending: true })
          .limit(1);
        const gameId = games && games[0] ? games[0].id : null;
        if (!gameId) return;

        const { data: parts } = await supabase
          .from("participants")
          .select("*")
          .eq("game_id", gameId)
          .order("created_at", { ascending: true });
        const { data: assigns } = await supabase
          .from("assignments")
          .select("*")
          .eq("game_id", gameId);

        if (mounted) {
          setParticipants(parts ?? []);
          // normalize assignments to { from, to }
          setAssignments(
            (assigns ?? []).map((a) => ({
              from: String(a.giver_id),
              to: String(a.receiver_id),
            }))
          );
        }
      } catch (e) {
        // ignore
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-slate-900 to-black relative overflow-hidden">
      <main className="relative z-10">
        <SecretSantaReveal
          participants={participants}
          assignments={assignments}
          onBack={() => router.push("/")}
        />
      </main>
    </div>
  );
}
