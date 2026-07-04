import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import type { ResultState } from "@/types/app";

interface AppContextValue {
  discoveries: string[];
  stars: number;
  narrationEnabled: boolean;
  selectedParkId: string | null;
  selectedAnimalId: string | null;
  lastResult: ResultState | null;
  selectPark: (parkId: string) => void;
  selectAnimal: (animalId: string) => void;
  markDiscovery: (animalId: string) => void;
  recordResult: (animalId: string, correct: boolean) => void;
  toggleNarration: () => void;
  resetProgress: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Cargamos el progreso del niño desde almacenamiento local para que las estrellas y el avance persistan.
  const [discoveries, setDiscoveries] = useState<string[]>([]);
  const [stars, setStars] = useState(0);
  const [narrationEnabled, setNarrationEnabled] = useState(true);
  const [selectedParkId, setSelectedParkId] = useState<string | null>(null);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<ResultState | null>(null);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const storedDiscoveries = await AsyncStorage.getItem("discoveries");
        const storedStars = await AsyncStorage.getItem("stars");
        const storedNarration = await AsyncStorage.getItem("narrationEnabled");

        if (storedDiscoveries) {
          setDiscoveries(JSON.parse(storedDiscoveries));
        }
        if (storedStars) {
          setStars(Number(storedStars));
        }
        if (storedNarration) {
          setNarrationEnabled(storedNarration === "true");
        }
      } catch (error) {
        console.warn("No se pudieron restaurar los datos locales", error);
      }
    };

    hydrate();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("discoveries", JSON.stringify(discoveries));
  }, [discoveries]);

  useEffect(() => {
    AsyncStorage.setItem("stars", String(stars));
  }, [stars]);

  useEffect(() => {
    AsyncStorage.setItem("narrationEnabled", String(narrationEnabled));
  }, [narrationEnabled]);

  const selectPark = (parkId: string) => setSelectedParkId(parkId);
  const selectAnimal = (animalId: string) => setSelectedAnimalId(animalId);

  const markDiscovery = (animalId: string) => {
    setDiscoveries((current) =>
      current.includes(animalId) ? current : [...current, animalId],
    );
  };

  const recordResult = (animalId: string, correct: boolean) => {
    setSelectedAnimalId(animalId);
    setLastResult({ animalId, correct });
    if (correct) {
      markDiscovery(animalId);
      setStars((current) => current + 1);
    }
  };

  const toggleNarration = () => {
    setNarrationEnabled((current) => !current);
  };

  const resetProgress = async () => {
    setDiscoveries([]);
    setStars(0);
    setNarrationEnabled(true);
    setSelectedAnimalId(null);
    setLastResult(null);
    await AsyncStorage.removeItem("discoveries");
    await AsyncStorage.removeItem("stars");
    await AsyncStorage.setItem("narrationEnabled", "true");
  };

  const value = useMemo(
    () => ({
      discoveries,
      stars,
      narrationEnabled,
      selectedParkId,
      selectedAnimalId,
      lastResult,
      selectPark,
      selectAnimal,
      markDiscovery,
      recordResult,
      toggleNarration,
      resetProgress,
    }),
    [
      discoveries,
      narrationEnabled,
      selectedParkId,
      selectedAnimalId,
      stars,
      lastResult,
    ],
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
