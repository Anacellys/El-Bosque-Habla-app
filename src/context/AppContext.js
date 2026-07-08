import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AppContext = createContext(undefined);

export function AppProvider({ children }) {
  // Cargamos el progreso del niño desde almacenamiento local para que las estrellas y el avance persistan.
  const [discoveries, setDiscoveries] = useState([]);
  const [stars, setStars] = useState(0);
  const [narrationEnabled, setNarrationEnabled] = useState(true);
  const [selectedProvinceId, setSelectedProvinceId] = useState(null);
  const [selectedAnimalId, setSelectedAnimalId] = useState(null);
  const [lastResult, setLastResult] = useState(null);

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

  const selectProvince = (provinceId) => setSelectedProvinceId(provinceId);
  const selectAnimal = (animalId) => setSelectedAnimalId(animalId);

  const markDiscovery = (animalId) => {
    setDiscoveries((current) =>
      current.includes(animalId) ? current : [...current, animalId],
    );
  };

  const recordResult = (animalId, correct) => {
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

  const [gameSession, setGameSession] = useState(null);

  const startNewSession = () => {
    setGameSession({
      provinceOrderIds: [],
      currentProvinceIndex: 0,
      correctAnimalId: null,
      completedProvinceIds: [],
      // meta para repetir el mismo animal/sonido ante error
      roundAnimalId: null,
      roundProvinceId: null,
    });
  };

  const resetSession = () => {
    setGameSession(null);
  };

  const value = useMemo(
    () => ({
      discoveries,
      stars,
      points: stars,
      narrationEnabled,
      selectedProvinceId,
      selectedAnimalId,
      lastResult,
      selectProvince,
      selectAnimal,
      markDiscovery,
      recordResult,
      toggleNarration,
      resetProgress,
      gameSession,
      startNewSession,
      resetSession,
      setGameSession,
    }),
    [
      discoveries,
      narrationEnabled,
      selectedProvinceId,
      selectedAnimalId,
      stars,
      lastResult,
      gameSession,
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
