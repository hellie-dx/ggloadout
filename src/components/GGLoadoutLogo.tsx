interface GGLoadoutLogoProps {
  size?: number
}

export default function GGLoadoutLogo({ size = 40 }: GGLoadoutLogoProps) {
  const scale = size / 140
  const w = Math.round(130 * scale)
  const h = Math.round(140 * scale)

  return (
    <svg width={w} height={h} viewBox="0 0 130 140">
      <defs>
        <linearGradient id="logo-s1" x1="65" y1="8" x2="114" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff0000"/><stop offset="100%" stopColor="#ffff00"/>
        </linearGradient>
        <linearGradient id="logo-s2" x1="114" y1="36" x2="114" y2="92" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffff00"/><stop offset="100%" stopColor="#00ff00"/>
        </linearGradient>
        <linearGradient id="logo-s3" x1="114" y1="92" x2="65" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00ff00"/><stop offset="100%" stopColor="#00ffff"/>
        </linearGradient>
        <linearGradient id="logo-s4" x1="65" y1="120" x2="16" y2="92" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00ffff"/><stop offset="100%" stopColor="#0000ff"/>
        </linearGradient>
        <linearGradient id="logo-s5" x1="16" y1="92" x2="16" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0000ff"/><stop offset="100%" stopColor="#aa00ff"/>
        </linearGradient>
        <linearGradient id="logo-s6" x1="16" y1="36" x2="65" y2="8" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#aa00ff"/><stop offset="100%" stopColor="#ff0000"/>
        </linearGradient>
      </defs>

      {/* Hex fill */}
      <polygon points="65,8 114,36 114,92 65,120 16,92 16,36" fill="rgba(255,255,255,0.03)"/>

      {/* Each side with its own gradient */}
      <line x1="65" y1="8"   x2="114" y2="36"  stroke="url(#logo-s1)" strokeWidth="2.5"/>
      <line x1="114" y1="36" x2="114" y2="92"  stroke="url(#logo-s2)" strokeWidth="2.5"/>
      <line x1="114" y1="92" x2="65"  y2="120" stroke="url(#logo-s3)" strokeWidth="2.5"/>
      <line x1="65" y1="120" x2="16"  y2="92"  stroke="url(#logo-s4)" strokeWidth="2.5"/>
      <line x1="16" y1="92"  x2="16"  y2="36"  stroke="url(#logo-s5)" strokeWidth="2.5"/>
      <line x1="16" y1="36"  x2="65"  y2="8"   stroke="url(#logo-s6)" strokeWidth="2.5"/>

      {/* Inner thin hex */}
      <polygon points="65,18 104,41 104,87 65,110 26,87 26,41"
        fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>

      {/* Crosshair lines */}
      <line x1="65" y1="28" x2="65" y2="44" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
      <line x1="65" y1="84" x2="65" y2="100" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
      <line x1="28" y1="64" x2="44" y2="64" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
      <line x1="86" y1="64" x2="102" y2="64" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>

      {/* RGB spark dots */}
      <circle cx="47" cy="44" r="2.5" fill="#ff0088" opacity="0.9"/>
      <circle cx="56" cy="40" r="1.8" fill="#00ff88" opacity="0.9"/>
      <circle cx="65" cy="44" r="2.5" fill="#0088ff" opacity="0.9"/>
      <circle cx="74" cy="40" r="1.8" fill="#ffaa00" opacity="0.9"/>
      <circle cx="83" cy="44" r="2.5" fill="#cc00ff" opacity="0.9"/>

      {/* GG text */}
      <text x="65" y="72" textAnchor="middle" fontSize="30" fontWeight="900"
        fill="white" fontFamily="sans-serif" letterSpacing="-2"
        textLength="36" lengthAdjust="spacingAndGlyphs">GG</text>

      {/* LOADOUT text */}
      <text x="65" y="82" textAnchor="middle" fontSize="8" fontWeight="500"
        fill="rgba(255,255,255,0.45)" fontFamily="sans-serif"
        textLength="36" lengthAdjust="spacingAndGlyphs">LOADOUT</text>

      {/* Vertex dots */}
      <circle cx="65"  cy="8"   r="3" fill="#ff0000"/>
      <circle cx="114" cy="36"  r="3" fill="#ffff00"/>
      <circle cx="114" cy="92"  r="3" fill="#00ff00"/>
      <circle cx="65"  cy="120" r="3" fill="#00ffff"/>
      <circle cx="16"  cy="92"  r="3" fill="#0000ff"/>
      <circle cx="16"  cy="36"  r="3" fill="#aa00ff"/>
    </svg>
  )
}
