import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ImageSourcePropType } from "react-native";
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
import { ANIMALS } from "@/data/animals";
import { useAnimalAudio } from "@/services/audio";
import type { Animal } from "@/types/app";
import { resolveImageSource } from "@/utils/imageSource";

function shuffle<T>(values: T[]): T[] {
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
  const { playSound, playName } = useAnimalAudio();
  const [question, setQuestion] = useState<Animal | null>(null);
  const [options, setOptions] = useState<Animal[]>([]);
  const [feedback, setFeedback] = useState<"listen" | "retry">("listen");
  const bounce = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(12)).current;
  const insets = useSafeAreaInsets();

  const buildQuestion = () => {
    const correct = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    const distractors = shuffle(
      ANIMALS.filter((animal) => animal.id !== correct.id),
    ).slice(0, 1);
    setQuestion(correct);
    setOptions(shuffle([correct, ...distractors]));
    setFeedback("listen");
  };

  useEffect(() => {
    buildQuestion();
  }, []);

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
    if (question) {
      playSound(question);
    }
  }, [playSound, question]);

  const bubbleText = useMemo(() => {
    if (feedback === "retry") {
      return "Escuchemos otra vez.";
    }
    return narrationEnabled
      ? "¿Quién hizo este sonido?"
      : "¿Quién hizo este sonido?";
  }, [feedback, narrationEnabled]);

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

  const handleSelect = (animal: Animal) => {
    if (!question) {
      return;
    }

    if (animal.id === question.id) {
      recordResult(question.id, true);
      router.push({
        pathname: "/celebration",
        params: { animalId: question.id },
      });
      return;
    }

    setFeedback("retry");
    triggerBounce();
    playSound(question);
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
            <QuetzalMascot
              size={110}
              style={styles.mascot}
              speakAudio="https://actions.google.com/sounds/v1/animals/bird_chirp_1.mp3"
            />
          </View>

          <View style={styles.promptWrap}>
            <AppText style={styles.promptLabel}>
              Toca la imagen que escuchaste
            </AppText>
          </View>

          <View style={styles.cardsWrap}>
            {options.map((animal) => {
              const imageSource = resolveImageSource(animal.image) as
                | ImageSourcePropType
                | undefined;

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
