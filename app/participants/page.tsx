"use client";

import ParticipantsList from "@/components/participants-list";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ParticipantsPage() {
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
        // ignore
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const onClearAll = async () => {
    if (!confirm("¿Estás seguro de que deseas limpiar todos los datos?"))
      return;
    try {
      const { data: games } = await supabase
        .from("games")
        .select("id")
        .order("created_at", { ascending: true })
        .limit(1);
      const gameId = games && games[0] ? games[0].id : null;
      if (!gameId) return;
      await supabase.from("assignments").delete().eq("game_id", gameId);
      await supabase.from("participants").delete().eq("game_id", gameId);
      await supabase
        .from("games")
        .update({ sorteo_realizado: false })
        .eq("id", gameId);
      setParticipants([]);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to clear", err);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-slate-900 to-black relative overflow-hidden">
      <main className="relative z-10">
        <ParticipantsList
          participants={participants}
          onReveal={() => router.push("/reveal")}
          onBack={() => router.push("/")}
          onClearAll={onClearAll}
        />
      </main>
    </div>
  );
}
