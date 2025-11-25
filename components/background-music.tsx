"use client";

import { useRef, useState } from "react";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const handleEnableMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setHasStarted(true);
      });
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/music/Sleigh Ride (Indian Christmas Remix).mp3"
        loop
        preload="auto"
      />

      {/* Prompt para activar música - solo se muestra antes de la primera activación */}
      {!hasStarted && (
        <div className="fixed bottom-4 right-4 z-50 animate-bounce">
          <button
            onClick={handleEnableMusic}
            className="bg-[#c4a574] hover:bg-[#b8956a] text-slate-950 px-4 py-2 rounded-full shadow-lg font-semibold flex items-center gap-2 transition-all"
          >
            🎵 Activar música navideña
          </button>
        </div>
      )}

      {/* Botón flotante para pausar/reproducir - solo después de activar */}
      {hasStarted && (
        <button
          onClick={togglePlay}
          className="fixed bottom-4 right-4 z-50 bg-slate-800/80 hover:bg-slate-700 border border-[#c4a574] text-stone-100 p-3 rounded-full shadow-lg transition-all hover:scale-110"
          aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
        >
          {isPlaying ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      )}
    </>
  );
}
