import { useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import { Animated, StyleSheet, View } from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

import { QuetzalMascot } from "@/components/QuetzalMascot";
import { AppText } from "@/components/ui/AppText";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ScreenTopActions } from "@/components/ui/ScreenTopActions";
import { useAppContext } from "@/context/AppContext";
import { useAudio } from "@/context/AudioContext";
import { MASCOT_AUDIO } from "@/data/mascotAudio";

export function ForestCompleteScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { narrationEnabled, resetProgress } = useAppContext();
  const { playSequence, stopAll } = useAudio();

  const mascotPop = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    playSequence([narrationEnabled ? MASCOT_AUDIO.celebracion1 : null]);
    Animated.spring(mascotPop, {
      toValue: 1,
      friction: 6,
      tension: 90,
      useNativeDriver: true,
    }).start();

    return () => {
      stopAll();
    };
  }, [MASCOT_AUDIO.celebracion1, narrationEnabled, playSequence, mascotPop, stopAll]);

  const handleBackHome = () => {
    stopAll();
    // Opcional: resetProgress solo si quieres que las estrellas/descubrimientos
    // reinicien. Por ahora NO lo hacemos para que el progreso del niño se conserve.
    router.replace("/home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenTopActions containerStyle={{ top: insets.top + 8 }} />

      <View style={styles.content}>
        <Animated.View
          style={{
            transform: [
              {
                scale: mascotPop.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.6, 1],
                }),
              },
            ],
          }}
        >
          <QuetzalMascot size={140} style={styles.mascot} />
        </Animated.View>

        <AppText variant="title" style={styles.title}>
          ¡Completaste el bosque!
        </AppText>
        <AppText style={styles.subtitle}>
          Buen trabajo. Vuelve a jugar cuando quieras.
        </AppText>

        <View style={styles.buttonWrap}>
          <PrimaryButton title="Volver" onPress={handleBackHome} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8DB",
    paddingHorizontal: 20,
    paddingTop: 84,
    paddingBottom: 28,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  mascot: {
    marginBottom: 2,
  },
  title: {
    color: "#1B5E20",
    textAlign: "center",
    marginTop: 10,
  },
  subtitle: {
    color: "#4E7A4B",
    fontWeight: "700",
    textAlign: "center",
  },
  buttonWrap: {
    marginTop: 18,
    width: "100%",
    maxWidth: 320,
  },
});

