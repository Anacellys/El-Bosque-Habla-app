export const MASCOT_AUDIO = {
  bienvenida1: require("../../assets/audio/mascota/bienvenida-1.mp3"),
  bienvenida2: require("../../assets/audio/mascota/bienvenida-2.mp3"),
  instruccionJuego: require("../../assets/audio/mascota/instruccion-juego.mp3"),
  preguntaSonido: require("../../assets/audio/mascota/pregunta-sonido.mp3"),
  intentaOtraVez: require("../../assets/audio/mascota/intenta-otra-vez.mp3"),
  intentaOtraVez2: require("../../assets/audio/mascota/intenta-otra-vez-2.mp3"),
  celebracion1: require("../../assets/audio/mascota/celebracion-1.mp3"),
  celebracion2: require("../../assets/audio/mascota/celebracion-2.mp3"),
  celebracion3: require("../../assets/audio/mascota/celebracion-3.mp3"),
  introEscuchar: require("../../assets/audio/mascota/intro-escuchar.mp3"),
  instruccionEscuchar: require("../../assets/audio/mascota/instruccion-escuchar.mp3"),
  introEstrellas: require("../../assets/audio/mascota/intro-estrellas.mp3"),
} as const;

export function pickCelebrationAudio() {
  const celebrationClips = [
    MASCOT_AUDIO.celebracion1,
    MASCOT_AUDIO.celebracion2,
    MASCOT_AUDIO.celebracion3,
  ];

  return celebrationClips[Math.floor(Math.random() * celebrationClips.length)];
}
