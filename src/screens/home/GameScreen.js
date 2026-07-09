import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { QuetzalMascot } from "@/components/QuetzalMascot";
import { AppText } from "@/components/ui/AppText";
import { ScreenTopActions } from "@/components/ui/ScreenTopActions";
import { useAppContext } from "@/context/AppContext";
import { useAudio } from "@/context/AudioContext";
import { ANIMALS, PROVINCES, hasPlayableSound } from "@/data/animals";
import { MASCOT_AUDIO } from "@/data/mascotAudio";
import { resolveImageSource } from "@/utils/imageSource";

function shuffle(values) {
  const copy = [...values];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function getAnimalById(animalId) {
  return ANIMALS.find((animal) => animal.id === animalId) ?? null;
}

function buildRound(province) {
  const animalIds = province.animals ?? [];
  const options = animalIds.map(getAnimalById).filter(Boolean);
  const animalsWithSound = options.filter(hasPlayableSound);
  const candidates = animalsWithSound.length > 0 ? animalsWithSound : options;
  const correctAnimal =
    candidates[Math.floor(Math.random() * candidates.length)] ?? null;

  return {
    roundProvinceId: province.id,
    roundAnimalId: correctAnimal?.id ?? null,
    answerOptionIds: shuffle(options.map((animal) => animal.id)),
  };
}

export function GameScreen() {
  const router = useRouter();
  const {
    gameSession,
    narrationEnabled,
    recordResult,
    resetSession,
    setGameSession,
  } = useAppContext();
  const { playSequence, stopAll } = useAudio();
  const insets = useSafeAreaInsets();

  const bounce = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(12)).current;
  const retryAudioIndex = useRef(0);
  const lastPlayedRoundRef = useRef(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, slide]);

  useEffect(() => {
    if (gameSession?.provinceOrderIds?.length) {
      return;
    }

    setGameSession({
      provinceOrderIds: shuffle(PROVINCES.map((province) => province.id)),
      currentProvinceIndex: 0,
      correctAnimalId: null,
      completedProvinceIds: [],
      roundAnimalId: null,
      roundProvinceId: null,
      answerOptionIds: [],
    });
  }, [gameSession, setGameSession]);

  const currentProvince = useMemo(() => {
    if (!gameSession?.provinceOrderIds?.length) {
      return null;
    }

    const provinceId =
      gameSession.provinceOrderIds[gameSession.currentProvinceIndex];
    return PROVINCES.find((province) => province.id === provinceId) ?? null;
  }, [gameSession]);

  useEffect(() => {
    if (!gameSession?.provinceOrderIds?.length || !currentProvince) {
      return;
    }

    if (
      gameSession.roundProvinceId === currentProvince.id &&
      gameSession.roundAnimalId &&
      gameSession.answerOptionIds?.length === 2
    ) {
      return;
    }

    setGameSession((current) => {
      if (!current?.provinceOrderIds?.length) {
        return current;
      }

      const round = buildRound(currentProvince);
      return {
        ...current,
        correctAnimalId: round.roundAnimalId,
        roundAnimalId: round.roundAnimalId,
        roundProvinceId: round.roundProvinceId,
        answerOptionIds: round.answerOptionIds,
      };
    });
  }, [currentProvince, gameSession, setGameSession]);

  const correctAnimal = useMemo(
    () => getAnimalById(gameSession?.roundAnimalId),
    [gameSession?.roundAnimalId],
  );

  const answerOptions = useMemo(
    () =>
      (gameSession?.answerOptionIds ?? [])
        .map(getAnimalById)
        .filter(Boolean),
    [gameSession?.answerOptionIds],
  );

  useEffect(() => {
    if (!correctAnimal || !currentProvince) {
      return;
    }

    const roundKey = `${currentProvince.id}:${correctAnimal.id}`;
    if (lastPlayedRoundRef.current === roundKey) {
      return;
    }
    lastPlayedRoundRef.current = roundKey;

    playSequence([
      narrationEnabled ? MASCOT_AUDIO.instruccionJuego : null,
      narrationEnabled ? MASCOT_AUDIO.preguntaSonido : null,
      correctAnimal.soundUrl ?? correctAnimal.soundAsset ?? null,
    ]);

    return () => {
      stopAll();
    };
  }, [correctAnimal, currentProvince, narrationEnabled, playSequence, stopAll]);

  const totalProvinces = PROVINCES.length;
  const provinceNumber = (gameSession?.currentProvinceIndex ?? 0) + 1;
  const isLastProvince = provinceNumber >= totalProvinces;
  const feedback = gameSession?.feedback ?? "listen";

  const triggerBounce = () => {
    Animated.sequence([
      Animated.timing(bounce, {
        toValue: -8,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.timing(bounce, {
        toValue: 8,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.timing(bounce, {
        toValue: -6,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.timing(bounce, {
        toValue: 0,
        duration: 70,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSelect = (animal) => {
    if (!correctAnimal || !currentProvince) {
      return;
    }

    if (animal.id !== correctAnimal.id) {
      setGameSession((current) =>
        current ? { ...current, feedback: "retry" } : current,
      );
      triggerBounce();

      const retryAudio =
        retryAudioIndex.current % 2 === 0
          ? MASCOT_AUDIO.intentaOtraVez
          : MASCOT_AUDIO.intentaOtraVez2;
      retryAudioIndex.current += 1;

      playSequence([
        narrationEnabled ? retryAudio : null,
        correctAnimal.soundUrl ?? correctAnimal.soundAsset ?? null,
      ]);
      return;
    }

    stopAll();
    recordResult(correctAnimal.id, true);

    if (isLastProvince) {
      resetSession();
      router.push({
        pathname: "/celebration",
        params: {
          animalId: correctAnimal.id,
          next: "/forest-complete",
        },
      });
      return;
    }

    setGameSession((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        currentProvinceIndex: current.currentProvinceIndex + 1,
        completedProvinceIds: [
          ...(current.completedProvinceIds ?? []),
          currentProvince.id,
        ],
        correctAnimalId: null,
        feedback: "listen",
        roundAnimalId: null,
        roundProvinceId: null,
        answerOptionIds: [],
      };
    });

    router.push({
      pathname: "/celebration",
      params: {
        animalId: correctAnimal.id,
        next: "/game",
      },
    });
  };

  const handleReplay = () => {
    if (!correctAnimal) {
      return;
    }

    playSequence([correctAnimal.soundUrl ?? correctAnimal.soundAsset ?? null]);
  };

  const bubbleText =
    feedback === "retry"
      ? "Inténtalo de nuevo"
      : "Escucha el sonido y elige su nombre";

  return (
    <SafeAreaView style={styles.container}>
      <ScreenTopActions containerStyle={{ top: insets.top + 8 }} />
      <Animated.View
        style={[
          styles.content,
          { opacity: fade, transform: [{ translateY: slide }] },
        ]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.speechBubble}>
              <AppText style={styles.speechText}>{bubbleText}</AppText>
            </View>
            <QuetzalMascot size={110} style={styles.mascot} />
          </View>

          <View
            style={[
              styles.provinceCard,
              { backgroundColor: currentProvince?.bgColor ?? "#FFFFFF" },
            ]}
          >
            <AppText style={styles.progressText}>
              Provincia {provinceNumber} de {totalProvinces}
            </AppText>
            <AppText variant="subtitle" style={styles.provinceName}>
              {currentProvince?.name ?? "Preparando juego"}
            </AppText>
            <AppText style={styles.regionText}>
              {currentProvince?.region ?? "El bosque está preparando la ronda."}
            </AppText>
          </View>

          <Pressable style={styles.replayButton} onPress={handleReplay}>
            <AppText style={styles.replayText}>Escuchar otra vez</AppText>
          </Pressable>

          <Animated.View
            style={[
              styles.optionsWrap,
              { transform: [{ translateX: bounce }] },
            ]}
          >
            {answerOptions.map((animal) => (
              <Pressable
                key={animal.id}
                style={({ pressed }) => [
                  styles.answerButton,
                  pressed && styles.answerButtonPressed,
                ]}
                onPress={() => handleSelect(animal)}
              >
                {animal.image ? (
                  <Image
                    source={resolveImageSource(animal.image)}
                    style={styles.answerImage}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.answerPlaceholder}>
                    <AppText style={styles.answerPlaceholderIcon}>
                      {animal.emoji}
                    </AppText>
                  </View>
                )}
                <AppText style={styles.answerName}>{animal.name}</AppText>
              </Pressable>
            ))}
          </Animated.View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6FFF2",
    paddingHorizontal: 20,
    paddingTop: 78,
    paddingBottom: 24,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  header: {
    alignItems: "center",
    gap: 12,
  },
  speechBubble: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: "#B9E7B1",
    maxWidth: 300,
  },
  speechText: {
    color: "#1B5E20",
    fontWeight: "800",
    textAlign: "center",
  },
  mascot: {
    marginVertical: 4,
  },
  provinceCard: {
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#DFF3D0",
    padding: 18,
    marginTop: 12,
    alignItems: "center",
  },
  progressText: {
    color: "#5A7A5A",
    fontWeight: "800",
  },
  provinceName: {
    color: "#174D19",
    marginTop: 4,
    textAlign: "center",
  },
  regionText: {
    color: "#4E7A4B",
    fontWeight: "700",
    marginTop: 4,
    textAlign: "center",
  },
  replayButton: {
    alignSelf: "center",
    backgroundColor: "#FFE082",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginTop: 16,
  },
  replayText: {
    color: "#174D19",
    fontWeight: "800",
  },
  optionsWrap: {
    gap: 14,
    marginTop: 18,
  },
  answerButton: {
    minHeight: 132,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#B9E7B1",
    paddingHorizontal: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  answerButtonPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: "#E8F5E9",
  },
  answerName: {
    color: "#174D19",
    fontWeight: "900",
    fontSize: 22,
    textAlign: "center",
  },
  answerImage: {
    width: "100%",
    height: 96,
    borderRadius: 16,
    backgroundColor: "#F6FFF2",
  },
  answerPlaceholder: {
    width: "100%",
    height: 96,
    borderRadius: 16,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
  },
  answerPlaceholderIcon: {
    fontSize: 42,
  },
});
