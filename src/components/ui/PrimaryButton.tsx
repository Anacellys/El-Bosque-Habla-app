import { Pressable, StyleSheet, View } from "react-native";

import { AppText } from "./AppText";

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  onLongPress?: () => void;
  icon?: string;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

export function PrimaryButton({
  title,
  onPress,
  onLongPress,
  icon,
  variant = "primary",
  disabled,
}: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        variant === "primary" ? styles.primary : styles.secondary,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      {icon ? (
        <View style={styles.iconWrap}>
          <AppText variant="subtitle">{icon}</AppText>
        </View>
      ) : null}
      <AppText
        variant="subtitle"
        color={variant === "primary" ? "#FFFFFF" : "#2E7D32"}
      >
        {title}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    minHeight: 56,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primary: {
    backgroundColor: "#3D8B37",
  },
  secondary: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#3D8B37",
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
  disabled: {
    opacity: 0.6,
  },
  iconWrap: {
    marginRight: 6,
  },
});
