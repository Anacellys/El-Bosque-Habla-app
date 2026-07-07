import { useRouter } from "expo-router";
import { useRef } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

export function ScreenTopActions({ containerStyle }) {
  const router = useRouter();
  const homeScale = useRef(new Animated.Value(1)).current;
  const settingsScale = useRef(new Animated.Value(1)).current;

  const animatePressIn = (value) => {
    Animated.spring(value, {
      toValue: 0.94,
      friction: 6,
      tension: 220,
      useNativeDriver: true,
    }).start();
  };

  const animatePressOut = (value) => {
    Animated.spring(value, {
      toValue: 1,
      friction: 6,
      tension: 220,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={[styles.container, containerStyle]} pointerEvents="box-none">
      <Animated.View style={{ transform: [{ scale: homeScale }] }}>
        <Pressable
          accessibilityLabel="Volver al inicio"
          style={styles.button}
          onPressIn={() => animatePressIn(homeScale)}
          onPressOut={() => animatePressOut(homeScale)}
          onPress={() => router.replace("/home")}
        >
          <HomeIcon />
        </Pressable>
      </Animated.View>

      <Animated.View style={{ transform: [{ scale: settingsScale }] }}>
        <Pressable
          accessibilityLabel="Abrir ajustes"
          style={styles.button}
          onPressIn={() => animatePressIn(settingsScale)}
          onPressOut={() => animatePressOut(settingsScale)}
          onPress={() => router.push("/parents")}
        >
          <SettingsIcon />
        </Pressable>
      </Animated.View>
    </View>
  );
}

function HomeIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"
        stroke="#1B5E20"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SettingsIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="3" stroke="#1B5E20" strokeWidth={2} />
      <Path
        d="M19 12a7.4 7.4 0 0 0-.08-.83l2.03-1.58-2-3.46-2.42 1a7.9 7.9 0 0 0-1.44-.83L15 2h-4l-.47 2.33a7.9 7.9 0 0 0-1.44.83l-2.42-1-2 3.46 2.03 1.58A7.4 7.4 0 0 0 5 12c0 .29.03.57.08.83L3.05 14.41l2 3.46 2.42-1c.43.34.9.6 1.44.83L11 22h4l.47-2.33a7.9 7.9 0 0 0 1.44-.83l2.42 1 2-3.46-2.03-1.58c.05-.26.08-.54.08-.83Z"
        stroke="#1B5E20"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 10,
    left: 16,
    right: 16,
    zIndex: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#DFF3D0",
    shadowColor: "#3F6B2A",
    shadowOpacity: 0.16,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
});
