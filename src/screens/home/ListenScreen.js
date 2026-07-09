import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { QuetzalMascot } from "@/components/QuetzalMascot";
import { AppText } from "@/components/ui/AppText";
import { ScreenTopActions } from "@/components/ui/ScreenTopActions";
import { useAppContext } from "@/context/AppContext";
import { useAudio } from "@/context/AudioContext";
import { ANIMALS, hasPlayableSound } from "@/data/animals";
import { MASCOT_AUDIO } from "@/data/mascotAudio";
import { resolveImageSource } from "@/utils/imageSource";

export function ListenScreen() {
  const router = useRouter();
  const { narrationEnabled } = useAppContext();
  const { playSound, playName, playSequence, stopAll } = useAudio();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    playSequence([
      narrationEnabled ? MASCOT_AUDIO.introEscuchar : null,
      narrationEnabled ? MASCOT_AUDIO.instruccionEscuchar : null,
    ]);

    return () => {
      stopAll();
    };
  }, [narrationEnabled, playSequence, stopAll]);

  return (
    <SafeAreaView style={styles.container}>
      <ScreenTopActions containerStyle={{ top: insets.top + 8 }} />
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <AppText style={styles.backText}>{"<"}</AppText>
        </Pressable>
        <View style={styles.headerTextWrap}>
          <AppText variant="title">Escuchar animales</AppText>
          <AppText style={styles.subtitle}>
            Explora y escucha con calma.
          </AppText>
        </View>
        <QuetzalMascot size={70} withHat={false} style={styles.mascot} />
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {ANIMALS.map((animal) => (
          <View key={animal.id} style={styles.card}>
            {animal.image ? (
              <Image
                source={resolveImageSource(animal.image)}
                style={styles.image}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <AppText style={styles.imagePlaceholderIcon}>
                  {animal.emoji}
                </AppText>
              </View>
            )}

            <View style={styles.cardBody}>
              <AppText variant="subtitle" style={styles.animalName}>
                {animal.name}
              </AppText>
              <AppText style={styles.province}>{animal.province}</AppText>
              <AppText style={styles.habitat}>{animal.habitat}</AppText>
            </View>

            <View style={styles.actionsRow}>
              {hasPlayableSound(animal) ? (
                <Pressable
                  style={styles.audioButton}
                  onPress={() => playSound(animal)}
                >
                  <AppText style={styles.audioButtonText}>Sonido</AppText>
                </Pressable>
              ) : null}
              <Pressable
                style={styles.audioButton}
                onPress={() => playName(animal)}
              >
                <AppText style={styles.audioButtonText}>Nombre</AppText>
              </Pressable>
            </View>
          </View>
        ))}
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
  list: {
    gap: 12,
    paddingBottom: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#DFF3D0",
    padding: 12,
    gap: 10,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 16,
    backgroundColor: "#F6FFF2",
  },
  imagePlaceholder: {
    width: "100%",
    height: 150,
    borderRadius: 16,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholderIcon: {
    fontSize: 52,
  },
  cardBody: {
    gap: 4,
  },
  animalName: {
    color: "#174D19",
  },
  province: {
    color: "#1B5E20",
    fontWeight: "800",
  },
  habitat: {
    color: "#5A7A5A",
    fontWeight: "700",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  audioButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    backgroundColor: "#FFE082",
    alignItems: "center",
    justifyContent: "center",
  },
  audioButtonText: {
    color: "#174D19",
    fontSize: 16,
    fontWeight: "800",
  },
});
