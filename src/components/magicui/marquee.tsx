import { cn } from '@/lib/utils'

interface MarqueeProps {
  className?: string
  reverse?: boolean
  pauseOnHover?: boolean
  children?: React.ReactNode
  repeat?: number
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  repeat = 4,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        'group flex overflow-hidden [--duration:30s] [--gap:1rem] [gap:var(--gap)]',
        className
      )}
    >
      {Array(repeat).fill(0).map((_, i) => (
        <div
          key={i}
          className={cn(
            'flex shrink-0 justify-around [gap:var(--gap)]',
            reverse
              ? 'animate-[marquee-reverse_var(--duration)_linear_infinite]'
              : 'animate-[marquee_var(--duration)_linear_infinite]',
            pauseOnHover && 'group-hover:[animation-play-state:paused]'
          )}
        >
          {children}
        </div>
      ))}
    </div>
  )
}
