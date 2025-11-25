"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface RegistrationProps {
  onParticipantAdded: (participant: any) => void;
  onViewParticipants: () => void;
  participantsCount: number;
}

export default function Registration({
  onParticipantAdded,
  onViewParticipants,
  participantsCount,
}: RegistrationProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [gifts, setGifts] = useState(["", "", ""]);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const validateGiftPrice = (price: string) => {
    const num = parseInt(price);
    return !isNaN(num) && num <= 20000;
  };

  const handleGiftChange = (index: number, value: string) => {
    const newGifts = [...gifts];
    newGifts[index] = value;
    setGifts(newGifts);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];

    if (!name.trim()) {
      newErrors.push("El nombre es obligatorio");
    }

    gifts.forEach((gift, index) => {
      if (!gift.trim()) {
        newErrors.push(`Regalo ${index + 1} es obligatorio`);
      }
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const participant = {
      id: Date.now(),
      name: name.trim(),
      gifts: gifts.map((g) => g.trim()),
    };

    onParticipantAdded(participant);
    setName("");
    setGifts(["", "", ""]);
    setErrors([]);
    setSubmitted(true);

    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-center text-stone-100 mb-2">
          Regístrate
        </h1>
        <div className="w-16 h-1 bg-[#c4a574] mx-auto mb-8"></div>

        <div className="text-center mb-4">
          <p className="text-stone-300">
            Participantes registrados: <strong>{participantsCount}</strong>
          </p>
          {participantsCount < 6 ? (
            <p className="text-yellow-300">
              Faltan <strong>{6 - participantsCount}</strong> participantes para
              habilitar el sorteo.
            </p>
          ) : (
            <p className="text-green-300">
              Se alcanzó el número mínimo de participantes para el sorteo.
            </p>
          )}
        </div>

        <Card className="bg-slate-800 border-[#5a4a35] p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-stone-100 font-semibold mb-2">
                Tu Nombre *
              </label>
              <Input
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-700 border-[#5a4a35] text-stone-100 placeholder-stone-400"
              />
            </div>

            {/* Gifts Input */}
            <div>
              <label className="block text-stone-100 font-semibold mb-4">
                3 Ideas de Regalo (máx. $20.000)*
              </label>
              <div className="space-y-3">
                {gifts.map((gift, index) => (
                  <div key={index}>
                    <Input
                      type="text"
                      placeholder={`Regalo ${index + 1}`}
                      value={gift}
                      onChange={(e) => handleGiftChange(index, e.target.value)}
                      className="bg-slate-700 border-[#5a4a35] text-stone-100 placeholder-stone-400"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <div className="bg-red-900 border border-red-700 rounded-lg p-4">
                <ul className="space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="text-red-300 text-sm">
                      • {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Success Message */}
            {submitted && (
              <div className="bg-green-900 border border-green-700 rounded-lg p-4">
                <p className="text-green-300">
                  ✓ ¡Registro exitoso! Volviendo al inicio...
                </p>
              </div>
            )}

            {/* Buttons */}
            {!submitted && (
              <div className="flex gap-4 flex-col sm:flex-row">
                <Button
                  type="submit"
                  className="flex-1 bg-[#c4a574] hover:bg-[#b8956a] text-slate-950 font-semibold py-3 rounded-lg"
                >
                  Registrarme
                </Button>
              </div>
            )}
          </form>
        </Card>

        <p className="text-center text-stone-300 text-sm mt-6">
          Los campos marcados con * son obligatorios
        </p>
      </div>
    </div>
  );
}
