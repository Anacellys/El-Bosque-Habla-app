import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

import { QuetzalMascot } from "@/components/QuetzalMascot";
import { AppText } from "@/components/ui/AppText";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ScreenTopActions } from "@/components/ui/ScreenTopActions";
import { useAppContext } from "@/context/AppContext";

export function ParentsScreen() {
  const router = useRouter();
  const { narrationEnabled, toggleNarration, resetProgress, stars } =
    useAppContext();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container}>
      <ScreenTopActions containerStyle={{ top: insets.top + 8 }} />
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <AppText style={styles.backText}>←</AppText>
        </Pressable>
        <View style={styles.headerTextWrap}>
          <AppText variant="title">Padres</AppText>
          <AppText style={styles.subtitle}>
            Información y control sencillo.
          </AppText>
        </View>
      </View>

      <View style={styles.card}>
        <QuetzalMascot size={100} withHat={false} style={styles.mascot} />
        <AppText style={styles.cardTitle}>El Bosque Habla</AppText>
        <AppText style={styles.cardText}>
          Una app para aprender con sonidos reales y mucha alegría.
        </AppText>
        <AppText style={styles.cardText}>
          Versión 1.0 • Hecha para preescolar.
        </AppText>
      </View>

      <View style={styles.actions}>
        <PrimaryButton
          title={
            narrationEnabled ? "Narración activada" : "Narración desactivada"
          }
          onPress={toggleNarration}
        />
        <PrimaryButton
          title="Reiniciar progreso"
          variant="secondary"
          onPress={resetProgress}
        />
      </View>

      <AppText style={styles.starsText}>Estrellas guardadas: {stars}</AppText>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6FFF2",
    paddingHorizontal: 18,
    paddingTop: 82,
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#DFF3D0",
    padding: 18,
    alignItems: "center",
    gap: 8,
  },
  mascot: {
    marginBottom: 4,
  },
  cardTitle: {
    color: "#1B5E20",
    fontWeight: "800",
    fontSize: 20,
  },
  cardText: {
    color: "#4E7A4B",
    fontWeight: "700",
    textAlign: "center",
  },
  actions: {
    marginTop: 20,
    gap: 10,
  },
  starsText: {
    marginTop: 16,
    textAlign: "center",
    color: "#5A7A5A",
    fontWeight: "700",
  },
});
