import { StyleSheet, Text, type TextProps } from "react-native";

type AppTextVariant = "title" | "subtitle" | "body" | "caption" | "label";

interface AppTextProps extends TextProps {
  variant?: AppTextVariant;
  color?: string;
}

export function AppText({
  variant = "body",
  color,
  style,
  children,
  ...props
}: AppTextProps) {
  return (
    <Text
      style={[
        styles.base,
        variant === "title" && styles.title,
        variant === "subtitle" && styles.subtitle,
        variant === "body" && styles.body,
        variant === "caption" && styles.caption,
        variant === "label" && styles.label,
        color ? { color } : null,
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    color: "#1A3A1A",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  body: {
    fontSize: 14,
    fontWeight: "500",
  },
  caption: {
    fontSize: 12,
    fontWeight: "600",
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
  },
});
