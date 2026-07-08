import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { ANIMALS, PROVINCES } from "@/data/animals";

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

export function GameScreen() {
  const router = useRouter();
  const { recordResult, narrationEnabled } = useAppContext();
  const { playName, playSequence, stopAll } = useAudio();

  const bounce = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(12)).current;
  const retryAudioIndex = useRef(0);

  const insets = useSafeAreaInsets();

  // Sesión local (no se guarda en AppContext, porque el task actual exige
  // evitar repetir en esta sesión; si quieres persistencia entre pantallas
  // luego lo conectamos a contexto).
  const [sessionProvinceOrder, setSessionProvinceOrder] = useState([]); // array de province ids
  const [currentProvinceIndex, setCurrentProvinceIndex] = useState(0);

  const [correctAnimalId, setCorrectAnimalId] = useState(null);
  const [answerOptions, setAnswerOptions] = useState([]); // array de 2 animal objects

  const [feedback, setFeedback] = useState("listen");

  const currentProvince =
    sessionProvinceOrder.length > 0
      ? PROVINCES.find((p) => p.id === sessionProvinceOrder[currentProvinceIndex]) ?? null
      : null;

  const totalProvinces = PROVINCES.length;
  const isLastProvince = currentProvinceIndex === totalProvinces - 1;

  const question = useMemo(() => {
    if (!correctAnimalId) return null;
    return ANIMALS.find((a) => a.id === correctAnimalId) ?? null;
  }, [correctAnimalId]);



  const buildProvinceRound = (province) => {
    const ids = province.animals || [];
    if (ids.length < 2) {
      return;
    }

    const chosenCorrectId = ids[Math.floor(Math.random() * ids.length)];
    const correctAnimal = ANIMALS.find((a) => a.id === chosenCorrectId) ?? null;
    const optionAnimal = ANIMALS.find((a) => a.id !== chosenCorrectId && ids.includes(a.id)) ?? null;

    const twoAnimals = [correctAnimal, optionAnimal].filter(Boolean);
    const randomized = shuffle(twoAnimals);

    setCorrectAnimalId(chosenCorrectId);
    setAnswerOptions(randomized);
    setFeedback("listen");

    // audio: reproducir sonido real del animal correcto (si no hay asset, se salta)
    if (correctAnimal) {
      playSequence([
        narrationEnabled ? MASCOT_AUDIO.instruccionJuego : null,
        narrationEnabled ? MASCOT_AUDIO.preguntaSonido : null,
        correctAnimal.soundUrl ?? correctAnimal.soundAsset ?? null,
      ]);
    }
  };

  const startSession = () => {
    const order = shuffle(PROVINCES.map((p) => p.id));
    setSessionProvinceOrder(order);
    setCurrentProvinceIndex(0);
    setFeedback("listen");
  };

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

    startSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!sessionProvinceOrder.length) {
      return;
    }
    const provinceId = sessionProvinceOrder[currentProvinceIndex];
    const province = PROVINCES.find((p) => p.id === provinceId) ?? null;
    if (!province) {
      return;
    }
    buildProvinceRound(province);
  }, [currentProvinceIndex, sessionProvinceOrder, narrationEnabled]);


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
    if (!question) {
      return;
    }
    // La mascota pregunta primero y, cuando termina, recién entonces
    // suena el animal — así nunca se pisan.
    playSequence([
      narrationEnabled ? MASCOT_AUDIO.instruccionJuego : null,
      narrationEnabled ? MASCOT_AUDIO.preguntaSonido : null,
      question.soundUrl ?? question.soundAsset ?? null,
    ]);

    return () => {
      stopAll();
    };
  }, [narrationEnabled, playSequence, question, stopAll]);

  const bubbleText = useMemo(() => {
    if (feedback === "retry") {
      return "Escuchemos otra vez.";
    }
    return "¿Quién hizo este sonido?";
  }, [feedback]);

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
    if (!question) {
      return;
    }

    if (animal.id === question.id) {
      recordResult(question.id, true);

      // Si esta era la última provincia de la sesión, vamos al cierre.
      // Para eso, GameScreen va a pasar un param "end" cuando corresponda.
      router.push({
        pathname: "/celebration",
        params: {
          animalId: question.id,
          mode: question?.meta?.mode ?? "continue",
          end: question?.meta?.end ?? false,
        },
      });
      return;
    }

    setFeedback("retry");
    triggerBounce();
    const retryAudio =
      retryAudioIndex.current % 2 === 0
        ? MASCOT_AUDIO.intentaOtraVez
        : MASCOT_AUDIO.intentaOtraVez2;
    retryAudioIndex.current += 1;
    playSequence([
      narrationEnabled ? retryAudio : null,
      question.soundUrl ?? question.soundAsset ?? null,
    ]);
  };

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

          <View style={styles.promptWrap}>
            <AppText style={styles.promptLabel}>
              Toca la imagen que escuchaste
            </AppText>
          </View>

          <View style={styles.cardsWrap}>
            {options.map((animal) => {
              const imageSource = resolveImageSource(animal.image);

              return (
                <Animated.View
                  key={animal.id}
                  style={{ transform: [{ translateX: bounce }] }}
                >
                  <Pressable
                    style={styles.card}
                    onPress={() => handleSelect(animal)}
                  >
                    <Image source={imageSource} style={styles.cardImage} />
                    <View style={styles.cardFooter}>
                      <AppText style={styles.cardName}>{animal.name}</AppText>
                      <Pressable
                        style={styles.audioButton}
                        onPress={(event) => {
                          event.stopPropagation();
                          playName(animal);
                        }}
                      >
                        <AppText style={styles.audioButtonText}>🔊</AppText>
                      </Pressable>
                    </View>
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>

          <View style={styles.footer}>
            <AppText style={styles.footerText}>Escucha, mira y toca.</AppText>
          </View>
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
    maxWidth: 280,
  },
  speechText: {
    color: "#1B5E20",
    fontWeight: "800",
    textAlign: "center",
  },
  mascot: {
    marginVertical: 4,
  },
  promptWrap: {
    alignItems: "center",
    marginTop: 8,
  },
  promptLabel: {
    color: "#4E7A4B",
    fontWeight: "700",
  },
  cardsWrap: {
    gap: 14,
    marginTop: 12,
    paddingBottom: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#DFF3D0",
    padding: 12,
    gap: 10,
  },
  cardImage: {
    width: "100%",
    height: 125,
    borderRadius: 18,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  cardName: {
    flex: 1,
    color: "#174D19",
    fontWeight: "800",
    fontSize: 16,
  },
  audioButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFE082",
    alignItems: "center",
    justifyContent: "center",
  },
  audioButtonText: {
    fontSize: 18,
  },
  footer: {
    alignItems: "center",
    marginTop: 14,
    paddingBottom: 6,
  },
  footerText: {
    color: "#5A7A5A",
    fontWeight: "700",
  },
});
