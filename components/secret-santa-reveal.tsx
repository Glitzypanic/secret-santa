"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SecretSantaRevealProps {
  participants: any[];
  assignments: any[];
  onBack: () => void;
}

export default function SecretSantaReveal({
  participants,
  assignments,
  onBack,
}: SecretSantaRevealProps) {
  const [selectedParticipant, setSelectedParticipant] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [secretSanta, setSecretSanta] = useState<any>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const searchParams = useSearchParams();

  const assignmentsReady = Array.isArray(assignments) && assignments.length > 0;

  useEffect(() => {
    const sel = searchParams?.get("selected");
    if (sel) {
      setSelectedParticipant(String(sel));
    }
  }, [searchParams]);

  const handleReveal = () => {
    setLocalError(null);
    if (!selectedParticipant) {
      setLocalError("Selecciona un nombre primero.");
      return;
    }

    if (!assignmentsReady) {
      setLocalError("El sorteo no se ha realizado aún.");
      return;
    }

    const assignment = assignments.find(
      (a) => String(a.from) === String(selectedParticipant)
    );

    if (!assignment) {
      setLocalError("No se encontró la asignación para ese participante.");
      return;
    }

    const santaRaw = participants.find(
      (p) => String(p.id) === String(assignment.to)
    );
    if (!santaRaw) {
      setLocalError("No se encontró la información del receptor.");
      return;
    }

    const santa = {
      name: santaRaw.name,
      gifts: [santaRaw.gift_1, santaRaw.gift_2, santaRaw.gift_3].filter(
        Boolean
      ),
    };
    setSecretSanta(santa);
    setRevealed(true);
    triggerConfetti();
  };

  const triggerConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * 5 + 3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 8 + 4,
        color: ["#c4a574", "#a08559", "#8b7d6b", "#f5f1e8"][
          Math.floor(Math.random() * 4)
        ],
      });
    }

    const animateConfetti = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.y += p.vy;
        p.vy += 0.1; // gravity
        p.x += p.vx;
        p.rotation += p.rotationSpeed;

        if (p.y < canvas.height) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (particles.some((p) => p.y < canvas.height)) {
        requestAnimationFrame(animateConfetti);
      }
    };

    animateConfetti();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 5 }}
      />

      <div className="max-w-2xl w-full relative z-10">
        {!revealed ? (
          <>
            <h1 className="text-4xl font-bold text-center text-stone-100 mb-2">
              Descubre Tu Amigo Secreto
            </h1>
            <div className="w-16 h-1 bg-[#c4a574] mx-auto mb-8"></div>

            <Card className="bg-slate-800 border-[#5a4a35] p-8">
              <label className="block text-stone-100 font-semibold mb-4">
                Selecciona Tu Nombre
              </label>
              <select
                value={selectedParticipant}
                onChange={(e) => setSelectedParticipant(e.target.value)}
                className="w-full bg-slate-700 border border-[#5a4a35] text-stone-100 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:border-[#c4a574]"
              >
                <option value="">-- Elige tu nombre --</option>
                {participants.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              {!assignmentsReady && (
                <p className="text-yellow-300 mb-4">
                  El sorteo aún no se ha realizado. Pide al organizador que
                  ejecute el sorteo para generar las asignaciones.
                </p>
              )}
              {localError && <p className="text-red-400 mb-4">{localError}</p>}

              <Button
                onClick={handleReveal}
                disabled={!selectedParticipant || !assignmentsReady}
                className="w-full bg-[#c4a574] hover:bg-[#b8956a] disabled:bg-slate-600 text-slate-950 font-semibold py-3 rounded-lg"
              >
                ¡Ver Mi Amigo Secreto!
              </Button>
            </Card>
          </>
        ) : secretSanta ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-stone-100 mb-2">
                ¡Es Tu Turno de Sorprender!
              </h1>
              <div className="w-16 h-1 bg-[#c4a574] mx-auto"></div>
            </div>

            <Card className="bg-slate-800 border-[#5a4a35] p-8 text-center mb-6">
              <p className="text-stone-300 text-lg mb-4">Debes regalarle a:</p>
              <h2 className="text-5xl font-bold text-stone-100 mb-6">
                {secretSanta.name}
              </h2>

              <div className="bg-slate-700 rounded-lg p-6 mb-6">
                <p className="text-stone-300 font-semibold mb-4">
                  Ideas de Regalo de Tu Amigo Secreto:
                </p>
                <ul className="space-y-2">
                  {secretSanta.gifts.map((gift: string, index: number) => (
                    <li key={index} className="text-stone-200 text-lg">
                      ✦ {gift}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-stone-300 text-sm font-semibold">
                Presupuesto máximo: $20.000
              </p>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => {
                  setRevealed(false);
                  setSelectedParticipant("");
                  setSecretSanta(null);
                }}
                className="flex-1 bg-[#c4a574] hover:bg-[#b8956a] text-slate-950 font-semibold py-3 rounded-lg"
              >
                Volver a Intentar
              </Button>
              <Button
                onClick={onBack}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-stone-100 font-semibold py-3 rounded-lg"
              >
                Volver al Listado
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
