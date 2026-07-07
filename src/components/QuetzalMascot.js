import { Circle, Ellipse, Path, Rect, Svg } from "react-native-svg";

export function QuetzalMascot({ size = 120, style, withHat = true }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 220" style={style}>
      {/* Long tail feathers */}
      <Ellipse
        cx="105"
        cy="190"
        rx="8"
        ry="45"
        fill="#1B5E20"
        transform="rotate(-5 105 190)"
      />
      <Ellipse
        cx="95"
        cy="195"
        rx="7"
        ry="50"
        fill="#2E7D32"
        transform="rotate(5 95 195)"
      />
      <Ellipse
        cx="100"
        cy="200"
        rx="6"
        ry="55"
        fill="#388E3C"
        transform="rotate(0 100 200)"
      />
      {/* Tail tip */}
      <Ellipse cx="100" cy="215" rx="5" ry="8" fill="#81C784" />

      {/* Body */}
      <Ellipse cx="100" cy="130" rx="38" ry="48" fill="#43A047" />

      {/* Wing detail */}
      <Ellipse
        cx="68"
        cy="130"
        rx="18"
        ry="32"
        fill="#2E7D32"
        transform="rotate(-10 68 130)"
      />
      <Ellipse
        cx="132"
        cy="130"
        rx="18"
        ry="32"
        fill="#2E7D32"
        transform="rotate(10 132 130)"
      />

      {/* Chest / belly */}
      <Ellipse cx="100" cy="145" rx="22" ry="28" fill="#EF5350" />

      {/* Head */}
      <Circle cx="100" cy="85" r="32" fill="#43A047" />

      {/* Eye whites */}
      <Circle cx="88" cy="80" r="10" fill="white" />
      <Circle cx="112" cy="80" r="10" fill="white" />

      {/* Eye pupils */}
      <Circle cx="90" cy="81" r="6" fill="#1A237E" />
      <Circle cx="114" cy="81" r="6" fill="#1A237E" />

      {/* Eye shine */}
      <Circle cx="92" cy="79" r="2" fill="white" />
      <Circle cx="116" cy="79" r="2" fill="white" />

      {/* Beak */}
      <Path d="M94 92 L106 92 L100 105 Z" fill="#FFD54F" />

      {/* Cheek blush */}
      <Ellipse cx="82" cy="88" rx="7" ry="7" fill="#EF9A9A" opacity="0.5" />
      <Ellipse cx="118" cy="88" rx="7" ry="7" fill="#EF9A9A" opacity="0.5" />

      {/* Crest feathers */}
      <Ellipse
        cx="85"
        cy="55"
        rx="5"
        ry="18"
        fill="#66BB6A"
        transform="rotate(-20 85 55)"
      />
      <Ellipse
        cx="100"
        cy="50"
        rx="5"
        ry="20"
        fill="#81C784"
        transform="rotate(0 100 50)"
      />
      <Ellipse
        cx="115"
        cy="55"
        rx="5"
        ry="18"
        fill="#66BB6A"
        transform="rotate(20 115 55)"
      />

      {withHat && (
        <>
          <Ellipse cx="100" cy="60" rx="38" ry="8" fill="#8D6E63" />
          <Rect x="72" y="25" width="56" height="36" rx="8" fill="#A1887F" />
          <Rect x="72" y="52" width="56" height="8" rx="2" fill="#6D4C41" />
          <Circle cx="100" cy="56" r="4" fill="#FFD54F" />
        </>
      )}

      {/* Binoculars */}
      <Rect x="74" y="110" width="15" height="22" rx="5" fill="#5D4037" />
      <Rect x="111" y="110" width="15" height="22" rx="5" fill="#5D4037" />
      <Rect x="84" y="116" width="32" height="8" rx="3" fill="#4E342E" />
      <Circle cx="81" cy="121" r="6" fill="#90CAF9" opacity="0.8" />
      <Circle cx="119" cy="121" r="6" fill="#90CAF9" opacity="0.8" />

      {/* Feet */}
      <Path
        d="M88 172 L80 182 M88 172 L88 185 M88 172 L96 182"
        stroke="#FFD54F"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Path
        d="M112 172 L104 182 M112 172 L112 185 M112 172 L120 182"
        stroke="#FFD54F"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </Svg>
  );
}
