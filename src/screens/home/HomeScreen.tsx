import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { QuetzalMascot } from "@/components/QuetzalMascot";
import { AppText } from "@/components/ui/AppText";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useAppContext } from "@/context/AppContext";
import { ANIMALS } from "@/data/app-data";

export function HomeScreen() {
  const router = useRouter();
  const { discoveries, points } = useAppContext();
  const total = ANIMALS.length;
  const found = discoveries.length;
  const pct = Math.round((found / total) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View>
            <AppText style={styles.greeting}>¡Hola, Explorador!</AppText>
            <AppText variant="title">El Bosque Habla 🌿</AppText>
          </View>
          <Pressable
            style={styles.collectionButton}
            onPress={() => router.push("/collection")}
          >
            <AppText style={styles.collectionIcon}>🏆</AppText>
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroTextWrap}>
            <AppText style={styles.heroLabel}>¡Aventura te espera!</AppText>
            <AppText variant="subtitle" style={styles.heroTitle}>
              Explora los parques de Panamá
            </AppText>
            <AppText style={styles.heroMeta}>
              5 parques • {total} animales
            </AppText>
          </View>
          <QuetzalMascot size={130} style={styles.heroMascot} />
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View>
              <AppText style={styles.progressLabel}>Mi progreso</AppText>
              <AppText variant="subtitle">
                {found} de {total} animales
              </AppText>
            </View>
            <View style={styles.progressBadge}>
              <AppText style={styles.badgeIcon}>🌟</AppText>
              <AppText style={styles.badgeValue}>{pct}%</AppText>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${pct}%` }]} />
          </View>
          <View style={styles.badgesRow}>
            {[
              "Explorador Novato",
              "Guardián del Bosque",
              "Maestro Naturalista",
            ].map((badge, index) => (
              <View
                key={badge}
                style={[
                  styles.badgePill,
                  index === 0 && styles.badgePillActive,
                ]}
              >
                <AppText>{index === 0 ? "✅" : "🔒"}</AppText>
                <AppText
                  style={[
                    styles.badgePillText,
                    index === 0 && styles.badgePillTextActive,
                  ]}
                >
                  {badge}
                </AppText>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actionsRow}>
          <PrimaryButton
            title="Comenzar Aventura"
            icon="🗺️"
            onPress={() => router.push("/map")}
          />
          <PrimaryButton
            title="Mi Colección"
            icon="📖"
            variant="secondary"
            onPress={() => router.push("/collection")}
          />
        </View>

        <View style={styles.statsRow}>
          {[
            { icon: "🦜", label: "Fauna única", value: "1,000+" },
            { icon: "🌳", label: "Parques", value: "5" },
            { icon: "🌊", label: "Ecosistemas", value: "3" },
          ].map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <AppText style={styles.statIcon}>{stat.icon}</AppText>
              <AppText variant="subtitle">{stat.value}</AppText>
              <AppText style={styles.statLabel}>{stat.label}</AppText>
            </View>
          ))}
        </View>

        <View style={styles.footerNote}>
          <AppText style={styles.footerText}>
            Puntos acumulados: {points} ⭐
          </AppText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F9F4" },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 24, gap: 14 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
  },
  greeting: { color: "#5A7A5A", fontWeight: "700", marginBottom: 2 },
  collectionButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#3D8B37",
    alignItems: "center",
    justifyContent: "center",
  },
  collectionIcon: { fontSize: 20 },
  heroCard: {
    backgroundColor: "#2E7D32",
    borderRadius: 24,
    padding: 20,
    minHeight: 220,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    overflow: "hidden",
  },
  heroTextWrap: { flex: 1, paddingRight: 12 },
  heroLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    fontWeight: "700",
  },
  heroTitle: { color: "#FFFFFF", fontSize: 22, marginTop: 2, lineHeight: 26 },
  heroMeta: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
  },
  heroMascot: { width: 130, height: 130 },
  progressCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    borderWidth: 2,
    borderColor: "#E8F5E9",
    shadowColor: "#3D8B37",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  progressLabel: { color: "#5A7A5A", fontWeight: "700" },
  progressBadge: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeIcon: { fontSize: 18 },
  badgeValue: { color: "#3D8B37", fontSize: 11, fontWeight: "800" },
  progressBar: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "#E8F5E9",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#3D8B37",
  },
  badgesRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  badgePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#F5F5F5",
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
  },
  badgePillActive: { backgroundColor: "#E8F5E9", borderColor: "#3D8B37" },
  badgePillText: { color: "#9E9E9E", fontSize: 11, fontWeight: "700" },
  badgePillTextActive: { color: "#2E7D32" },
  actionsRow: { gap: 10, marginTop: 2 },
  statsRow: { flexDirection: "row", gap: 8, marginTop: 2 },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 10,
    borderWidth: 1.5,
    borderColor: "#E8F5E9",
    alignItems: "center",
  },
  statIcon: { fontSize: 18 },
  statLabel: {
    color: "#5A7A5A",
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 2,
  },
  footerNote: { marginTop: 4, alignItems: "center" },
  footerText: { color: "#5A7A5A", fontWeight: "700" },
});
