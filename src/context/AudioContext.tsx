import { useAudioPlayer } from "expo-audio";
import React, { createContext, useCallback, useContext, useRef } from "react";

import type { Animal } from "@/types/app";

type AudioSource = string | number | null | undefined;

interface AudioContextValue {
  playSound: (animal: Animal) => void;
  playName: (animal: Animal) => void;
  playMascotAudio: (source: AudioSource) => void;
  stopAll: () => void;
  /**
   * Reproduce una lista de audios EN ORDEN, esperando a que cada uno
   * termine de sonar antes de empezar el siguiente. Así se evita que
   * la voz de la mascota, el nombre del animal y su sonido real se
   * encimen unos con otros.
   */
  playSequence: (sources: AudioSource[]) => void;
}

const AudioCtx = createContext<AudioContextValue | undefined>(undefined);

// Tiempo máximo que esperamos por un clip antes de continuar de todas formas.
// Es una red de seguridad: en Android hay casos donde el evento "terminó de
// sonar" (didJustFinish) no llega, y sin esto la secuencia se quedaría
// esperando para siempre (el "bucle" congelado que se ve a veces).
const MAX_WAIT_MS = 12000;

export function AudioProvider({ children }: { children: React.ReactNode }) {
  // Un solo reproductor compartido por toda la app. Es intencional: como
  // playSequence garantiza que nunca hay dos audios sonando a la vez, no
  // hace falta (ni conviene) tener varios reproductores independientes.
  const player = useAudioPlayer();

  // Cada secuencia nueva invalida la anterior (por ejemplo, si el niño
  // cambia de pantalla a la mitad de una reproducción).
  const sequenceIdRef = useRef(0);

  const stopAll = useCallback(() => {
    sequenceIdRef.current += 1;
    try {
      player.pause();
    } catch {
      // Ignorar si ya no hay recursos de audio disponibles.
    }
  }, [player]);

  // Reproduce un solo clip y resuelve la promesa cuando termina
  // (o cuando se agota el tiempo máximo de espera).
  const playAndWait = useCallback(
    (source: AudioSource) =>
      new Promise<void>((resolve) => {
        if (!source) {
          resolve();
          return;
        }

        let settled = false;
        let subscription: { remove: () => void } | undefined;
        let safetyTimer: ReturnType<typeof setTimeout>;

        const finish = () => {
          if (settled) {
            return;
          }
          settled = true;
          subscription?.remove();
          clearTimeout(safetyTimer);
          resolve();
        };

        try {
          subscription = player.addListener(
            "playbackStatusUpdate",
            (status) => {
              if (status.didJustFinish) {
                finish();
              }
            },
          );
          player.replace(source);
          player.play();
        } catch {
          finish();
          return;
        }

        safetyTimer = setTimeout(finish, MAX_WAIT_MS);
      }),
    [player],
  );

  const playSequence = useCallback(
    (sources: AudioSource[]) => {
      const myId = ++sequenceIdRef.current;

      const run = async () => {
        for (const source of sources) {
          // Si mientras esperábamos empezó otra secuencia (el niño ya
          // cambió de pantalla o tocó otra cosa), abortamos aquí.
          if (sequenceIdRef.current !== myId) {
            return;
          }
          await playAndWait(source);
        }
      };

      run();
    },
    [playAndWait],
  );

  const playSound = useCallback(
    (animal: Animal) => {
      playSequence([animal.soundUrl ?? animal.soundAsset ?? null]);
    },
    [playSequence],
  );

  const playName = useCallback(
    (animal: Animal) => {
      playSequence([animal.nameAudioUrl ?? animal.nameAudioAsset ?? null]);
    },
    [playSequence],
  );

  const playMascotAudio = useCallback(
    (source: AudioSource) => {
      playSequence([source]);
    },
    [playSequence],
  );

  return (
    <AudioCtx.Provider
      value={{ playSound, playName, playMascotAudio, stopAll, playSequence }}
    >
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioCtx);
  if (!context) {
    throw new Error("useAudio must be used inside AudioProvider");
  }
  return context;
}
