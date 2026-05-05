'use client'

import { cn } from '@/lib/utils'

interface LoadingScreenProps {
  label?: string
  className?: string
}

export const LoadingScreen = ({ label = 'Chargement...', className }: LoadingScreenProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-6 min-h-[400px] w-full', className)}>
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-2 border-primary/10" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin [animation-duration:1.5s]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        </div>
      </div>

      {label && (
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/50 animate-pulse">
          {label}
        </p>
      )}
    </div>
  )
}
