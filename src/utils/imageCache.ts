import * as FileSystem from "expo-file-system";

export async function getCachedImageUri(id: string, remoteUrl?: string) {
  if (!remoteUrl) return null;
  try {
    const dir = FileSystem.cacheDirectory + "animal_images/";
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true }).catch(
      () => {},
    );
    const urlParts = remoteUrl.split("?")[0].split(".");
    const ext = urlParts[urlParts.length - 1] || "jpg";
    const path = `${dir}${id}.${ext}`;
    const info = await FileSystem.getInfoAsync(path);
    if (info.exists) {
      return info.uri;
    }
    const result = await FileSystem.downloadAsync(remoteUrl, path);
    return result.uri;
  } catch (err) {
    return null;
  }
}
