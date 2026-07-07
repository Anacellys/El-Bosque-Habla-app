# El Bosque Habla

El Bosque Habla es una app educativa y lúdica desarrollada con Expo Router y React Native para acercar a los niños y niñas al conocimiento de la fauna de Panamá. La experiencia combina exploración, audio, juegos y seguimiento de progreso para hacer el aprendizaje más significativo.

## Características principales

- Exploración interactiva de animales y provincias de Panamá.
- Pantallas de información con imagen, datos curiosos y ubicación.
- Reproducción de sonidos y nombres de los animales mediante audio.
- Mini juego de memoria/sonido para reforzar el aprendizaje.
- Sistema de descubrimientos, estrellas y puntos persistente con AsyncStorage.
- Narración opcional habilitable desde la experiencia.
- Diseño pensado para una experiencia visual amigable y educativa.

## Tecnologías usadas

- React Native
- Expo
- Expo Router
- TypeScript
- React Context
- AsyncStorage
- Expo Audio
- Expo Asset

## Estructura del proyecto

- src/app: rutas y pantallas principales con Expo Router.
- src/screens: pantallas de la app organizadas por módulos.
- src/components: componentes reutilizables de UI.
- src/context: contexto global de la app y audio.
- src/data: catálogo de animales y provincias.
- src/types: tipos TypeScript compartidos.
- src/utils: utilidades para imágenes y caché.
- assets: imágenes, sonidos y audios de los animales.

## Requisitos

- Node.js 18 o superior
- npm o yarn
- Expo CLI

## Instalación

```bash
npm install
```

## Ejecución

```bash
npx expo start
```

Luego puedes abrir la app en:

- Expo Go
- Emulador Android
- Simulador iOS
- Navegador web

## Scripts disponibles

```bash
npm run start
npm run android
npm run ios
npm run web
npm run lint
```

## Estado del proyecto

La app está en desarrollo activo y cuenta con:

- navegación entre pantallas
- contenido educativo de animales panameños
- audio asociado a animales
- progreso guardado localmente

## Autor

Proyecto desarrollado para promover la educación ambiental y el aprendizaje infantil a través de la tecnología.
