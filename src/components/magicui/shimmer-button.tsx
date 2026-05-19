'use client'

import { cn } from '@/lib/utils'
import React from 'react'

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  borderRadius?: string
  children: React.ReactNode
}

export function ShimmerButton({
  borderRadius = '12px',
  className,
  children,
  ...props
}: ShimmerButtonProps) {
  return (
    <div className="relative" style={{ borderRadius }}>
      <div
        className="absolute inset-0"
        style={{ borderRadius, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)' }}
      />
      <div
        className="absolute inset-0 animate-[border-spin_4s_linear_infinite]"
        style={{
          borderRadius,
          border: '1.5px solid transparent',
          background: 'conic-gradient(from var(--angle, 0deg), transparent 65%, #ff0000 72%, #ffaa00 76%, #00ff88 80%, #0088ff 84%, #cc00ff 88%, transparent 93%) border-box',
          WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'destination-out',
          maskComposite: 'exclude',
          filter: 'blur(12px)',
        } as React.CSSProperties}
      />
      <button
        className={cn(
          'relative z-10 cursor-pointer whitespace-nowrap px-8 py-3 text-white font-semibold text-base transition-all duration-300 hover:brightness-110 active:scale-[0.98] w-full',
          className
        )}
        style={{ borderRadius }}
        {...props}
      >
        <span className="flex items-center gap-2 justify-center">{children}</span>
      </button>
    </div>
  )
}
