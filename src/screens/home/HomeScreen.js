import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { QuetzalMascot } from "@/components/QuetzalMascot";
import { AppText } from "@/components/ui/AppText";
import {
  FamilyIcon,
  PlayIcon,
  SpeakerIcon,
  StarIcon,
} from "@/components/ui/Icons";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ScreenTopActions } from "@/components/ui/ScreenTopActions";
import { useAppContext } from "@/context/AppContext";
import { getPlayableAnimals } from "@/data/animals";

export function HomeScreen() {
  const router = useRouter();
  const { discoveries, stars } = useAppContext();
  const insets = useSafeAreaInsets();
  const playableAnimals = getPlayableAnimals();
  const playableAnimalIds = new Set(playableAnimals.map((animal) => animal.id));
  const found = discoveries.filter((animalId) =>
    playableAnimalIds.has(animalId),
  ).length;
  const total = playableAnimals.length;
  const pct = total > 0 ? Math.round((found / total) * 100) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScreenTopActions containerStyle={{ top: insets.top + 8 }} />
      <View style={styles.heroCard}>
        <QuetzalMascot size={140} style={styles.mascot} />
        <View style={styles.heroTextWrap}>
          <AppText style={styles.greeting}>¡Hola!</AppText>
          <AppText variant="title" style={styles.title}>
            Escuchemos animales
          </AppText>
          <AppText style={styles.subtitle}>
            Toca, escucha y aprende con sonidos reales.
          </AppText>
        </View>
      </View>

      <View style={styles.progressCard}>
        <AppText style={styles.progressLabel}>Tu progreso</AppText>
        <AppText variant="subtitle" style={styles.progressValue}>
          {found} de {total} animales
        </AppText>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${pct}%` }]} />
        </View>
        <View style={styles.starsRow}>
          <View style={styles.starsItem}>
            <StarIcon size={18} />
            <AppText style={styles.starsLabel}>{stars}</AppText>
          </View>
          <AppText style={styles.starsLabel}>{pct}%</AppText>
        </View>
      </View>

      <View style={styles.actions}>
        <PrimaryButton
          title="Jugar"
          icon={<PlayIcon size={20} color="#FFFFFF" />}
          onPress={() => router.push("/game")}
        />
        <PrimaryButton
          title="Escuchar animales"
          icon={<SpeakerIcon size={20} />}
          variant="secondary"
          onPress={() => router.push("/listen")}
        />
        <PrimaryButton
          title="Mis estrellas"
          icon={<StarIcon size={20} />}
          variant="secondary"
          onPress={() => router.push("/stars")}
        />
        <PrimaryButton
          title="Padres"
          icon={<FamilyIcon size={20} />}
          variant="secondary"
          onPress={() => router.push("/parents")}
        />
      </View>

      <Pressable
        style={styles.parentShortcut}
        onLongPress={() => router.push("/parents")}
      >
        <AppText style={styles.parentShortcutText}>
          Mantén presionado para Padres
        </AppText>
      </Pressable>
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
  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#DFF3D0",
    padding: 20,
    alignItems: "center",
    gap: 10,
  },
  mascot: {
    marginBottom: 2,
  },
  heroTextWrap: {
    alignItems: "center",
  },
  greeting: {
    color: "#F9A825",
    fontWeight: "800",
    fontSize: 16,
  },
  title: {
    color: "#1B5E20",
    textAlign: "center",
  },
  subtitle: {
    color: "#5A7A5A",
    fontWeight: "700",
    textAlign: "center",
    marginTop: 4,
  },
  progressCard: {
    backgroundColor: "#FFF8DB",
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#F6D96B",
    padding: 16,
    marginTop: 16,
  },
  progressLabel: {
    color: "#5A7A5A",
    fontWeight: "800",
  },
  progressValue: {
    color: "#1B5E20",
    marginTop: 2,
  },
  progressBar: {
    height: 12,
    backgroundColor: "#FDE8A0",
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#F9A825",
    borderRadius: 999,
  },
  starsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  starsItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  starsLabel: {
    color: "#1B5E20",
    fontWeight: "800",
  },
  actions: {
    flex: 1,
    justifyContent: "center",
    gap: 12,
    marginTop: 18,
  },
  parentShortcut: {
    alignItems: "center",
    paddingTop: 8,
  },
  parentShortcutText: {
    color: "#5A7A5A",
    fontWeight: "700",
  },
});
