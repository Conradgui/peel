'use client'

import { useState, useEffect } from 'react'
import { generateRain, type Raindrop } from '@/lib/orange-rain'

function BlossomSVG() {
  return (
    <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(20 20)">
        <g transform="rotate(0)"><ellipse cx="0" cy="-10" rx="5.5" ry="10" fill="#FFFFFF" stroke="#E5E5DF" strokeWidth="0.5"/></g>
        <g transform="rotate(72)"><ellipse cx="0" cy="-10" rx="5.5" ry="10" fill="#FFFFFF" stroke="#E5E5DF" strokeWidth="0.5"/></g>
        <g transform="rotate(144)"><ellipse cx="0" cy="-10" rx="5.5" ry="10" fill="#FFFFFF" stroke="#E5E5DF" strokeWidth="0.5"/></g>
        <g transform="rotate(216)"><ellipse cx="0" cy="-10" rx="5.5" ry="10" fill="#FFFFFF" stroke="#E5E5DF" strokeWidth="0.5"/></g>
        <g transform="rotate(288)"><ellipse cx="0" cy="-10" rx="5.5" ry="10" fill="#FFFFFF" stroke="#E5E5DF" strokeWidth="0.5"/></g>
        <circle r="3" fill="#FB923C"/>
      </g>
    </svg>
  )
}

function OrangeSVG() {
  return (
    <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="17" r="10" fill="#FB923C" stroke="#EA580C" strokeWidth="0.7"/>
      <path d="M 14 6 Q 12 3 16 4 Q 18 5 17 8 Q 15 9 14 7 Z" fill="#16a34a"/>
      <path d="M 11 13 Q 12 11 14 12" stroke="#FFFFFF" strokeWidth="0.6" fill="none" opacity="0.5"/>
    </svg>
  )
}

export function OrangeRain({ trigger }: { trigger: number }) {
  const [drops, setDrops] = useState<Raindrop[]>([])

  useEffect(() => {
    if (trigger === 0) return
    const newDrops = generateRain()
    setDrops(d => [...d, ...newDrops])
    const cleanup = setTimeout(() => {
      setDrops(d => d.filter(x => !newDrops.some(nd => nd.id === x.id)))
    }, 8500)
    return () => clearTimeout(cleanup)
  }, [trigger])

  if (drops.length === 0) return null

  return (
    <div className="orange-rain-container">
      {drops.map(d => (
        <div
          key={d.id}
          className={`raindrop ${d.type}`}
          style={{
            left: `${d.leftPct}%`,
            animationDelay: `${d.delayMs}ms`,
            animationDuration: `${d.durationMs}ms`,
            width: `${(d.type === 'blossom' ? 28 : 24) * d.scale}px`,
            height: `${(d.type === 'blossom' ? 28 : 24) * d.scale}px`,
            '--rotate-end': `${d.rotateEnd}deg`,
          } as React.CSSProperties}
        >
          {d.type === 'blossom' ? <BlossomSVG /> : <OrangeSVG />}
        </div>
      ))}
    </div>
  )
}
