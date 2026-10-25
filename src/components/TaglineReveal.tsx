import React, { useEffect, useRef, useState } from 'react'

export const TaglineReveal: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [activeWordsCount, setActiveWordsCount] = useState<number>(0)

  // Sentence carefully written to adhere to copy rules:
  // No hyphens in text, no orphaned words, outcome focused
  const words = [
    'Every',
    'second',
    'of',
    'silence',
    'costs',
    'you',
    'half',
    'your',
    'audience.',
    'LowClips',
    'cuts',
    'the',
    'spaces',
    'between',
    'dialogues',
    'so',
    'viewers',
    'never',
    'swipe',
    'away.',
  ]

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let rafId: number | null = null

    const handleScroll = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        const windowHeight = window.innerHeight

        // Calculate progress through viewport
        const startTrigger = windowHeight * 0.85
        const endTrigger = windowHeight * 0.25

        if (rect.top > startTrigger) {
          setActiveWordsCount(0)
        } else if (rect.top < endTrigger) {
          setActiveWordsCount(words.length)
        } else {
          const ratio = (startTrigger - rect.top) / (startTrigger - endTrigger)
          const count = Math.floor(ratio * (words.length + 1))
          setActiveWordsCount(Math.min(words.length, Math.max(0, count)))
        }
        rafId = null
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [words.length])

  return (
    <section
      ref={containerRef}
      className="w-full max-w-4xl mx-auto px-4 py-24 sm:py-32 flex flex-col items-center text-center select-none"
    >
      <span className="text-xs font-mono uppercase tracking-widest text-[#9B9B9B] mb-6 block">
        The Core Principle
      </span>

      {/* Large type text-4xl to text-6xl, max width 680px */}
      <h2 className="max-w-[680px] mx-auto text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight flex flex-wrap justify-center gap-x-3 gap-y-2">
        {words.map((word, i) => {
          const isRevealed = i < activeWordsCount
          return (
            <span
              key={`${word}-${i}`}
              className="inline-block transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
              style={{
                color: isRevealed ? '#FFFFFF' : 'rgba(255, 255, 255, 0.28)',
                transform: isRevealed ? 'translateY(0)' : 'translateY(4px)',
              }}
            >
              {word}
            </span>
          )
        })}
      </h2>
    </section>
  )
}
