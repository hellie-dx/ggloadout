'use client'

export default function LogoShowcase() {
  return (
    <div className="min-h-screen bg-[oklch(0.09_0.01_270)] flex flex-col items-center justify-center gap-16 p-12">
      <p className="text-white/40 text-sm uppercase tracking-widest">GGLoadout — Logo Options</p>

      <div className="grid grid-cols-2 gap-16">

        {/* OPTION A: Controller Badge */}
        <div className="flex flex-col items-center gap-4">
          <svg width="180" height="140" viewBox="0 0 160 122">
            <defs>
              <linearGradient id="rgb-a" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff0000"/>
                <stop offset="33%" stopColor="#00ff88"/>
                <stop offset="66%" stopColor="#0088ff"/>
                <stop offset="100%" stopColor="#cc00ff"/>
              </linearGradient>
            </defs>
            {/* PlayStation-style controller silhouette */}
            <path d="
              M 40 18
              Q 80 6 120 18
              Q 142 24 150 46
              L 150 66
              Q 148 74 138 76
              Q 152 87 157 99
              Q 161 111 150 117
              Q 138 123 126 113
              Q 115 105 109 96
              Q 103 85 97 80
              Q 90 77 80 77
              Q 70 77 63 80
              Q 57 85 51 96
              Q 45 105 34 113
              Q 22 123 10 117
              Q -1 111 3 99
              Q 8 87 22 76
              Q 12 74 10 66
              L 10 46
              Q 18 24 40 18
              Z"
              fill="rgba(255,255,255,0.03)" stroke="url(#rgb-a)" strokeWidth="2.5"/>
            {/* GG text */}
            <text x="80" y="54" textAnchor="middle" fontSize="32" fontWeight="900"
              fill="white" fontFamily="sans-serif" letterSpacing="-2">GG</text>
            {/* LOADOUT */}
            <text x="80" y="70" textAnchor="middle" fontSize="8" fontWeight="500"
              fill="rgba(255,255,255,0.45)" fontFamily="sans-serif" letterSpacing="4">LOADOUT</text>
          </svg>
          <p className="text-white/50 text-xs uppercase tracking-wider">A — Controller Badge</p>
        </div>

        {/* OPTION B: Hexagon + Target */}
        <div className="flex flex-col items-center gap-4">
          <svg width="130" height="140" viewBox="0 0 130 140">
            <defs>
              {/* Each side gets its own gradient: 6 sides = 6 hues, no repeats */}
              <linearGradient id="s1" x1="65" y1="8" x2="114" y2="36" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ff0000"/><stop offset="100%" stopColor="#ffff00"/>
              </linearGradient>
              <linearGradient id="s2" x1="114" y1="36" x2="114" y2="92" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffff00"/><stop offset="100%" stopColor="#00ff00"/>
              </linearGradient>
              <linearGradient id="s3" x1="114" y1="92" x2="65" y2="120" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00ff00"/><stop offset="100%" stopColor="#00ffff"/>
              </linearGradient>
              <linearGradient id="s4" x1="65" y1="120" x2="16" y2="92" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00ffff"/><stop offset="100%" stopColor="#0000ff"/>
              </linearGradient>
              <linearGradient id="s5" x1="16" y1="92" x2="16" y2="36" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0000ff"/><stop offset="100%" stopColor="#aa00ff"/>
              </linearGradient>
              <linearGradient id="s6" x1="16" y1="36" x2="65" y2="8" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#aa00ff"/><stop offset="100%" stopColor="#ff0000"/>
              </linearGradient>
            </defs>
            {/* Hex fill only */}
            <polygon points="65,8 114,36 114,92 65,120 16,92 16,36" fill="rgba(255,255,255,0.03)"/>
            {/* Each side drawn individually with matching gradient */}
            <line x1="65" y1="8" x2="114" y2="36" stroke="url(#s1)" strokeWidth="2.5"/>
            <line x1="114" y1="36" x2="114" y2="92" stroke="url(#s2)" strokeWidth="2.5"/>
            <line x1="114" y1="92" x2="65" y2="120" stroke="url(#s3)" strokeWidth="2.5"/>
            <line x1="65" y1="120" x2="16" y2="92" stroke="url(#s4)" strokeWidth="2.5"/>
            <line x1="16" y1="92" x2="16" y2="36" stroke="url(#s5)" strokeWidth="2.5"/>
            <line x1="16" y1="36" x2="65" y2="8" stroke="url(#s6)" strokeWidth="2.5"/>
            {/* Inner thin hex */}
            <polygon points="65,18 104,41 104,87 65,110 26,87 26,41"
              fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
            {/* Crosshair lines */}
            <line x1="65" y1="28" x2="65" y2="44" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
            <line x1="65" y1="84" x2="65" y2="100" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
            <line x1="28" y1="64" x2="44" y2="64" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
            <line x1="86" y1="64" x2="102" y2="64" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
            {/* RGB spark dots above GG */}
            <circle cx="47" cy="44" r="2.5" fill="#ff0088" opacity="0.9"/>
            <circle cx="56" cy="40" r="1.8" fill="#00ff88" opacity="0.9"/>
            <circle cx="65" cy="44" r="2.5" fill="#0088ff" opacity="0.9"/>
            <circle cx="74" cy="40" r="1.8" fill="#ffaa00" opacity="0.9"/>
            <circle cx="83" cy="44" r="2.5" fill="#cc00ff" opacity="0.9"/>
            {/* GG text */}
            <text x="65" y="72" textAnchor="middle" fontSize="30" fontWeight="900"
              fill="white" fontFamily="sans-serif" letterSpacing="-2"
              textLength="36" lengthAdjust="spacingAndGlyphs">GG</text>
            {/* Loadout text */}
            <text x="65" y="82" textAnchor="middle" fontSize="8" fontWeight="500"
              fill="rgba(255,255,255,0.45)" fontFamily="sans-serif"
              textLength="36" lengthAdjust="spacingAndGlyphs">LOADOUT</text>
            {/* Vertex dots colored to match their side junction */}
            <circle cx="65"  cy="8"   r="3" fill="#ff0000"/>
            <circle cx="114" cy="36"  r="3" fill="#ffff00"/>
            <circle cx="114" cy="92"  r="3" fill="#00ff00"/>
            <circle cx="65"  cy="120" r="3" fill="#00ffff"/>
            <circle cx="16"  cy="92"  r="3" fill="#0000ff"/>
            <circle cx="16"  cy="36"  r="3" fill="#aa00ff"/>
          </svg>
          <p className="text-white/50 text-xs uppercase tracking-wider">B — Hex Target</p>
        </div>

        {/* OPTION C: Double-G Overlap */}
        <div className="flex flex-col items-center gap-4">
          <svg width="160" height="100" viewBox="0 0 160 100">
            <defs>
              <linearGradient id="rgb-c" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff0088"/>
                <stop offset="50%" stopColor="#00ccff"/>
                <stop offset="100%" stopColor="#88ff00"/>
              </linearGradient>
              <clipPath id="clip-left">
                <rect x="0" y="0" width="80" height="100"/>
              </clipPath>
              <clipPath id="clip-right">
                <rect x="70" y="0" width="90" height="100"/>
              </clipPath>
            </defs>
            {/* Left G — solid white */}
            <text x="10" y="78" fontSize="80" fontWeight="900" fill="white"
              fontFamily="sans-serif" clipPath="url(#clip-left)">G</text>
            {/* Right G — RGB gradient */}
            <text x="65" y="78" fontSize="80" fontWeight="900"
              fill="url(#rgb-c)" fontFamily="sans-serif" clipPath="url(#clip-right)">G</text>
            {/* Overlap glow */}
            <text x="65" y="78" fontSize="80" fontWeight="900"
              fill="rgba(255,255,255,0.08)" fontFamily="sans-serif">G</text>
            {/* Wordmark below */}
            <text x="80" y="97" textAnchor="middle" fontSize="9" fontWeight="500"
              fill="rgba(255,255,255,0.35)" fontFamily="sans-serif" letterSpacing="5">LOADOUT</text>
          </svg>
          <p className="text-white/50 text-xs uppercase tracking-wider">C — Double-G Overlap</p>
        </div>

        {/* OPTION D: Minimal Wordmark + Spark */}
        <div className="flex flex-col items-center gap-4">
          <svg width="200" height="100" viewBox="0 0 200 100">
            <defs>
              <linearGradient id="rgb-d" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff0000"/>
                <stop offset="25%" stopColor="#ffaa00"/>
                <stop offset="50%" stopColor="#00ff88"/>
                <stop offset="75%" stopColor="#0088ff"/>
                <stop offset="100%" stopColor="#cc00ff"/>
              </linearGradient>
            </defs>
            {/* GG bold */}
            <text x="8" y="62" fontSize="52" fontWeight="900" fill="white"
              fontFamily="sans-serif" letterSpacing="-3">GG</text>
            {/* Vertical divider */}
            <line x1="102" y1="18" x2="102" y2="68" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
            {/* Loadout stacked */}
            <text x="112" y="38" fontSize="13" fontWeight="700" fill="white"
              fontFamily="sans-serif" letterSpacing="1">Load</text>
            <text x="112" y="56" fontSize="13" fontWeight="700" fill="url(#rgb-d)"
              fontFamily="sans-serif" letterSpacing="1">out</text>
            {/* Small RGB spark dots above GG */}
            <circle cx="20" cy="12" r="3" fill="#ff0088" opacity="0.8"/>
            <circle cx="34" cy="8" r="2" fill="#00ff88" opacity="0.8"/>
            <circle cx="48" cy="12" r="3" fill="#0088ff" opacity="0.8"/>
            <circle cx="62" cy="8" r="2" fill="#ffaa00" opacity="0.8"/>
            <circle cx="76" cy="12" r="3" fill="#cc00ff" opacity="0.8"/>
            {/* Underline on GG */}
            <rect x="8" y="68" width="88" height="2.5" rx="1.5" fill="url(#rgb-d)"/>
          </svg>
          <p className="text-white/50 text-xs uppercase tracking-wider">D — Wordmark + Spark</p>
        </div>

      </div>

      <p className="text-white/30 text-xs">Tell CL which one you like, or mix elements from multiple options</p>
    </div>
  )
}
