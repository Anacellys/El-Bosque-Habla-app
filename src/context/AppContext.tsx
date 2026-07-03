import React, { createContext, useContext, useMemo, useState } from "react";

import type { ResultState } from "@/types/app";

interface AppContextValue {
  discoveries: string[];
  points: number;
  selectedParkId: string | null;
  selectedAnimalId: string | null;
  lastResult: ResultState | null;
  selectPark: (parkId: string) => void;
  selectAnimal: (animalId: string) => void;
  markDiscovery: (animalId: string) => void;
  recordResult: (animalId: string, correct: boolean) => void;
  addPoints: (value: number) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [discoveries, setDiscoveries] = useState<string[]>([
    "quetzal",
    "aguila-arpía",
    "mono-aullador",
  ]);
  const [points, setPoints] = useState(110);
  const [selectedParkId, setSelectedParkId] = useState<string | null>(
    "quetzales",
  );
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<ResultState | null>(null);

  const selectPark = (parkId: string) => setSelectedParkId(parkId);
  const selectAnimal = (animalId: string) => setSelectedAnimalId(animalId);

  const markDiscovery = (animalId: string) => {
    setDiscoveries((current) =>
      current.includes(animalId) ? current : [...current, animalId],
    );
  };

  const addPoints = (value: number) => {
    setPoints((current) => current + value);
  };

  const recordResult = (animalId: string, correct: boolean) => {
    setSelectedAnimalId(animalId);
    setLastResult({ animalId, correct });
    if (correct) {
      markDiscovery(animalId);
    }
    addPoints(correct ? 50 : 10);
  };

  const value = useMemo(
    () => ({
      discoveries,
      points,
      selectedParkId,
      selectedAnimalId,
      lastResult,
      selectPark,
      selectAnimal,
      markDiscovery,
      recordResult,
      addPoints,
    }),
    [discoveries, points, selectedParkId, selectedAnimalId, lastResult],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }

  return context;
}
