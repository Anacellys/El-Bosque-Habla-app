import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/ui/AppText";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useAppContext } from "@/context/AppContext";
import { ANIMALS, PROVINCES, QUIZ_OPTIONS } from "@/data/app-data";

const PROVINCE_IMAGES: Record<
  string,
  { color: string; emoji: string; scene: string }
> = {
  "bocas-toro": {
    color: "#2E7D32",
    emoji: "",
    scene: "Ríos y manglares de Bocas del Toro",
  },
  chiriqui: {
    color: "#1B5E20",
    emoji: "",
    scene: "Bosques montañosos de Chiriquí",
  },
  colon: {
    color: "#1565C0",
    emoji: "",
    scene: "Selvas del Caribe en Colón",
  },
  herrera: {
    color: "#C62828",
    emoji: "",
    scene: "Llanuras y bosques de Herrera",
  },
  panama: {
    color: "#6A1B9A",
    emoji: "",
    scene: "Selva urbana de Panamá",
  },
  "panama-oeste": {
    color: "#558B2F",
    emoji: "",
    scene: "Bosques y ríos de Panamá Oeste",
  },
};

export function ExplorationScreen() {
  const router = useRouter();
  const { selectedProvinceId, recordResult } = useAppContext();
  const province = PROVINCES.find((entry) => entry.id === selectedProvinceId)!;
  const provinceAnimals = useMemo(
    () => ANIMALS.filter((animal) => animal.provinceId === selectedProvinceId),
    [selectedProvinceId],
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [soundPlaying, setSoundPlaying] = useState(false);

  const animal = provinceAnimals[currentIndex];
  const options = QUIZ_OPTIONS[animal.id];
  const scene = PROVINCE_IMAGES[province.id] || PROVINCE_IMAGES.panama;
  const progress = ((currentIndex + 1) / provinceAnimals.length) * 100;

  const handleAnswer = (option: string) => {
    if (answered) {
      return;
    }

    setAnswered(true);
    const correct = option === animal.name;
    recordResult(animal.id, correct);
    setTimeout(() => {
      router.replace("/result");
    }, 900);
  };

  const handleSound = () => {
    setSoundPlaying(true);
    setTimeout(() => setSoundPlaying(false), 900);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.hero, { backgroundColor: scene.color }]}>
        <View style={styles.heroTopBar}>
          <Pressable style={styles.iconButton} onPress={() => router.back()}>
            <AppText style={styles.iconText}>←</AppText>
          </Pressable>
          <View style={styles.heroBadge}>
            <AppText style={styles.heroBadgeText}>{province.name}</AppText>
          </View>
          <View style={styles.heroCounter}>
            <AppText style={styles.heroCounterText}>
              {currentIndex + 1}/{provinceAnimals.length}
            </AppText>
          </View>
        </View>
        <AppText style={styles.sceneText}>{scene.scene}</AppText>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <View style={styles.mysteryCard}>
          <AppText style={styles.mysteryEmoji}>{animal.emoji}</AppText>
          {!answered ? <View style={styles.overlay} /> : null}
          {!answered ? <AppText style={styles.questionMark}>❓</AppText> : null}
        </View>
      </View>

      <PrimaryButton
        title={soundPlaying ? animal.sound : "Escuchar Sonido"}
        icon={soundPlaying ? "🔊" : "🔉"}
        onPress={handleSound}
      />

      <View style={styles.questionWrap}>
        <AppText variant="subtitle" style={styles.questionText}>
          🤔 ¿Qué animal hizo este sonido?
        </AppText>
      </View>

      <View style={styles.optionsWrap}>
        {options.map((option) => {
          const isSelected = answered && option === animal.name;
          const isWrong =
            answered &&
            option === options.find((value) => value !== animal.name);
          return (
            <Pressable
              key={option}
              style={[
                styles.optionCard,
                answered && isSelected && styles.optionCorrect,
                answered && isWrong && styles.optionWrong,
              ]}
              onPress={() => handleAnswer(option)}
            >
              <View
                style={[
                  styles.optionIcon,
                  answered && isSelected && styles.optionIconCorrect,
                  answered && isWrong && styles.optionIconWrong,
                ]}
              >
                <AppText
                  style={[
                    styles.optionIconText,
                    answered &&
                      (isSelected || isWrong) &&
                      styles.optionIconTextActive,
                  ]}
                >
                  {answered ? (isSelected ? "✓" : isWrong ? "✗" : "○") : "○"}
                </AppText>
              </View>
              <AppText
                style={[
                  styles.optionText,
                  answered && isSelected && styles.optionTextActive,
                ]}
              >
                {option}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9F4",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 14,
  },
  hero: { borderRadius: 28, padding: 16, minHeight: 240, overflow: "hidden" },
  heroTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
  },
  iconText: { color: "#FFFFFF", fontSize: 18 },
  heroBadge: {
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  heroBadgeText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
  heroCounter: {
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  heroCounterText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
  sceneText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 24,
  },
  progressBar: {
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.24)",
    marginTop: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#FFD54F",
  },
  mysteryCard: {
    position: "absolute",
    right: 16,
    bottom: 16,
    width: 84,
    height: 84,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.29)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  mysteryEmoji: { fontSize: 40 },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.49)",
    borderRadius: 20,
  },
  questionMark: { position: "absolute", fontSize: 24 },
  questionWrap: { alignItems: "center" },
  questionText: { textAlign: "center" },
  optionsWrap: { gap: 10 },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    borderWidth: 2,
    borderColor: "#E8F5E9",
  },
  optionCorrect: { backgroundColor: "#E8F5E9", borderColor: "#3D8B37" },
  optionWrong: { backgroundColor: "#FFEBEE", borderColor: "#EF5350" },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
  },
  optionIconCorrect: { backgroundColor: "#3D8B37" },
  optionIconWrong: { backgroundColor: "#EF5350" },
  optionIconText: { color: "#3D8B37", fontWeight: "900", fontSize: 18 },
  optionIconTextActive: { color: "#FFFFFF" },
  optionText: { color: "#1A3A1A", fontSize: 16, fontWeight: "800" },
  optionTextActive: { color: "#2E7D32" },
});
