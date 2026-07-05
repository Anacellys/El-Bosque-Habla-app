import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/ui/AppText";
import { useAppContext } from "@/context/AppContext";
import { ANIMALS, PROVINCES } from "@/data/app-data";
import { getCachedImageUri } from "@/utils/imageCache";
import { resolveImageSource } from "@/utils/imageSource";

const BADGES = [
  {
    id: "novato",
    name: "Explorador Novato",
    icon: "",
    req: 1,
    desc: "Descubre tu primer animal",
  },
  {
    id: "aventurero",
    name: "Aventurero",
    icon: "",
    req: 3,
    desc: "Descubre 3 animales",
  },
  {
    id: "guardian",
    name: "Guardián del Bosque",
    icon: "",
    req: 5,
    desc: "Descubre 5 animales",
  },
  {
    id: "maestro",
    name: "Maestro Naturalista",
    icon: "",
    req: 8,
    desc: "Descubre todos los animales",
  },
];

export function CollectionScreen() {
  const router = useRouter();
  const { discoveries, points, selectAnimal } = useAppContext();
  const found = discoveries.length;
  const total = ANIMALS.length;
  const pct = Math.round((found / total) * 100);

  const handleAnimalPress = (animalId: string) => {
    selectAnimal(animalId);
    router.push("/animal-info");
  };

  useEffect(() => {
    // Prefetch discovered animals images into cache
    (async () => {
      for (const id of discoveries) {
        const a = ANIMALS.find((x) => x.id === id);
        if (a && typeof a.image === "string") {
          getCachedImageUri(a.id, a.image as string).catch(() => {});
        }
      }
    })();
  }, [discoveries]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <AppText style={styles.backIcon}>←</AppText>
          </Pressable>
          <View>
            <AppText variant="title" style={styles.headerTitle}>
              Mi Colección
            </AppText>
            <AppText style={styles.headerSubtitle}>
              Álbum del Explorador 📖
            </AppText>
          </View>
        </View>

        <View style={styles.statsRow}>
          {[
            { label: "Animales", value: `${found}/${total}`, icon: "🦜" },
            { label: "Puntos", value: points, icon: "⭐" },
            {
              label: "Provincias",
              value: PROVINCES.filter((province) =>
                province.animals.some((animalId) =>
                  discoveries.includes(animalId),
                ),
              ).length,
              icon: "🗺️",
            },
          ].map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <AppText style={styles.statIcon}>{stat.icon}</AppText>
              <AppText variant="subtitle" style={styles.statValue}>
                {stat.value}
              </AppText>
              <AppText style={styles.statLabel}>{stat.label}</AppText>
            </View>
          ))}
        </View>

        <View style={styles.progressWrap}>
          <View style={styles.progressHeader}>
            <AppText style={styles.progressText}>Progreso total</AppText>
            <AppText style={styles.progressPercent}>{pct}%</AppText>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${pct}%` }]} />
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionTitleWrap}>
          <AppText style={styles.sectionTitle}>🏅 INSIGNIAS</AppText>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.badgesRow}
        >
          {BADGES.map((badge) => {
            const earned = found >= badge.req;
            return (
              <View
                key={badge.id}
                style={[
                  styles.badgeCard,
                  earned ? styles.badgeCardEarned : styles.badgeCardLocked,
                ]}
              >
                <View
                  style={[
                    styles.badgeIconWrap,
                    earned
                      ? styles.badgeIconWrapEarned
                      : styles.badgeIconWrapLocked,
                  ]}
                >
                  <AppText style={styles.badgeIcon}>{badge.icon}</AppText>
                </View>
                <AppText
                  style={[
                    styles.badgeName,
                    earned ? styles.badgeNameActive : styles.badgeNameLocked,
                  ]}
                >
                  {badge.name}
                </AppText>
                {!earned ? (
                  <AppText style={styles.badgeHint}>
                    🔒 {badge.req} animales
                  </AppText>
                ) : (
                  <AppText style={styles.badgeDone}>✅ ¡Logrado!</AppText>
                )}
              </View>
            );
          })}
        </ScrollView>

        {PROVINCES.map((province) => {
          const provinceAnimals = ANIMALS.filter(
            (animal) => animal.provinceId === province.id,
          );
          return (
            <View key={province.id} style={styles.provinceSection}>
              <View style={styles.provinceHeading}>
                <AppText style={styles.provinceEmoji}>{province.emoji}</AppText>
                <AppText variant="subtitle">{province.name}</AppText>
                <View
                  style={[
                    styles.provinceCount,
                    { backgroundColor: province.bgColor },
                  ]}
                >
                  <AppText
                    style={[
                      styles.provinceCountText,
                      { color: province.color },
                    ]}
                  >
                    {
                      provinceAnimals.filter((animal) =>
                        discoveries.includes(animal.id),
                      ).length
                    }
                    /{provinceAnimals.length}
                  </AppText>
                </View>
              </View>
              <View style={styles.animalsGrid}>
                {provinceAnimals.map((animal) => {
                  const isDiscovered = discoveries.includes(animal.id);
                  return (
                    <Pressable
                      key={animal.id}
                      style={[
                        styles.animalCard,
                        isDiscovered
                          ? styles.animalCardActive
                          : styles.animalCardLocked,
                      ]}
                      onPress={() =>
                        isDiscovered && handleAnimalPress(animal.id)
                      }
                    >
                      <View
                        style={[
                          styles.animalEmojiWrap,
                          isDiscovered
                            ? { backgroundColor: province.bgColor }
                            : styles.animalEmojiWrapLocked,
                        ]}
                      >
                        {isDiscovered && animal.image ? (
                          <Image
                            source={resolveImageSource(animal.image)}
                            style={styles.animalImage}
                          />
                        ) : (
                          <AppText style={styles.animalEmoji}>
                            {isDiscovered ? animal.emoji : "❓"}
                          </AppText>
                        )}
                      </View>
                      <AppText
                        style={[
                          styles.animalName,
                          isDiscovered
                            ? styles.animalNameActive
                            : styles.animalNameLocked,
                        ]}
                      >
                        {isDiscovered ? animal.name : "???"}
                      </AppText>
                      {isDiscovered ? (
                        <AppText style={styles.animalMeta}>
                          📍 {province.region}
                        </AppText>
                      ) : (
                        <AppText style={styles.animalMetaLocked}>
                          🔒 Por descubrir
                        </AppText>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F9F4" },
  header: {
    backgroundColor: "#1B5E20",
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 18,
  },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
  },
  backIcon: { color: "#FFFFFF", fontSize: 18 },
  headerTitle: { color: "#FFFFFF", fontSize: 22 },
  headerSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontWeight: "700",
  },
  statsRow: { flexDirection: "row", gap: 8, marginTop: 14 },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
  },
  statIcon: { fontSize: 16 },
  statValue: { color: "#FFFFFF", fontSize: 16 },
  statLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 10,
    fontWeight: "700",
  },
  progressWrap: { marginTop: 12 },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  progressText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 11,
    fontWeight: "700",
  },
  progressPercent: { color: "#FFD54F", fontSize: 11, fontWeight: "900" },
  progressBar: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#FFD54F",
  },
  content: { padding: 18, gap: 14, paddingBottom: 24 },
  sectionTitleWrap: { paddingBottom: 2 },
  sectionTitle: { color: "#5A7A5A", fontWeight: "800" },
  badgesRow: { gap: 10, paddingBottom: 4 },
  badgeCard: {
    width: 100,
    borderRadius: 16,
    padding: 10,
    alignItems: "center",
    borderWidth: 2,
  },
  badgeCardEarned: { backgroundColor: "#FFFFFF", borderColor: "#3D8B37" },
  badgeCardLocked: { backgroundColor: "#F5F5F5", borderColor: "#E0E0E0" },
  badgeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeIconWrapEarned: { backgroundColor: "#E8F5E9" },
  badgeIconWrapLocked: { backgroundColor: "#EEEEEE" },
  badgeIcon: { fontSize: 22 },
  badgeName: {
    marginTop: 6,
    fontSize: 10,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 12,
  },
  badgeNameActive: { color: "#1A3A1A" },
  badgeNameLocked: { color: "#9E9E9E" },
  badgeHint: {
    marginTop: 4,
    color: "#BDBDBD",
    fontSize: 9,
    textAlign: "center",
  },
  badgeDone: { marginTop: 4, color: "#3D8B37", fontSize: 9, fontWeight: "800" },
  provinceSection: { gap: 8 },
  provinceHeading: { flexDirection: "row", alignItems: "center", gap: 6 },
  provinceEmoji: { fontSize: 18 },
  provinceCount: {
    marginLeft: "auto",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  provinceCountText: { fontSize: 11, fontWeight: "800" },
  animalsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  animalCard: { width: "47%", borderRadius: 16, padding: 8, borderWidth: 2 },
  animalCardActive: { backgroundColor: "#FFFFFF", borderColor: "#3D8B37" },
  animalCardLocked: { backgroundColor: "#F5F5F5", borderColor: "#E8F5E9" },
  animalEmojiWrap: {
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  animalEmojiWrapLocked: { backgroundColor: "#EEEEEE" },
  animalEmoji: { fontSize: 36 },
  animalImage: { width: 56, height: 56, borderRadius: 8 },
  animalName: { marginTop: 6, fontSize: 12, fontWeight: "800" },
  animalNameActive: { color: "#1A3A1A" },
  animalNameLocked: { color: "#9E9E9E" },
  animalMeta: {
    color: "#5A7A5A",
    fontSize: 10,
    fontWeight: "700",
    marginTop: 2,
  },
  animalMetaLocked: {
    color: "#BDBDBD",
    fontSize: 10,
    fontWeight: "700",
    marginTop: 2,
  },
});
