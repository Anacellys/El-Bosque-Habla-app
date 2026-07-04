import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/ui/AppText";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useAppContext } from "@/context/AppContext";
import { ANIMALS } from "@/data/app-data";
import { getCachedImageUri } from "@/utils/imageCache";

export function ResultScreen() {
  const router = useRouter();
  const { lastResult, points } = useAppContext();
  const reward = lastResult?.correct ? 50 : 10;
  const animal = ANIMALS.find((entry) => entry.id === lastResult?.animalId);
  const correct = lastResult?.correct ?? false;
  const { discoveries } = useAppContext();
  const completedAll = discoveries.length >= ANIMALS.length;

  if (!animal) {
    return null;
  }

  const [localImageUri, setLocalImageUri] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (typeof animal.image === "string") {
        const uri = await getCachedImageUri(animal.id, animal.image as string);
        if (mounted && uri) setLocalImageUri(uri);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [animal]);

  return (
    <SafeAreaView
      style={[styles.container, correct ? styles.successBg : styles.failBg]}
    >
      <View style={styles.emojiBox}>
        <AppText style={styles.emoji}>{correct ? "🎉" : "💪"}</AppText>
      </View>
      <AppText
        variant="title"
        style={[styles.title, correct ? styles.successText : styles.failText]}
      >
        {completedAll
          ? "¡Felicidades, Maestro Naturalista!"
          : correct
            ? "¡Excelente!"
            : "¡Casi lo logras!"}
      </AppText>
      <AppText style={styles.description}>
        {completedAll
          ? `Has descubierto todas las especies. ¡Gracias por explorar y proteger el bosque!`
          : correct
            ? `¡Descubriste al ${animal.name}! Eres un gran explorador.`
            : `Era el ${animal.name}. ¡Sigue intentando, explorador!`}
      </AppText>

      <View style={styles.card}>
        <View style={styles.cardHero}>
          {localImageUri ? (
            <Image source={{ uri: localImageUri }} style={styles.resultImage} />
          ) : animal.image ? (
            <Image source={{ uri: animal.image }} style={styles.resultImage} />
          ) : (
            <AppText style={styles.animalEmoji}>{animal.emoji}</AppText>
          )}
        </View>
        <View style={styles.cardBody}>
          <AppText variant="subtitle">{animal.name}</AppText>
          <AppText style={styles.cardMeta}>📍 {animal.park}</AppText>
        </View>
      </View>

      <View style={styles.pointsRow}>
        <View style={styles.pointsPill}>
          <AppText style={styles.pointsIcon}>⭐</AppText>
          <AppText style={styles.pointsText}>+{reward} puntos</AppText>
        </View>
        <View style={styles.totalPill}>
          <AppText style={styles.totalText}>Total: {points} ⭐</AppText>
        </View>
      </View>

      <View style={styles.actions}>
        <PrimaryButton
          title="Continuar Explorando"
          onPress={() => router.push("/map")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 24,
  },
  successBg: { backgroundColor: "#E8F5E9" },
  failBg: { backgroundColor: "#FFF8E1" },
  emojiBox: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: { fontSize: 52 },
  title: { marginTop: 16, textAlign: "center" },
  successText: { color: "#2E7D32" },
  failText: { color: "#F57F17" },
  description: {
    marginTop: 8,
    color: "#5A7A5A",
    fontWeight: "700",
    textAlign: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    marginTop: 20,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: "#E8F5E9",
  },
  cardHero: {
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 28,
  },
  animalEmoji: { fontSize: 84 },
  resultImage: { width: 160, height: 160, borderRadius: 14 },
  cardBody: { padding: 16 },
  cardMeta: { color: "#5A7A5A", fontWeight: "700", marginTop: 4 },
  pointsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
    alignItems: "center",
  },
  pointsPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "#FFD54F",
  },
  pointsIcon: { fontSize: 18 },
  pointsText: { color: "#1A3A1A", fontWeight: "900" },
  totalPill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "#E8F5E9",
    borderWidth: 2,
    borderColor: "#3D8B37",
  },
  totalText: { color: "#2E7D32", fontWeight: "800" },
  actions: { width: "100%", maxWidth: 360, marginTop: 20, gap: 10 },
});
