import type { Animal } from "@/types/app";

export const ANIMALS: Animal[] = [
  {
    id: "jaguar",
    name: "Jaguar",
    emoji: "🐆",
    color: "#EF6C00",
    park: "Darién",
    parkId: "darien",
    fact: "El jaguar es un gran cazador del bosque húmedo.",
    sound: "Rugido del jaguar",
    discovered: false,
    image:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80",
    soundUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    nameAudioUrl:
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    habitat: "Bosque tropical",
  },
  {
    id: "rana",
    name: "Rana",
    emoji: "🐸",
    color: "#2E7D32",
    park: "Bosque Nuboso",
    parkId: "nuboso",
    fact: "La rana canta con un sonido alegre en la lluvia.",
    sound: "Canto de rana",
    discovered: false,
    image:
      "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=900&q=80",
    soundUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    nameAudioUrl:
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    habitat: "Humedales",
  },
  {
    id: "loro",
    name: "Loro",
    emoji: "🦜",
    color: "#C62828",
    park: "Parque Metropolitano",
    parkId: "metropolitano",
    fact: "El loro comparte sonidos brillantes con el bosque.",
    sound: "Voz del loro",
    discovered: false,
    image:
      "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=900&q=80",
    soundUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    nameAudioUrl:
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    habitat: "Árboles y jardines",
  },
  {
    id: "quetzal",
    name: "Quetzal",
    emoji: "🦚",
    color: "#1B5E20",
    park: "Sendero Los Quetzales",
    parkId: "quetzales",
    fact: "El quetzal es un pájaro muy especial del bosque.",
    sound: "Canto del quetzal",
    discovered: false,
    image:
      "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=900&q=80",
    soundUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    nameAudioUrl:
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    habitat: "Bosque montañoso",
  },
  {
    id: "tortuga",
    name: "Tortuga",
    emoji: "🐢",
    color: "#2E7D32",
    park: "Isla Coiba",
    parkId: "coiba",
    fact: "La tortuga camina con calma por la playa.",
    sound: "Sonido suave de tortuga",
    discovered: false,
    image:
      "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=900&q=80",
    soundUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    nameAudioUrl:
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    habitat: "Playa y mar",
  },
  {
    id: "mono",
    name: "Mono",
    emoji: "🐒",
    color: "#6D4C41",
    park: "Bosque de Panamá",
    parkId: "panama",
    fact: "El mono hace sonidos muy vivos y curiosos.",
    sound: "Llamada de mono",
    discovered: false,
    image:
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=900&q=80",
    soundUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
    nameAudioUrl:
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
    habitat: "Árboles altos",
  },
];

export const PARKS = [
  { id: "quetzales", name: "Sendero Los Quetzales", emoji: "🌿" },
  { id: "darien", name: "Darién", emoji: "🌴" },
  { id: "coiba", name: "Coiba", emoji: "🌊" },
  { id: "metropolitano", name: "Parque Metropolitano", emoji: "🌳" },
  { id: "panama", name: "Bosque de Panamá", emoji: "🍃" },
  { id: "nuboso", name: "Bosque Nuboso", emoji: "☁️" },
];
