export function resolveImageSource(image?: unknown) {
  if (!image) {
    return null;
  }

  if (typeof image === "string") {
    return { uri: image };
  }

  return image;
}
