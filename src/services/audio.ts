import { useCallback } from "react";

import { useAudioPlayer } from "expo-audio";

import type { Animal } from "@/types/app";

export function useAnimalAudio() {
  const soundPlayer = useAudioPlayer();
  const namePlayer = useAudioPlayer();
  const mascotPlayer = useAudioPlayer();

  const stop = useCallback(() => {
    try {
      soundPlayer.pause();
      namePlayer.pause();
      mascotPlayer.pause();
    } catch {
      // Ignorar si ya no hay recursos de audio disponibles.
    }
  }, [mascotPlayer, namePlayer, soundPlayer]);

  const playAudioSource = useCallback(
    (
      player: ReturnType<typeof useAudioPlayer>,
      source: string | null | undefined,
      options?: { shouldStopOtherPlayers?: boolean },
    ) => {
      if (!source) {
        return;
      }

      try {
        if (options?.shouldStopOtherPlayers) {
          stop();
        }

        player.replace(source);
        player.play();
      } catch {
        // Ignorar si el asset no está disponible en tiempo de bundling.
      }
    },
    [stop],
  );

  const playSound = useCallback(
    (animal: Animal, options?: { shouldStopOtherPlayers?: boolean }) => {
      playAudioSource(
        soundPlayer,
        animal.soundUrl ?? animal.soundAsset ?? null,
        options,
      );
    },
    [playAudioSource, soundPlayer],
  );

  const playName = useCallback(
    (animal: Animal, options?: { shouldStopOtherPlayers?: boolean }) => {
      playAudioSource(
        namePlayer,
        animal.nameAudioUrl ?? animal.nameAudioAsset ?? null,
        options,
      );
    },
    [namePlayer, playAudioSource],
  );

  const playMascotAudio = useCallback(
    (source: string | null | undefined) => {
      playAudioSource(mascotPlayer, source, { shouldStopOtherPlayers: true });
    },
    [mascotPlayer, playAudioSource],
  );

  return { playSound, playName, playMascotAudio, stop };
}
