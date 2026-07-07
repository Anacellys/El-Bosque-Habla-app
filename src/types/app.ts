export interface Animal {
  id: string;
  name: string;
  emoji: string;
  color: string;
  province: string;
  provinceId: string;
  fact: string;
  sound: string;
  discovered: boolean;
  habitat?: string;
  image?: any;
  soundUrl?: string;
  soundAsset?: any;
  nameAudioUrl?: string;
  nameAudioAsset?: any;
}

export interface Province {
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
