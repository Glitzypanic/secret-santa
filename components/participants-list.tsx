'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ParticipantsListProps {
  participants: any[];
  onReveal: () => void;
  onBack: () => void;
  onClearAll: () => void;
}

export default function ParticipantsList({
  participants,
  onReveal,
  onBack,
  onClearAll,
}: ParticipantsListProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center text-stone-100 mb-2">
          Participantes Registrados
        </h1>
        <div className="w-16 h-1 bg-[#c4a574] mx-auto mb-8"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {participants.map((participant) => (
            <Card
              key={participant.id}
              className="bg-slate-800 border-[#5a4a35] p-6 hover:border-[#c4a574] transition-all"
            >
              <h3 className="text-xl font-bold text-stone-100 mb-3">
                {participant.name}
              </h3>
              <div className="space-y-2">
                <p className="text-stone-300 text-sm font-semibold">Ideas de Regalo:</p>
                <ul className="space-y-1">
                  {participant.gifts.map((gift: string, index: number) => (
                    <li key={index} className="text-stone-200 text-sm">
                      • {gift}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        {participants.length === 0 ? (
          <Card className="bg-slate-800 border-[#5a4a35] p-8 text-center">
            <p className="text-stone-200 mb-6">Aún no hay participantes registrados.</p>
            <Button
              onClick={onBack}
              className="bg-[#c4a574] hover:bg-[#b8956a] text-slate-950 px-8 py-2 rounded-lg"
            >
              Volver a Registrar
            </Button>
          </Card>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={onReveal}
              className="flex-1 bg-[#c4a574] hover:bg-[#b8956a] text-slate-950 font-semibold py-3 rounded-lg"
            >
              Ver Mi Amigo Secreto
            </Button>
            <Button
              onClick={onBack}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-stone-100 font-semibold py-3 rounded-lg"
            >
              Volver
            </Button>
            <Button
              onClick={onClearAll}
              className="flex-1 bg-red-900 hover:bg-red-800 text-red-100 font-semibold py-3 rounded-lg"
            >
              Limpiar Todo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
