import type { ImageSourcePropType } from "react-native";

export function resolveImageSource(
  image?: unknown,
): ImageSourcePropType | undefined {
  if (!image) {
    return undefined;
  }

  if (typeof image === "string") {
    return { uri: image };
  }

  if (typeof image === "number") {
    return image;
  }

  return image as ImageSourcePropType;
}
