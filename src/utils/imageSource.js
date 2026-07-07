export function resolveImageSource(image) {
  if (!image) {
    return undefined;
  }

  if (typeof image === "string") {
    return { uri: image };
  }

  if (typeof image === "number") {
    return image;
  }

  return image;
}
