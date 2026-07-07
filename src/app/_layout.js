import { Stack } from "expo-router";

import { AppProvider } from "@/context/AppContext";
import { AudioProvider } from "@/context/AudioContext";

export default function RootLayout() {
  return (
    <AppProvider>
      <AudioProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AudioProvider>
    </AppProvider>
  );
}
