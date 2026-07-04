import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { QuetzalMascot } from "@/components/QuetzalMascot";
import { AppText } from "@/components/ui/AppText";

export function SplashScreen() {
  const router = useRouter();
  const [pressed, setPressed] = useState(false);
  const scale = useState(new Animated.Value(1))[0];

  useEffect(() => {
    Animated.timing(scale, {
      toValue: 1.02,
      duration: 700,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(scale, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }).start();
    });
  }, [scale]);

  const handlePress = () => {
    setPressed(true);
    setTimeout(() => router.replace("/home"), 250);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.decor} />
      <View style={styles.topArea}>
        <View style={styles.logoBox}>
          <QuetzalMascot size={80} withHat={false} style={styles.logoIcon} />
        </View>
        <AppText variant="title" style={styles.title}>
          El Bosque Habla
        </AppText>
        <View style={styles.badge}>
          <AppText style={styles.badgeText}>
            Descubre la fauna de Panamá
          </AppText>
        </View>
      </View>

      <Animated.View style={[styles.mascotWrap, { transform: [{ scale }] }]}>
        <QuetzalMascot size={180} style={styles.mascot} />
      </Animated.View>

      <View style={styles.bottomArea}>
        <Pressable
          onPress={handlePress}
          style={[styles.button, pressed && styles.buttonPressed]}
        >
          <AppText variant="subtitle" style={styles.buttonText}>
            ¡Vamos!
          </AppText>
        </Pressable>
        <AppText style={styles.footer}>Turismo Ecológico Panameño 🇵🇦</AppText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B5E20",
    justifyContent: "space-between",
  },
  decor: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#2E7D32",
    opacity: 0.65,
  },
  topArea: {
    alignItems: "center",
    paddingTop: 40,
    gap: 12,
  },
  logoBox: {
    width: 108,
    height: 108,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.28)",
  },
  logoIcon: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 38,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 40,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  mascotWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  mascot: {
    width: 180,
    height: 180,
  },
  bottomArea: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
    alignItems: "center",
  },
  button: {
    width: "100%",
    minHeight: 64,
    borderRadius: 22,
    backgroundColor: "#FFD54F",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonPressed: {
    transform: [{ scale: 0.97 }],
  },
  buttonText: {
    color: "#1A3A1A",
    fontSize: 20,
  },
  footer: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
    fontWeight: "700",
  },
});
