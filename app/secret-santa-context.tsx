"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type SecretSantaContextType = {
  participants: any[];
  assignments: any[];
  addParticipant: (p: any) => void;
  clearAll: () => void;
  computeAssignments: (list: any[]) => void;
};

const SecretSantaContext = createContext<SecretSantaContextType | undefined>(
  undefined
);

export const SecretSantaProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [participants, setParticipants] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const savedParticipants = localStorage.getItem("participants");
    const savedAssignments = localStorage.getItem("assignments");

    if (savedParticipants) {
      const parsed = JSON.parse(savedParticipants);
      setParticipants(parsed);
    }

    if (savedAssignments) {
      setAssignments(JSON.parse(savedAssignments));
    }
  }, []);

  const computeAssignments = (participantsList: any[]) => {
    const shuffled = [...participantsList].sort(() => Math.random() - 0.5);
    const newAssignments = participantsList.map((participant, index) => {
      let secretSanta = shuffled[index];
      while (secretSanta.id === participant.id && participantsList.length > 1) {
        shuffled.push(shuffled.shift()!);
        secretSanta = shuffled[index];
      }
      return {
        from: participant.id,
        to: secretSanta.id,
      };
    });
    setAssignments(newAssignments);
    localStorage.setItem("assignments", JSON.stringify(newAssignments));
  };

  const addParticipant = (participant: any) => {
    const updated = [...participants, participant];
    setParticipants(updated);
    localStorage.setItem("participants", JSON.stringify(updated));

    // Recompute assignments
    if (updated.length > 1) {
      computeAssignments(updated);
    }
  };

  const clearAll = () => {
    if (confirm("¿Estás seguro de que deseas limpiar todos los datos?")) {
      setParticipants([]);
      setAssignments([]);
      localStorage.removeItem("participants");
      localStorage.removeItem("assignments");
    }
  };

  return (
    <SecretSantaContext.Provider
      value={{
        participants,
        assignments,
        addParticipant,
        clearAll,
        computeAssignments,
      }}
    >
      {children}
    </SecretSantaContext.Provider>
  );
};

export const useSecretSanta = () => {
  const ctx = useContext(SecretSantaContext);
  if (!ctx)
    throw new Error("useSecretSanta must be used within SecretSantaProvider");
  return ctx;
};
