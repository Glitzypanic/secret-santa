"use client";

import Registration from "@/components/registration";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RegistrationPage() {
  const router = useRouter();
  const [participantsCount, setParticipantsCount] = useState(0);

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
        const { data } = await supabase
          .from("participants")
          .select("*")
          .eq("game_id", gameId)
          .order("created_at", { ascending: true });
        if (mounted) setParticipantsCount((data && data.length) || 0);
      } catch (e) {
        // ignore
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const onParticipantAdded = async (p: any) => {
    try {
      const { data: games } = await supabase
        .from("games")
        .select("id")
        .order("created_at", { ascending: true })
        .limit(1);
      const gameId = games && games[0] ? games[0].id : null;
      if (!gameId) throw new Error("no_game");

      const insert = {
        game_id: gameId,
        name: p.name,
        gift_1: p.gifts[0] ?? "",
        gift_2: p.gifts[1] ?? "",
        gift_3: p.gifts[2] ?? "",
      };

      const { error } = await supabase.from("participants").insert([insert]);
      if (error) throw error;

      // update local count (UI)
      setParticipantsCount((c) => c + 1);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to add participant", err);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-slate-900 to-black relative overflow-hidden">
      <main className="relative z-10">
        <Registration
          onParticipantAdded={onParticipantAdded}
          onViewParticipants={() => router.push("/participants")}
          participantsCount={participantsCount}
        />
      </main>
    </div>
  );
}
