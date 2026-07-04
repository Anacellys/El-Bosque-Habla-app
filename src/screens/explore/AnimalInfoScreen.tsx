import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/ui/AppText";
import { useAppContext } from "@/context/AppContext";
import { ANIMALS } from "@/data/app-data";
import { getCachedImageUri } from "@/utils/imageCache";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";

const ANIMAL_COLORS: Record<string, string> = {
  quetzal: "#1B5E20",
  "aguila-arpía": "#4E342E",
  jaguar: "#E65100",
  nutria: "#0D47A1",
  tortuga: "#1B5E20",
  tapir: "#37474F",
  "mono-aullador": "#4E342E",
  tucan: "#E65100",
};

const ANIMAL_STATS: Record<
  string,
  { weight: string; size: string; diet: string; status: string }
> = {
  quetzal: {
    weight: "180-230 g",
    size: "36-40 cm",
    diet: "Frutas e insectos",
    status: "En peligro",
  },
  "aguila-arpía": {
    weight: "4-9 kg",
    size: "86-107 cm",
    diet: "Mamíferos medianos",
    status: "Vulnerable",
  },
  jaguar: {
    weight: "56-96 kg",
    size: "112-185 cm",
    diet: "Carnívoro",
    status: "Casi amenazado",
  },
  nutria: {
    weight: "14-45 kg",
    size: "90-150 cm",
    diet: "Peces y mariscos",
    status: "En peligro",
  },
  tortuga: {
    weight: "68-190 kg",
    size: "100-120 cm",
    diet: "Herbívora marina",
    status: "En peligro",
  },
  tapir: {
    weight: "150-300 kg",
    size: "180-250 cm",
    diet: "Hojas y frutas",
    status: "Vulnerable",
  },
  "mono-aullador": {
    weight: "5-9 kg",
    size: "56-91 cm",
    diet: "Hojas y frutas",
    status: "Preocupación menor",
  },
  tucan: {
    weight: "500-860 g",
    size: "55-65 cm",
    diet: "Frutas e insectos",
    status: "Preocupación menor",
  },
};

export function AnimalInfoScreen() {
  const router = useRouter();
  const { selectedAnimalId } = useAppContext();
  const animal = ANIMALS.find((entry) => entry.id === selectedAnimalId);
  const stats = animal ? ANIMAL_STATS[animal.id] : undefined;

  if (!animal) {
    return null;
  }

  const player = useAudioPlayer(animal.soundUrl ?? null);
  const status = useAudioPlayerStatus(player as any);
  const [playing, setPlaying] = useState(false);
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);

  async function handlePlaySound() {
    try {
      if (!animal || !animal.soundUrl) return;

      // If already playing, pause
      if (status?.playing) {
        player.pause();
        setPlaying(false);
        return;
      }

      // Replace source (safe for remote URLs) and start playback
      // `replace` is idempotent if the same source is already loaded
      try {
        // some players may not need replace, but call it to ensure the right source
        player.replace(animal.soundUrl as any);
      } catch (e) {
        // ignore if replace isn't supported on the current runtime
      }

      player.play();
      setPlaying(true);
    } catch (err) {
      setPlaying(false);
    }
  }

  // Update local playing state based on player status
  useEffect(() => {
    if (!status) return;
    if ((status as any).didJustFinish) {
      setPlaying(false);
    } else if ((status as any).playing) {
      setPlaying(true);
    } else {
      setPlaying(false);
    }
  }, [status]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!animal) return;
      if (typeof animal.image === "string") {
        const uri = await getCachedImageUri(animal.id, animal.image as string);
        if (mounted && uri) setLocalImageUri(uri);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [animal]);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[styles.hero, { backgroundColor: ANIMAL_COLORS[animal.id] }]}
      >
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <AppText style={styles.backIcon}>←</AppText>
        </Pressable>
        <AppText style={styles.heroBadge}>🦎 ANIMAL DESCUBIERTO</AppText>
        <AppText variant="title" style={styles.heroTitle}>
          {animal.name}
        </AppText>
        {localImageUri ? (
          <Image source={{ uri: localImageUri }} style={styles.heroImage} />
        ) : animal.image ? (
          <Image
            source={
              typeof animal.image === "string"
                ? { uri: animal.image }
                : animal.image
            }
            style={styles.heroImage}
          />
        ) : (
          <AppText style={styles.heroEmoji}>{animal.emoji}</AppText>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoCard}>
          <View style={styles.infoIconWrap}>
            <AppText style={styles.infoIcon}>📍</AppText>
          </View>
          <View>
            <AppText style={styles.infoLabel}>UBICACIÓN EN PANAMÁ</AppText>
            <AppText variant="subtitle">{animal.park}</AppText>
          </View>
        </View>

        <View style={styles.factCard}>
          <AppText style={styles.factLabel}>🌟 DATO CURIOSO</AppText>
          <AppText style={styles.factText}>{animal.fact}</AppText>
        </View>

        <View style={{ marginTop: 8 }}>
          <Pressable style={styles.playButton} onPress={handlePlaySound}>
            <AppText style={styles.playButtonText}>
              {playing ? "Detener sonido" : "Escuchar sonido del animal"}
            </AppText>
          </Pressable>
        </View>

        {stats ? (
          <View style={styles.statsWrap}>
            <AppText style={styles.statsTitle}>📊 FICHA TÉCNICA</AppText>
            <View style={styles.statsGrid}>
              {[
                { label: "Peso", value: stats.weight, icon: "⚖️" },
                { label: "Tamaño", value: stats.size, icon: "📏" },
                { label: "Alimentación", value: stats.diet, icon: "🍃" },
                { label: "Estado", value: stats.status, icon: "🛡️" },
              ].map((item) => (
                <View key={item.label} style={styles.statCard}>
                  <AppText style={styles.statIcon}>{item.icon}</AppText>
                  <AppText style={styles.statLabel}>{item.label}</AppText>
                  <AppText variant="subtitle">{item.value}</AppText>
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F9F4" },
  hero: {
    minHeight: 260,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 24,
    position: "relative",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
  },
  backIcon: { color: "#FFFFFF", fontSize: 18 },
  heroBadge: {
    marginTop: 28,
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    fontWeight: "800",
  },
  heroTitle: { marginTop: 6, color: "#FFFFFF", fontSize: 28 },
  heroEmoji: { position: "absolute", right: 18, bottom: 12, fontSize: 110 },
  heroImage: {
    position: "absolute",
    right: 18,
    bottom: 12,
    width: 140,
    height: 140,
    borderRadius: 12,
  },
  content: { padding: 18, gap: 12, paddingBottom: 24 },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 2,
    borderColor: "#E8F5E9",
  },
  infoIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
  },
  infoIcon: { fontSize: 20 },
  infoLabel: { color: "#5A7A5A", fontSize: 11, fontWeight: "700" },
  factCard: {
    backgroundColor: "#E8F5E9",
    borderRadius: 20,
    padding: 14,
    borderWidth: 2,
    borderColor: "#C8E6C9",
  },
  factLabel: {
    color: "#5A7A5A",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 6,
  },
  factText: { color: "#1A3A1A", fontWeight: "700", lineHeight: 20 },
  statsWrap: { gap: 8 },
  statsTitle: { color: "#5A7A5A", fontSize: 13, fontWeight: "800" },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  statCard: {
    width: "47%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    borderWidth: 2,
    borderColor: "#E8F5E9",
  },
  statIcon: { fontSize: 18 },
  statLabel: { color: "#5A7A5A", fontSize: 11, fontWeight: "700" },
  playButton: {
    backgroundColor: "#2E7D32",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  playButtonText: { color: "#FFFFFF", fontWeight: "800" },
});
