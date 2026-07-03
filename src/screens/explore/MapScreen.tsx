import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/ui/AppText";
import { useAppContext } from "@/context/AppContext";
import { PARKS } from "@/data/app-data";

export function MapScreen() {
  const router = useRouter();
  const { discoveries, selectPark } = useAppContext();

  const handleSelectPark = (parkId: string) => {
    selectPark(parkId);
    router.push("/exploration");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <AppText style={styles.backIcon}>←</AppText>
        </Pressable>
        <View>
          <AppText variant="subtitle">Mapa de Aventuras</AppText>
          <AppText style={styles.subtitle}>Elige tu destino 🗺️</AppText>
        </View>
      </View>

      <View style={styles.mapCard}>
        <AppText style={styles.mapHint}>OCÉANO PACÍFICO</AppText>
        <AppText style={styles.mapHintRight}>MAR CARIBE</AppText>
        <View style={styles.mapShape} />
        <View style={styles.canalMark}>
          <AppText style={styles.canalText}>Canal 🚢</AppText>
        </View>
        {PARKS.map((park) => {
          const hasDiscovery = park.animals.some((animalId) =>
            discoveries.includes(animalId),
          );
          return (
            <Pressable
              key={park.id}
              style={[
                styles.parkPoint,
                { left: `${park.x}%`, top: `${park.y}%` },
              ]}
              onPress={() => handleSelectPark(park.id)}
            >
              <View style={[styles.parkBadge, { backgroundColor: park.color }]}>
                <AppText style={styles.parkEmoji}>{park.emoji}</AppText>
                {hasDiscovery ? <View style={styles.discoveryDot} /> : null}
              </View>
              <View style={styles.parkLabel}>
                <AppText
                  style={{ color: park.color, fontSize: 9, fontWeight: "800" }}
                >
                  {park.name}
                </AppText>
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.listHeader}>
        <AppText style={styles.listTitle}>Destinos disponibles</AppText>
      </View>
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {PARKS.map((park) => {
          const hasDiscovery = park.animals.some((animalId) =>
            discoveries.includes(animalId),
          );
          return (
            <Pressable
              key={park.id}
              style={[styles.parkCard, hasDiscovery && styles.parkCardActive]}
              onPress={() => handleSelectPark(park.id)}
            >
              <View
                style={[styles.parkIconWrap, { backgroundColor: park.bgColor }]}
              >
                <AppText style={styles.parkEmoji}>{park.emoji}</AppText>
              </View>
              <View style={styles.parkCardBody}>
                <AppText variant="subtitle">{park.name}</AppText>
                <AppText style={styles.parkRegion}>
                  {park.region} • {park.animals.length} animales
                </AppText>
                {hasDiscovery ? (
                  <AppText
                    style={[styles.discoveryNote, { color: park.color }]}
                  >
                    ⭐ ¡Ya exploraste aquí!
                  </AppText>
                ) : null}
              </View>
              <View
                style={[styles.arrowBadge, { backgroundColor: park.color }]}
              >
                <AppText style={styles.arrowText}>→</AppText>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F9F4" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#E8F5E9",
  },
  backIcon: { fontSize: 18 },
  subtitle: { color: "#5A7A5A", fontWeight: "700" },
  mapCard: {
    marginHorizontal: 18,
    height: 240,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "#B2DFDB",
    backgroundColor: "#D8F3DC",
    overflow: "hidden",
    position: "relative",
  },
  mapHint: {
    position: "absolute",
    top: 10,
    left: 10,
    fontSize: 10,
    color: "#1565C0",
    fontWeight: "800",
  },
  mapHintRight: {
    position: "absolute",
    top: 10,
    right: 10,
    fontSize: 10,
    color: "#1565C0",
    fontWeight: "800",
    textAlign: "right",
  },
  mapShape: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#8BC34A",
    opacity: 0.35,
  },
  canalMark: {
    position: "absolute",
    top: "50%",
    left: "52%",
    transform: [{ translateX: -20 }, { translateY: -18 }],
    alignItems: "center",
  },
  canalText: { fontSize: 10, fontWeight: "800", color: "#0277BD" },
  parkPoint: {
    position: "absolute",
    alignItems: "center",
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
  parkBadge: {
    width: 42,
    height: 42,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  parkEmoji: { fontSize: 18 },
  discoveryDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#FFD54F",
  },
  parkLabel: {
    marginTop: 4,
    maxWidth: 72,
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  listHeader: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 8 },
  listTitle: { color: "#5A7A5A", fontWeight: "800" },
  listContent: { paddingHorizontal: 18, gap: 10, paddingBottom: 24 },
  parkCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E8F5E9",
  },
  parkCardActive: {
    borderColor: "#3D8B37",
    shadowColor: "#3D8B37",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 2,
  },
  parkIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  parkCardBody: { flex: 1, gap: 2 },
  parkRegion: { color: "#5A7A5A", fontWeight: "700" },
  discoveryNote: { fontSize: 11, fontWeight: "800", marginTop: 2 },
  arrowBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowText: { color: "#FFFFFF", fontSize: 16, fontWeight: "900" },
});
