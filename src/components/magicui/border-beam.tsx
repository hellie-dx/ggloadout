import { cn } from '@/lib/utils'

interface BorderBeamProps {
  className?: string
  size?: number
  duration?: number
  colorFrom?: string
  colorTo?: string
}

export function BorderBeam({
  className,
  size = 200,
  duration = 12,
  colorFrom = '#a855f7',
  colorTo = '#6366f1',
}: BorderBeamProps) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0 rounded-[inherit] [border:1px_solid_transparent] ![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]', className)}
      style={{
        '--size': size,
        '--duration': duration,
        '--color-from': colorFrom,
        '--color-to': colorTo,
        animation: `border-beam calc(var(--duration)*1s) infinite linear`,
        background: `linear-gradient(to right, var(--color-from), var(--color-to)) border-box`,
      } as React.CSSProperties}
    />
  )
}
