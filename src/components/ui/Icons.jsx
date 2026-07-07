import { Circle, Path, Rect, Svg } from "react-native-svg";

export function PlayIcon({ size = 22, color = "#FFFFFF" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M6 4 L20 12 L6 20 Z" fill={color} />
    </Svg>
  );
}

export function SpeakerIcon({ size = 22, color = "#2E7D32" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M3 9 H7 L13 4 V20 L7 15 H3 Z" fill={color} />
      <Path
        d="M16 8 C18 10 18 14 16 16"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M19 5 C22.5 8.5 22.5 15.5 19 19"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

export function StarIcon({ size = 22, color = "#F9A825" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 3 L14.6 9 L21 9.6 L16.2 13.9 L17.6 20.2 L12 16.9 L6.4 20.2 L7.8 13.9 L3 9.6 L9.4 9 Z"
        fill={color}
      />
    </Svg>
  );
}

export function FamilyIcon({ size = 22, color = "#2E7D32" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="8" cy="7" r="3" fill={color} />
      <Path
        d="M2 20 C2 15.5 5 13.5 8 13.5 C11 13.5 14 15.5 14 20 Z"
        fill={color}
      />
      <Circle cx="17" cy="8" r="2.4" fill={color} opacity={0.7} />
      <Path
        d="M13 20 C13 16.4 15 14.6 17 14.6 C19 14.6 21.5 16.4 21.5 20 Z"
        fill={color}
        opacity={0.7}
      />
    </Svg>
  );
}

export function TrophyIcon({ size = 18, color = "#F9A825" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x="9" y="15" width="6" height="4" fill={color} />
      <Rect x="7" y="19" width="10" height="2" rx="1" fill={color} />
      <Path
        d="M8 4 H16 V11 C16 14 14 16 12 16 C10 16 8 14 8 11 Z"
        fill={color}
      />
      <Path
        d="M8 5 H5 C5 8 6 10 8 10.5"
        stroke={color}
        strokeWidth={1.6}
        fill="none"
      />
      <Path
        d="M16 5 H19 C19 8 18 10 16 10.5"
        stroke={color}
        strokeWidth={1.6}
        fill="none"
      />
    </Svg>
  );
}
