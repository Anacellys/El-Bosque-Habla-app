import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { QuetzalMascot } from "@/components/QuetzalMascot";
import { AppText } from "@/components/ui/AppText";
import { ScreenTopActions } from "@/components/ui/ScreenTopActions";
import { useAppContext } from "@/context/AppContext";
import { useAudio } from "@/context/AudioContext";
import { getPlayableAnimals } from "@/data/animals";
import { MASCOT_AUDIO } from "@/data/mascotAudio";

export function StarsScreen() {
  const router = useRouter();
  const { discoveries, stars, narrationEnabled } = useAppContext();
  const { playSequence, stopAll } = useAudio();
  const insets = useSafeAreaInsets();
  const playableAnimals = getPlayableAnimals();
  const playableAnimalIds = new Set(playableAnimals.map((animal) => animal.id));
  const playableDiscoveries = discoveries.filter((animalId) =>
    playableAnimalIds.has(animalId),
  );

  useEffect(() => {
    playSequence([narrationEnabled ? MASCOT_AUDIO.introEstrellas : null]);

    return () => {
      stopAll();
    };
  }, [narrationEnabled, playSequence, stopAll]);

  return (
    <SafeAreaView style={styles.container}>
      <ScreenTopActions containerStyle={{ top: insets.top + 8 }} />
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <AppText style={styles.backText}>←</AppText>
        </Pressable>
        <View style={styles.headerTextWrap}>
          <AppText variant="title">Mis estrellas</AppText>
          <AppText style={styles.subtitle}>Tus logros de hoy.</AppText>
        </View>
        <QuetzalMascot size={66} withHat={false} style={styles.mascot} />
      </View>

      <View style={styles.summaryCard}>
        <AppText variant="subtitle">Total de estrellas</AppText>
        <AppText style={styles.starsValue}>{stars} ⭐</AppText>
        <AppText style={styles.summaryText}>
          Animales descubiertos: {playableDiscoveries.length} de{" "}
          {playableAnimals.length}
        </AppText>
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {playableAnimals.map((animal) => {
          const unlocked = discoveries.includes(animal.id);
          return (
            <Pressable
              key={animal.id}
              style={[
                styles.card,
                unlocked ? styles.cardUnlocked : styles.cardLocked,
              ]}
              onPress={() => {
                if (unlocked) {
                  playSequence([
                    animal.soundUrl ?? animal.soundAsset ?? null,
                    animal.nameAudioUrl ?? animal.nameAudioAsset ?? null,
                  ]);
                }
              }}
            >
              <View style={styles.cardLeft}>
                <AppText style={styles.emoji}>{animal.emoji}</AppText>
              </View>
              <View style={styles.cardCenter}>
                <AppText style={styles.animalName}>{animal.name}</AppText>
                <AppText style={styles.cardHint}>
                  {unlocked ? "Escucha otra vez" : "Por descubrir"}
                </AppText>
              </View>
              <AppText style={styles.starBadge}>
                {unlocked ? "⭐" : "☆"}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6FFF2",
    paddingHorizontal: 16,
    paddingTop: 82,
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#DFF3D0",
  },
  backText: {
    fontSize: 20,
    color: "#1B5E20",
  },
  headerTextWrap: {
    flex: 1,
  },
  subtitle: {
    color: "#5A7A5A",
    fontWeight: "700",
  },
  mascot: {
    marginLeft: 4,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#F6D96B",
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  starsValue: {
    fontSize: 34,
    fontWeight: "900",
    color: "#F9A825",
  },
  summaryText: {
    color: "#5A7A5A",
    fontWeight: "700",
  },
  list: {
    gap: 10,
    paddingBottom: 8,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    padding: 12,
    borderWidth: 2,
  },
  cardUnlocked: {
    backgroundColor: "#FFF8DB",
    borderColor: "#F6D96B",
  },
  cardLocked: {
    backgroundColor: "#F3F8EE",
    borderColor: "#DFF3D0",
  },
  cardLeft: {
    marginRight: 10,
  },
  emoji: {
    fontSize: 26,
  },
  cardCenter: {
    flex: 1,
  },
  animalName: {
    fontWeight: "800",
    color: "#174D19",
  },
  cardHint: {
    color: "#5A7A5A",
    fontWeight: "700",
  },
  starBadge: {
    fontSize: 20,
  },
});
