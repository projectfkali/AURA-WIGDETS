// Ortak renk haritası ve tema ayarları
export const colorMap = {
  white: { 
    name: 'Beyaz (Gümüş)',
    text: 'text-white', 
    glow: 'shadow-[0_0_15px_rgba(255,255,255,0.3)]',
    stroke: '#ffffff',
    drop: 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]',
    bg: 'bg-white',
    border: 'border-white/20'
  },
  blue: { 
    name: 'Gök Mavisi',
    text: 'text-blue-400', 
    glow: 'shadow-[0_0_15px_rgba(96,165,250,0.3)]',
    stroke: '#60a5fa',
    drop: 'drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]',
    bg: 'bg-blue-500',
    border: 'border-blue-500/20'
  },
  green: { 
    name: 'Neon Yeşili',
    text: 'text-green-400', 
    glow: 'shadow-[0_0_15px_rgba(74,222,128,0.3)]',
    stroke: '#4ade80',
    drop: 'drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]',
    bg: 'bg-green-500',
    border: 'border-green-500/20'
  },
  purple: { 
    name: 'Siber Mor',
    text: 'text-purple-400', 
    glow: 'shadow-[0_0_15px_rgba(192,132,252,0.3)]',
    stroke: '#c084fc',
    drop: 'drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]',
    bg: 'bg-purple-500',
    border: 'border-purple-500/20'
  },
  red: { 
    name: 'Kızıl Elma',
    text: 'text-red-400', 
    glow: 'shadow-[0_0_15px_rgba(248,113,113,0.3)]',
    stroke: '#f87171',
    drop: 'drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]',
    bg: 'bg-red-500',
    border: 'border-red-500/20'
  },
  amber: { 
    name: 'Kehribar',
    text: 'text-amber-400', 
    glow: 'shadow-[0_0_15px_rgba(251,191,36,0.3)]',
    stroke: '#fbbf24',
    drop: 'drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]',
    bg: 'bg-amber-500',
    border: 'border-amber-500/20'
  }
}

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Class birleştirme için utility
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
