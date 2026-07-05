import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef } from "react";
import type { ImageSourcePropType } from "react-native";
import { Animated, Image, StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { QuetzalMascot } from "@/components/QuetzalMascot";
import { AppText } from "@/components/ui/AppText";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ScreenTopActions } from "@/components/ui/ScreenTopActions";
import { ANIMALS } from "@/data/animals";
import { useAnimalAudio } from "@/services/audio";
import { resolveImageSource } from "@/utils/imageSource";

export function CelebrationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ animalId?: string }>();
  const { playSound, playName } = useAnimalAudio();
  const insets = useSafeAreaInsets();
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.96)).current;
  const quetzalY = useRef(new Animated.Value(0)).current;
  const quetzalScale = useRef(new Animated.Value(1)).current;
  const quetzalRotate = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const confettiValues = useRef(
    Array.from({ length: 8 }, () => new Animated.Value(0)),
  ).current;
  const animal =
    ANIMALS.find((entry) => entry.id === params.animalId) ?? ANIMALS[0];
  const confettiItems = useMemo(
    () =>
      Array.from({ length: 8 }, (_, index) => ({
        id: index,
        icon: index % 2 === 0 ? "✦" : "⭐",
        left: 12 + index * 10,
        delay: index * 90,
      })),
    [],
  );

  useEffect(() => {
    if (animal) {
      playSound(animal);
      playName(animal);
    }
  }, [animal, playName, playSound]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 360,
        useNativeDriver: true,
      }),
    ]).start();

    const quetzalLoop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(quetzalY, {
            toValue: -8,
            duration: 260,
            useNativeDriver: true,
          }),
          Animated.timing(quetzalY, {
            toValue: 0,
            duration: 260,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(quetzalScale, {
            toValue: 1.04,
            duration: 260,
            useNativeDriver: true,
          }),
          Animated.timing(quetzalScale, {
            toValue: 1,
            duration: 260,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(quetzalRotate, {
            toValue: -2,
            duration: 320,
            useNativeDriver: true,
          }),
          Animated.timing(quetzalRotate, {
            toValue: 2,
            duration: 320,
            useNativeDriver: true,
          }),
          Animated.timing(quetzalRotate, {
            toValue: 0,
            duration: 320,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    quetzalLoop.start();

    confettiValues.forEach((value, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: -26,
            duration: 1000 + index * 70,
            delay: confettiItems[index].delay,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    });

    return () => {
      quetzalLoop.stop();
      confettiValues.forEach((value) => value.stopAnimation());
    };
  }, [
    confettiItems,
    confettiValues,
    fade,
    quetzalRotate,
    quetzalScale,
    quetzalY,
    scale,
  ]);

  const handleNext = () => {
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
    ]).start(() => router.replace("/game"));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenTopActions containerStyle={{ top: insets.top + 8 }} />
      <Animated.View
        style={[styles.content, { opacity: fade, transform: [{ scale }] }]}
      >
        <View style={styles.confettiRow}>
          {confettiItems.map((item) => (
            <Animated.View
              key={item.id}
              style={{
                transform: [{ translateY: confettiValues[item.id] }],
                left: item.left,
                position: "absolute",
                top: 10,
              }}
            >
              <AppText style={styles.confetti}>{item.icon}</AppText>
            </Animated.View>
          ))}
        </View>

        <Animated.View
          style={{
            transform: [
              { translateY: quetzalY },
              { scale: quetzalScale },
              {
                rotate: quetzalRotate.interpolate({
                  inputRange: [-2, 2],
                  outputRange: ["-2deg", "2deg"],
                }),
              },
            ],
          }}
        >
          <QuetzalMascot
            size={140}
            style={styles.mascot}
            speakAudio="https://actions.google.com/sounds/v1/animals/bird_chirp_1.mp3"
          />
        </Animated.View>
        <AppText variant="title" style={styles.title}>
          ¡Excelente!
        </AppText>
        <AppText style={styles.subtitle}>
          Una estrella más para tu aventura.
        </AppText>

        <View style={styles.card}>
          <Image
            source={
              resolveImageSource(animal.image) as
                | ImageSourcePropType
                | undefined
            }
            style={styles.image}
          />
          <AppText variant="subtitle" style={styles.animalName}>
            {animal.name}
          </AppText>
        </View>

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <PrimaryButton title="Siguiente" onPress={handleNext} />
        </Animated.View>
      </Animated.View>
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
  },
  confettiRow: {
    height: 44,
    width: "100%",
    marginBottom: 4,
  },
  confetti: {
    fontSize: 24,
  },
  mascot: {
    marginVertical: 8,
  },
  title: {
    color: "#1B5E20",
    marginTop: 4,
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
