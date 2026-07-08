import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, Image, StyleSheet, View } from "react-native";
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
import { ANIMALS } from "@/data/animals";
import { pickCelebrationAudio } from "@/data/mascotAudio";
import { resolveImageSource } from "@/utils/imageSource";


const CONFETTI_COLORS = ["#FFD54F", "#66BB6A", "#4FC3F7", "#FF8A65", "#BA68C8"];
const CONFETTI_ICONS = ["✦", "⭐", "✿", "●"];
const CONFETTI_COUNT = 14;

export function CelebrationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { narrationEnabled } = useAppContext();
  const { playSequence, stopAll } = useAudio();
  const insets = useSafeAreaInsets();

  const animal =
    ANIMALS.find((entry) => entry.id === params.animalId) ?? ANIMALS[0];

  // Se elige una sola vez por celebración, no en cada render.
  const celebrationAudio = useMemo(() => pickCelebrationAudio(), []);

  // --- Animaciones de entrada, todas de una sola pasada (nada en bucle) ---
  const mascotPop = useRef(new Animated.Value(0)).current;
  const mascotBounce = useRef(new Animated.Value(0)).current;
  const titlePop = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(24)).current;
  const cardFade = useRef(new Animated.Value(0)).current;
  const buttonFade = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const confettiItems = useMemo(
    () =>
      Array.from({ length: CONFETTI_COUNT }, (_, index) => ({
        id: index,
        icon: CONFETTI_ICONS[index % CONFETTI_ICONS.length],
        color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
        left: 4 + Math.round((index * 92) / CONFETTI_COUNT) + (index % 3) * 2,
        delay: index * 45,
        distance: 90 + (index % 4) * 24,
        rotateTo: index % 2 === 0 ? "70deg" : "-70deg",
      })),
    [],
  );
  const confettiFall = useRef(
    confettiItems.map(() => new Animated.Value(0)),
  ).current;
  const confettiOpacity = useRef(
    confettiItems.map(() => new Animated.Value(1)),
  ).current;

  // --- Audio: mascota -> sonido real del animal -> nombre hablado.
  // Se reproduce EN ORDEN, esperando a que cada uno termine, para que
  // nunca se encimen entre sí.
  useEffect(() => {
    if (!animal) {
      return;
    }

    playSequence([
      narrationEnabled ? celebrationAudio : null,
      animal.soundUrl ?? animal.soundAsset ?? null,
      narrationEnabled
        ? (animal.nameAudioUrl ?? animal.nameAudioAsset ?? null)
        : null,
    ]);

    return () => {
      stopAll();
    };
  }, [animal, celebrationAudio, narrationEnabled, playSequence, stopAll]);

  // --- Secuencia visual de entrada: mascota -> título -> tarjeta -> botón.
  useEffect(() => {
    const sequence = Animated.sequence([
      Animated.spring(mascotPop, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.spring(titlePop, {
        toValue: 1,
        friction: 6,
        tension: 90,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(cardFade, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(cardSlide, {
          toValue: 0,
          duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(buttonFade, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]);

    sequence.start();

    // La mascota da 3 saltitos suaves de bienvenida y se queda quieta.
    // A propósito NO es un bucle infinito: una animación que nunca se
    // detiene es justo lo que se sentía "trabado" antes.
    const bounce = Animated.loop(
      Animated.sequence([
        Animated.timing(mascotBounce, {
          toValue: -10,
          duration: 260,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(mascotBounce, {
          toValue: 0,
          duration: 260,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      { iterations: 3 },
    );
    bounce.start();

    // Confeti: una sola explosión al entrar, no una lluvia infinita.
    confettiItems.forEach((item, index) => {
      Animated.parallel([
        Animated.timing(confettiFall[index], {
          toValue: 1,
          duration: 900,
          delay: item.delay,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(confettiOpacity[index], {
          toValue: 0,
          duration: 500,
          delay: item.delay + 500,
          useNativeDriver: true,
        }),
      ]).start();
    });

    return () => {
      sequence.stop();
      bounce.stop();
    };
  }, [
    buttonFade,
    cardFade,
    cardSlide,
    confettiFall,
    confettiItems,
    confettiOpacity,
    mascotBounce,
    mascotPop,
    titlePop,
  ]);

  const handleNext = () => {
    stopAll();

    // Si viene como "continue", volvemos a /game preservando la sesión.
    // (GameScreen decide si avanza o reinicia según la sesión almacenada en AppContext.)
    const target = "/game";

    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.96,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => router.replace(target));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenTopActions containerStyle={{ top: insets.top + 8 }} />

      <View style={styles.confettiLayer} pointerEvents="none">
        {confettiItems.map((item, index) => (
          <Animated.View
            key={item.id}
            style={{
              position: "absolute",
              left: `${item.left}%`,
              top: 0,
              opacity: confettiOpacity[index],
              transform: [
                {
                  translateY: confettiFall[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, item.distance],
                  }),
                },
                {
                  rotate: confettiFall[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", item.rotateTo],
                  }),
                },
              ],
            }}
          >
            <AppText style={[styles.confetti, { color: item.color }]}>
              {item.icon}
            </AppText>
          </Animated.View>
        ))}
      </View>

      <View style={styles.content}>
        <Animated.View
          style={{
            transform: [
              { translateY: mascotBounce },
              {
                scale: mascotPop.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.4, 1],
                }),
              },
            ],
          }}
        >
          <QuetzalMascot size={140} style={styles.mascot} />
        </Animated.View>

        <Animated.View
          style={{
            opacity: titlePop,
            transform: [
              {
                scale: titlePop.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.7, 1],
                }),
              },
            ],
          }}
        >
          <AppText variant="title" style={styles.title}>
            ¡Sí, lo encontraste!
          </AppText>
          <AppText style={styles.subtitle}>
            Una estrella más para tu aventura.
          </AppText>
        </Animated.View>

        <Animated.View
          style={[
            styles.card,
            {
              opacity: cardFade,
              transform: [{ translateY: cardSlide }],
            },
          ]}
        >
          <Image
            source={resolveImageSource(animal.image)}
            style={styles.image}
          />
          <AppText variant="subtitle" style={styles.animalName}>
            {animal.name}
          </AppText>
        </Animated.View>

        <Animated.View
          style={{
            opacity: buttonFade,
            transform: [{ scale: buttonScale }],
          }}
        >
          <PrimaryButton title="Siguiente" onPress={handleNext} />
        </Animated.View>
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
  confettiLayer: {
    position: "absolute",
    top: 70,
    left: 0,
    right: 0,
    height: 140,
  },
  confetti: {
    fontSize: 26,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  mascot: {
    marginVertical: 8,
  },
  title: {
    color: "#1B5E20",
    marginTop: 4,
    textAlign: "center",
  },
  subtitle: {
    color: "#4E7A4B",
    fontWeight: "700",
    marginTop: 4,
    textAlign: "center",
  },
  card: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#FFD54F",
    padding: 12,
    marginTop: 16,
    marginBottom: 20,
    alignItems: "center",
  },
  image: {
    width: 220,
    height: 180,
    borderRadius: 18,
  },
  animalName: {
    marginTop: 10,
    color: "#1B5E20",
  },
});
