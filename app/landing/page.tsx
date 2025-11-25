"use client";

import Landing from "@/components/landing";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LandingPage() {
  const router = useRouter();
  const [participants, setParticipants] = useState<any[]>([]);
  const [gameId, setGameId] = useState<string | null>(null);
  const [sorteoRealizado, setSorteoRealizado] = useState(false);
  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const { data: games } = await supabase
        .from("games")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(1);

      const game = games && games[0] ? games[0] : null;
      if (!game) {
        setParticipants([]);
        setLoading(false);
        return;
      }

      setGameId(game.id);
      setSorteoRealizado(game.sorteo_realizado === true);

      const { data: parts } = await supabase
        .from("participants")
        .select("*")
        .eq("game_id", game.id)
        .order("created_at", { ascending: true });

      setParticipants(parts ?? []);

      // Si el sorteo ya está hecho, cargar quiénes ya revelaron
      if (game.sorteo_realizado) {
        const { data: assignments, error: aErr } = await supabase
          .from("assignments")
          .select("*")
          .eq("game_id", game.id)
          .eq("revealed", true);

        if (!aErr && assignments) {
          const revealed = assignments.map((a: any) => String(a.giver_id));
          setRevealedIds(revealed);
        }
      }
    } catch (e) {
      // ignore
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSorteo = async () => {
    try {
      const res = await fetch("/api/sorteo", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setSorteoRealizado(true);
        await loadData();
      } else if (data.error === "sorteo_already_done") {
        // El sorteo ya estaba hecho, solo actualizar estado sin mostrar error
        setSorteoRealizado(true);
        await loadData();
      } else {
        console.error("Error en sorteo:", data);
        throw new Error(data.error || "No se pudo realizar el sorteo");
      }
    } catch (err: any) {
      // No mostrar alert, dejar que el componente maneje el error
      console.error("Error en handleSorteo:", err);
      throw err;
    }
  };

  const handleReveal = async (participantId: string) => {
    const res = await fetch("/api/revelar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId: participantId }),
    });
    const data = await res.json();

    if (res.ok && data.receiver) {
      // Marcar como revelado localmente
      setRevealedIds((prev) => [...prev, participantId]);
      return data.receiver;
    } else {
      // Usar el mensaje personalizado del API si existe
      throw new Error(data.message || data.error || "Error al revelar");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-black via-slate-900 to-black flex items-center justify-center">
        <p className="text-stone-100">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-slate-900 to-black relative overflow-hidden">
      <main className="relative z-10">
        <Landing
          onStart={() => router.push("/registration")}
          participants={participants}
          sorteoRealizado={sorteoRealizado}
          revealedIds={revealedIds}
          onSorteo={handleSorteo}
          onReveal={handleReveal}
        />
      </main>
    </div>
  );
}
