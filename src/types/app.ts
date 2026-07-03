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
