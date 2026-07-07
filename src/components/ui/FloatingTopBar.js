import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";

import { AppText } from "./AppText";

export function FloatingTopBar({
  onHomePress,
  onSettingsPress,
}) {
  const homeScale = useRef(new Animated.Value(1)).current;
  const settingsScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    return () => {
      homeScale.stopAnimation();
      settingsScale.stopAnimation();
    };
  }, [homeScale, settingsScale]);

  const animatePress = (value) => {
    Animated.sequence([
      Animated.timing(value, {
        toValue: 0.92,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: 1,
        duration: 90,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      <Animated.View style={{ transform: [{ scale: homeScale }] }}>
        <Pressable
          style={styles.button}
          onPress={() => {
            animatePress(homeScale);
            onHomePress();
          }}
          accessibilityLabel="Volver al inicio"
        >
          <AppText style={styles.buttonText}>🏠</AppText>
        </Pressable>
      </Animated.View>

      <Animated.View style={{ transform: [{ scale: settingsScale }] }}>
        <Pressable
          style={styles.button}
          onPress={() => {
            animatePress(settingsScale);
            onSettingsPress();
          }}
          accessibilityLabel="Abrir configuración"
        >
          <AppText style={styles.buttonText}>⚙️</AppText>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#DFF3D0",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1B5E20",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  buttonText: {
    fontSize: 22,
  },
});
