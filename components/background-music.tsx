"use client";

import { useEffect, useRef, useState } from "react";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);

  useEffect(() => {
    // Intentar reproducir automáticamente al cargar
    const tryAutoPlay = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          setShowPrompt(false);
        } catch {
          // Autoplay bloqueado, mostrar prompt
          setShowPrompt(true);
        }
      }
    };

    tryAutoPlay();

    // También intentar en cualquier interacción
    const handleInteraction = () => {
      if (!isPlaying && audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setShowPrompt(false);
        }).catch(() => {});
      }
    };

    document.addEventListener("click", handleInteraction);
    document.addEventListener("touchstart", handleInteraction);
    document.addEventListener("keydown", handleInteraction);
    document.addEventListener("scroll", handleInteraction);

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
      document.removeEventListener("scroll", handleInteraction);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
        setShowPrompt(false);
      }
    }
  };

  const handleEnableMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setShowPrompt(false);
      });
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

      {/* Prompt para activar música */}
      {showPrompt && !isPlaying && (
        <div className="fixed bottom-20 right-4 z-50 animate-bounce">
          <button
            onClick={handleEnableMusic}
            className="bg-[#c4a574] hover:bg-[#b8956a] text-slate-950 px-4 py-2 rounded-full shadow-lg font-semibold flex items-center gap-2 transition-all"
          >
            🎵 Activar música navideña
          </button>
        </div>
      )}

      {/* Botón flotante para controlar la música */}
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
    </>
  );
}
