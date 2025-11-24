"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface LandingProps {
  onStart: () => void;
  participants: any[];
  onSelectParticipant: (participant: any) => void;
}

export default function Landing({
  onStart,
  participants,
  onSelectParticipant,
}: LandingProps) {
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);

  const handleSelectParticipant = (participant: any) => {
    setSelectedParticipant(participant);
    onSelectParticipant(participant);
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
          Amigo Secreto 2025
        </h1>

        <div className="w-20 h-1 bg-[#c4a574] mx-auto mb-8"></div>

        {participants.length > 0 && (
          <div className="bg-slate-800 border border-[#5a4a35] rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-stone-100 mb-4">
              Participantes Registrados
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {participants.map((participant) => (
                <button
                  key={participant.id}
                  onClick={() => handleSelectParticipant(participant)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedParticipant?.id === participant.id
                      ? "bg-[#c4a574] border-[#c4a574] text-slate-950 font-semibold"
                      : "bg-slate-700 border-[#5a4a35] text-stone-100 hover:border-[#c4a574]"
                  }`}
                >
                  {participant.name}
                </button>
              ))}
            </div>
            {selectedParticipant && (
              <Button
                onClick={() => onSelectParticipant(selectedParticipant)}
                className="w-full mt-4 bg-[#c4a574] hover:bg-[#b8956a] text-slate-950 font-semibold py-3 rounded-lg"
              >
                Ver mi Amigo Secreto
              </Button>
            )}
          </div>
        )}

        {/* Description */}
        <div className="space-y-6 mb-12 text-center">
          <p className="text-lg text-stone-100">
            Celebra la magia navideña en Grano Molido con nuestro tradicional
            Amigo Secreto. ¡Descubre quién es tu persona asignada y encuentra el
            regalo perfecto!
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
                  Presupuesto: máximo <strong>$20.000</strong> por regalo
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#c4a574] font-bold">✦</span>
                <span>Revela quién es tu amigo secreto y sorpréndelo</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#c4a574] font-bold">✦</span>
                <span>¡Celebra la magia navideña con nosotros! 🎉</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Button
            onClick={onStart}
            className="bg-[#c4a574] hover:bg-[#b8956a] text-slate-950 px-12 py-3 text-lg rounded-full font-semibold transition-all hover:scale-105"
          >
            Comenzar Registro
          </Button>
        </div>
      </div>
    </div>
  );
}
