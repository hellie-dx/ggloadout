'use client'

import { cn } from '@/lib/utils'
import React from 'react'

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  borderRadius?: string
  variant?: 'classic' | 'cta'
  beamBlur?: string
  innerClassName?: string
  children: React.ReactNode
}

export function ShimmerButton({
  borderRadius = '12px',
  variant = 'classic',
  beamBlur = '12px',
  innerClassName,
  className,
  children,
  ...props
}: ShimmerButtonProps) {
  if (variant === 'cta') {
    return (
      <div
        className="relative p-[1.5px]"
        style={{
          borderRadius,
          background: 'linear-gradient(to right, #6644ff, #cc0088)',
          boxShadow: '0 0 18px rgba(102,68,255,0.45), 0 0 36px rgba(204,0,136,0.25)',
          animation: 'rgb-breathe 4s ease-in-out infinite',
        }}
      >
        <button
          className={cn(
            'relative w-full cursor-pointer whitespace-nowrap px-8 py-3 text-white font-semibold text-base transition-all duration-300 hover:brightness-110 active:scale-[0.98]',
            className,
            innerClassName
          )}
          style={{
            borderRadius: `calc(${borderRadius} - 1.5px)`,
            background: innerClassName ? undefined : 'rgba(10,10,16,0.88)',
            backdropFilter: innerClassName ? undefined : 'blur(12px)',
          }}
          {...props}
        >
          <span className="flex items-center gap-2 justify-center">{children}</span>
        </button>
      </div>
    )
  }

  // classic: rotating conic gradient beam as border
  return (
    <div
      className="relative p-[1.5px] animate-[border-spin_4s_linear_infinite]"
      style={{
        borderRadius,
        background: 'conic-gradient(from var(--angle, 0deg), transparent 65%, #ff0000 72%, #ffaa00 76%, #00ff88 80%, #0088ff 84%, #cc00ff 88%, transparent 93%)',
      } as React.CSSProperties}
    >
      <button
        className={cn(
          'relative z-10 cursor-pointer whitespace-nowrap px-8 py-3 text-white font-semibold text-base transition-all duration-300 hover:brightness-110 active:scale-[0.98] w-full',
          className,
          innerClassName
        )}
        style={{
          borderRadius: `calc(${borderRadius} - 1.5px)`,
          background: innerClassName ? undefined : 'rgba(10,10,16,0.88)',
          backdropFilter: innerClassName ? undefined : 'blur(12px)',
        }}
        {...props}
      >
        <span className="flex items-center gap-2 justify-center">{children}</span>
      </button>
    </div>
  )
}
