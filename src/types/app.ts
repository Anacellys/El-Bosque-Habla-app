export interface Animal {
  id: string;
  name: string;
  emoji: string;
  color: string;
  park: string;
  parkId: string;
  fact: string;
  sound: string;
  discovered: boolean;
  // `image` puede ser una URL (string) o un módulo `require(...)` (any)
  image?: any;
  // `soundUrl` es una URL remota; `soundAsset` puede ser un módulo `require(...)` para assets locales
  soundUrl?: string; // optional remote audio URL
  soundAsset?: any;
}

export interface Park {
  id: string;
  name: string;
  emoji: string;
  color: string;
  bgColor: string;
  region: string;
  animals: string[];
  x: number;
  y: number;
}

export interface ResultState {
  animalId: string;
  correct: boolean;
}
