'use client'

import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  color: string
  blur: number
}

const RGB_COLORS = [
  '#ff0000',
  '#ff6600',
  '#ffff00',
  '#00ff88',
  '#00ccff',
  '#0066ff',
  '#aa00ff',
  '#ff00aa',
]

export function FloatingParticles({ count = 50 }: { count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.5 + 0.8,
        duration: Math.random() * 8 + 6,
        delay: Math.random() * 8,
        color: RGB_COLORS[Math.floor(Math.random() * RGB_COLORS.length)],
        blur: Math.random() > 0.5 ? 1 : 0,
      }))
    )
  }, [count])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            animation: `float-particle ${p.duration}s ${p.delay}s infinite ease-in-out`,
          }}
        >
          <div
            style={{
              width: p.size,
              height: p.size,
              background: p.color,
              borderRadius: '50%',
              boxShadow: `0 0 ${p.size}px ${p.size * 0.5}px ${p.color}99, 0 0 ${p.size * 2}px ${p.size}px ${p.color}33`,
              filter: p.blur ? `blur(${p.blur}px)` : 'none',
            }}
          />
        </div>
      ))}

      <style>{`
        @keyframes float-particle {
          0%   { transform: translateY(0px) translateX(0px) scale(1); opacity: 0; }
          15%  { opacity: 0.85; }
          50%  { transform: translateY(-50px) translateX(20px) scale(1.4); opacity: 1; }
          85%  { opacity: 0.85; }
          100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
