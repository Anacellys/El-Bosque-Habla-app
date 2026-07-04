import { useCallback } from "react";

import { useAudioPlayer } from "expo-audio";

import type { Animal } from "@/types/app";

export function useAnimalAudio() {
  // Este servicio reutiliza el audio de animales para sonidos reales y nombres pronunciados sin duplicar lógica en pantallas.
  const soundPlayer = useAudioPlayer();
  const namePlayer = useAudioPlayer();

  const playAudioSource = useCallback(
    (
      player: ReturnType<typeof useAudioPlayer>,
      source: string | null | undefined,
    ) => {
      if (!source) {
        return;
      }

      player.replace(source);
      player.play();
    },
    [],
  );

  const playSound = useCallback(
    (animal: Animal) => {
      playAudioSource(
        soundPlayer,
        animal.soundUrl ?? animal.soundAsset ?? null,
      );
    },
    [playAudioSource, soundPlayer],
  );

  const playName = useCallback(
    (animal: Animal) => {
      playAudioSource(
        namePlayer,
        animal.nameAudioUrl ?? animal.nameAudioAsset ?? null,
      );
    },
    [namePlayer, playAudioSource],
  );

  const stop = useCallback(() => {
    soundPlayer.pause();
    namePlayer.pause();
  }, [namePlayer, soundPlayer]);

  return { playSound, playName, stop };
}
