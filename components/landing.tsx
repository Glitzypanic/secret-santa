"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import html2canvas from "html2canvas";
import confetti from "canvas-confetti";

interface LandingProps {
  onStart: () => void;
  participants: any[];
  sorteoRealizado: boolean;
  revealedIds: string[];
  onSorteo: () => Promise<void>;
  onReveal: (participantId: string) => Promise<{
    name: string;
    gift_1: string;
    gift_2: string;
    gift_3: string;
  }>;
  expectedParticipants?: number;
}

export default function Landing({
  onStart,
  participants,
  sorteoRealizado,
  revealedIds,
  onSorteo,
  onReveal,
  expectedParticipants = 7,
}: LandingProps) {
  const [selectedParticipant, setSelectedParticipant] = useState<string>("");
  const [sorteando, setSorteando] = useState(false);
  const [revelando, setRevelando] = useState(false);
  const [receiver, setReceiver] = useState<{
    name: string;
    gift_1: string;
    gift_2: string;
    gift_3: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const resultCardRef = useRef<HTMLDivElement>(null);

  const canSorteo =
    participants.length === expectedParticipants && !sorteoRealizado;

  // Participantes disponibles (no han revelado aún)
  const availableParticipants = participants.filter(
    (p) => !revealedIds.includes(String(p.id))
  );

  // Función para disparar confetti desde arriba por 5 segundos
  const triggerConfetti = () => {
    const duration = 5 * 1000; // 5 segundos
    const end = Date.now() + duration;

    const frame = () => {
      // Lanzar confetti desde la parte superior
      confetti({
        particleCount: 3,
        angle: 270, // Hacia abajo
        spread: 180,
        origin: { x: Math.random(), y: -0.1 }, // Desde arriba
        colors: [
          "#c4a574",
          "#ff6b6b",
          "#4ecdc4",
          "#ffe66d",
          "#95e1d3",
          "#f38181",
        ],
        gravity: 1.2,
        drift: 0,
        ticks: 300,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  };

  // Función para copiar al portapapeles en formato markdown
  const handleCopy = async () => {
    if (!receiver) return;

    const markdown = `## 🎄 Mi Amigo Secreto

**${receiver.name}**

### Ideas de regalo:
- ${receiver.gift_1 || "—"}
- ${receiver.gift_2 || "—"}
- ${receiver.gift_3 || "—"}

*Presupuesto máximo: $20.000*`;

    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Error al copiar:", err);
    }
  };

  // Función para tomar screenshot
  const handleScreenshot = async () => {
    if (!resultCardRef.current) return;

    try {
      const canvas = await html2canvas(resultCardRef.current, {
        backgroundColor: "#1e293b",
        scale: 2,
      });

      const link = document.createElement("a");
      link.download = `amigo-secreto-${receiver?.name || "resultado"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Error al tomar screenshot:", err);
    }
  };

  const handleSorteo = async () => {
    setSorteando(true);
    setError(null);
    try {
      await onSorteo();
      // Después de hacer el sorteo, abrimos el modal automáticamente
      setShowModal(true);
    } catch (e: any) {
      setError(e.message || "Error al realizar sorteo");
    }
    setSorteando(false);
  };

  const handleOpenModal = () => {
    setShowModal(true);
    setReceiver(null);
    setSelectedParticipant("");
    setError(null);
  };

  const handleReveal = async () => {
    if (!selectedParticipant) return;
    setRevelando(true);
    setError(null);
    try {
      const result = await onReveal(selectedParticipant);
      setReceiver(result);
      // Disparar confetti cuando se revela
      setTimeout(() => triggerConfetti(), 100);
    } catch (e: any) {
      setError(e.message || "Error al revelar");
    }
    setRevelando(false);
  };

  const handleClose = () => {
    setShowModal(false);
    setReceiver(null);
    setSelectedParticipant("");
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/granoMolido-7VJGtetA8deKPxt78oAOtZ23Z8bAva.jpeg"
            alt="Grano Molido"
            className="w-42 h-42 object-contain rounded-full"
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-center text-stone-100 mb-4">
          Amigo Secreto Grano Molido
        </h1>

        <div className="w-20 h-1 bg-[#c4a574] mx-auto mb-8"></div>

        {/* Modal de selección y revelación */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <Card className="bg-slate-800 border-[#c4a574] p-8 max-w-md w-full text-center">
              {/* Si ya reveló, mostrar resultado */}
              {receiver ? (
                <>
                  {/* Contenido para screenshot */}
                  <div
                    ref={resultCardRef}
                    className="bg-slate-800 p-4 rounded-lg"
                  >
                    <h2 className="text-2xl font-bold text-stone-100 mb-2">
                      🎄 ¡Tu Amigo Secreto es!
                    </h2>
                    <div className="w-16 h-1 bg-[#c4a574] mx-auto mb-6"></div>

                    <p className="text-4xl font-bold text-[#c4a574] mb-6">
                      {receiver.name}
                    </p>

                    <div className="bg-slate-700 rounded-lg p-4 mb-6 text-left">
                      <p className="text-stone-300 font-semibold mb-3">
                        Ideas de regalo:
                      </p>
                      <ul className="space-y-2 text-stone-200">
                        <li className="flex items-start gap-2">
                          <span className="text-[#c4a574]">✦</span>
                          <span>{receiver.gift_1 || "—"}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#c4a574]">✦</span>
                          <span>{receiver.gift_2 || "—"}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#c4a574]">✦</span>
                          <span>{receiver.gift_3 || "—"}</span>
                        </li>
                      </ul>
                    </div>

                    <p className="text-stone-400 text-sm">
                      Presupuesto máximo: <strong>$20.000</strong>
                    </p>
                  </div>

                  {/* Botones de acción */}
                  <div className="grid grid-cols-2 gap-3 mt-6 mb-4">
                    <Button
                      onClick={handleCopy}
                      variant="outline"
                      className="border-[#c4a574] text-[#c4a574] hover:bg-[#c4a574]/10 py-3 rounded-lg"
                    >
                      {copied ? "✓ Copiado!" : "📋 Copiar"}
                    </Button>
                    <Button
                      onClick={handleScreenshot}
                      variant="outline"
                      className="border-[#c4a574] text-[#c4a574] hover:bg-[#c4a574]/10 py-3 rounded-lg"
                    >
                      📸 Guardar
                    </Button>
                  </div>

                  <Button
                    onClick={handleClose}
                    className="w-full bg-[#c4a574] hover:bg-[#b8956a] text-slate-950 font-semibold py-3 rounded-lg"
                  >
                    ✓ Listo, cerrar
                  </Button>
                </>
              ) : (
                <>
                  {/* Selector de nombre */}
                  <h2 className="text-2xl font-bold text-stone-100 mb-2">
                    🎅 Revelar Amigo Secreto
                  </h2>
                  <div className="w-16 h-1 bg-[#c4a574] mx-auto mb-6"></div>

                  <p className="text-stone-300 mb-6">
                    Selecciona tu nombre para descubrir quién es tu amigo
                    secreto:
                  </p>

                  {error && (
                    <p className="text-red-400 text-center mb-4 bg-red-900/30 rounded-lg p-3">
                      {error}
                    </p>
                  )}

                  {availableParticipants.length > 0 ? (
                    <div className="space-y-4">
                      <select
                        value={selectedParticipant}
                        onChange={(e) => setSelectedParticipant(e.target.value)}
                        className="w-full bg-slate-700 border border-[#5a4a35] text-stone-100 rounded-lg px-4 py-3 focus:outline-none focus:border-[#c4a574]"
                      >
                        <option value="">Selecciona tu nombre</option>
                        {availableParticipants.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>

                      <Button
                        onClick={handleReveal}
                        disabled={!selectedParticipant || revelando}
                        className="w-full bg-[#c4a574] hover:bg-[#b8956a] disabled:bg-slate-600 text-slate-950 font-semibold py-3 rounded-lg"
                      >
                        {revelando
                          ? "Revelando..."
                          : "🎁 Revelar mi Amigo Secreto"}
                      </Button>

                      <Button
                        onClick={handleClose}
                        variant="outline"
                        className="w-full border-slate-600 text-stone-300 hover:bg-slate-700 py-3 rounded-lg"
                      >
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-green-400 font-semibold">
                        ✓ ¡Todos han revelado su amigo secreto!
                      </p>
                      <Button
                        onClick={handleClose}
                        className="w-full bg-[#c4a574] hover:bg-[#b8956a] text-slate-950 font-semibold py-3 rounded-lg"
                      >
                        Cerrar
                      </Button>
                    </div>
                  )}
                </>
              )}
            </Card>
          </div>
        )}

        {/* Lista de participantes */}
        {participants.length > 0 && (
          <div className="bg-slate-800 border border-[#5a4a35] rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-stone-100 mb-4">
              Participantes Registrados ({participants.length}/
              {expectedParticipants})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="p-3 rounded-lg border-2 text-center bg-slate-700 border-[#5a4a35] text-stone-100"
                >
                  {participant.name}
                </div>
              ))}
            </div>

            {/* Mostrar error si hay (fuera del modal) */}
            {error && !showModal && (
              <p className="text-red-400 text-center mb-4">{error}</p>
            )}

            {/* Botón de sorteo - solo si hay 6 participantes y no se ha hecho */}
            {canSorteo && (
              <Button
                onClick={handleSorteo}
                disabled={sorteando}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-3 rounded-lg"
              >
                {sorteando ? "Realizando sorteo..." : "🎄 Realizar Sorteo"}
              </Button>
            )}

            {/* Después del sorteo: botón para abrir modal de revelación */}
            {sorteoRealizado && availableParticipants.length > 0 && (
              <Button
                onClick={handleOpenModal}
                className="w-full bg-[#c4a574] hover:bg-[#b8956a] text-slate-950 font-semibold py-3 rounded-lg"
              >
                🎁 Revelar mi Amigo Secreto
              </Button>
            )}

            {/* Si todos revelaron */}
            {sorteoRealizado && availableParticipants.length === 0 && (
              <p className="text-green-400 text-center font-semibold">
                ✓ ¡Todos han revelado su amigo secreto!
              </p>
            )}

            {/* Mensaje si faltan participantes */}
            {participants.length < 6 && !sorteoRealizado && (
              <p className="text-yellow-300 text-center">
                Faltan {expectedParticipants - participants.length}{" "}
                participante(s) para realizar el sorteo.
              </p>
            )}
          </div>
        )}

        {/* Description */}
        <div className="space-y-6 mb-12 text-center">
          <p className="text-lg text-stone-100">
            Celebra la magia navideña en Grano Molido con el tradicional Amigo
            Secreto. Y no te preocupes, esta vez nadie se quedará sin regalo.
            ¡Sigue las instrucciones y descubre a tu personita! ✨
          </p>

          {/* Rules */}
          <div className="bg-slate-800 border border-[#5a4a35] rounded-lg p-6 text-left">
            <h2 className="text-xl font-semibold text-stone-100 mb-4">
              Cómo Funciona
            </h2>
            <ul className="space-y-3 text-stone-200">
              <li className="flex items-start gap-3">
                <span className="text-[#c4a574] font-bold">✦</span>
                <span>Registra tu nombre y sugiere 3 ideas de regalo</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#c4a574] font-bold">✦</span>
                <span>
                  Presupuesto: máximo <strong>$20.000</strong>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#c4a574] font-bold">✦</span>
                <span>Revela quién es tu amigo secreto y sorpréndelo</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Button - solo si no se ha hecho el sorteo y faltan participantes */}
        {!sorteoRealizado && participants.length < expectedParticipants && (
          <div className="flex justify-center">
            <Button
              onClick={onStart}
              className="bg-[#c4a574] hover:bg-[#b8956a] text-slate-950 px-12 py-3 text-lg rounded-full font-semibold transition-all hover:scale-105"
            >
              Comenzar Registro
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
