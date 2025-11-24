"use client";

import Landing from "@/components/landing";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LandingPage() {
  const router = useRouter();
  const [participants, setParticipants] = useState<any[]>([]);

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
        if (!gameId) {
          setParticipants([]);
          return;
        }
        const { data } = await supabase
          .from("participants")
          .select("*")
          .eq("game_id", gameId)
          .order("created_at", { ascending: true });
        if (mounted) setParticipants(data ?? []);
      } catch (e) {
        // ignore in UI, keep empty
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
        <Landing
          onStart={() => router.push("/registration")}
          participants={participants}
          onSelectParticipant={(p) => router.push(`/reveal?selected=${p.id}`)}
        />
      </main>
    </div>
  );
}
