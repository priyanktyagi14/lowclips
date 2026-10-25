import React from 'react'
import { Sparkle, Play, ArrowDown, Scissors, Waveform } from '@phosphor-icons/react'

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-36 pb-16 px-4 flex flex-col items-center text-center">
      {/* Proof Signal Badge */}
      <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#272727] bg-[#181818] text-xs font-semibold text-[#FFFFFF] shadow-lg">
        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        <span>48,200 vertical reels generated this month by 1,240 creators</span>
      </div>

      {/* Hero Headline adhering to B5 */}
      {/* Max width 680px, left to right gradient #FFFFFF -> #9B9B9B, line breaks at meaningful thoughts */}
      <h1 className="max-w-[680px] mx-auto text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight hero-heading-gradient leading-tight mb-6">
        Turn twenty minute videos<br />
        into viral social clips<br />
        with zero dead air
      </h1>

      {/* Hero Subheadline adhering to B5 */}
      {/* Max width 680px, clarifies how and adds specificity */}
      <p className="max-w-[680px] mx-auto text-base sm:text-lg text-[#9B9B9B] leading-relaxed mb-8">
        Upload your long recording and transcript. LowClips cuts out awkward dialogue pauses, generates five to ten punchy vertical reels, and burns dynamic karaoke subtitles with background beats.
      </p>

      {/* Primary CTA adhering to A5 & B2 */}
      {/* Main button: 8px vertical padding (py-2), 12px horizontal padding (px-3), text-base semibold */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
        <a
          href="#studio-tool"
          className="py-2 px-3 text-base font-semibold rounded-lg bg-[#FFFFFF] text-[#000000] hover:bg-[#E5E5E5] active:scale-[0.98] active:translate-y-[1px] transition-fluid flex items-center justify-center gap-2 shadow-2xl focus-visible:ring-2 focus-visible:ring-[#9B9B9B] focus-visible:outline-none"
        >
          <Sparkle size={18} weight="fill" />
          <span>Launch clip studio</span>
        </a>

        <a
          href="#how-it-works"
          className="py-2 px-3 text-base font-semibold rounded-lg bg-[#181818] hover:bg-[#1F1F1F] text-[#FFFFFF] border border-[#272727] active:scale-[0.98] active:translate-y-[1px] transition-fluid flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#9B9B9B] focus-visible:outline-none"
        >
          <Play size={16} weight="fill" />
          <span>See how it works</span>
        </a>
      </div>

      {/* Hero Visual Mockup Preview */}
      <div className="w-full max-w-4xl mx-auto rounded-2xl border border-[#272727] bg-[#181818] p-3 sm:p-4 shadow-2xl">
        <div className="w-full rounded-xl bg-[#000000] border border-[#272727] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left card representation */}
          <div className="flex-1 text-left flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#1F1F1F] text-xs font-mono text-[#FFFFFF] border border-[#272727]">
                INPUT: 20m 00s PODCAST
              </span>
              <span className="text-xs text-[#9B9B9B] font-mono">1.2GB recording</span>
            </div>
            <h3 className="text-xl font-bold text-[#FFFFFF]">
              Automatic Silence Stripper In Action
            </h3>
            <p className="text-xs text-[#9B9B9B]">
              Detects and removes all silence between dialogue turns above 0.4 seconds, keeping viewers engaged during speaker transitions.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                <Scissors size={14} />
                <span>7 awkward pauses removed</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#9B9B9B] font-mono">
                <Waveform size={14} />
                <span>6 viral moments extracted</span>
              </div>
            </div>
          </div>

          {/* Right reel cards thumbnail preview */}
          <div className="flex items-center gap-3">
            <div className="w-28 sm:w-32 aspect-[9/16] rounded-lg bg-[#181818] border border-[#313131] p-2 flex flex-col justify-between text-left relative overflow-hidden">
              <span className="text-[10px] font-mono text-emerald-400">CLIP 1 • 12s</span>
              <div className="my-auto py-1 px-1.5 rounded bg-[#000000]/80 border border-[#272727]">
                <p className="text-[10px] font-bold text-[#FFE600] leading-tight">
                  "FORTY HOURS IS ZERO REACH"
                </p>
              </div>
              <div className="w-full bg-emerald-500 h-1 rounded-full"></div>
            </div>

            <div className="w-28 sm:w-32 aspect-[9/16] rounded-lg bg-[#1F1F1F] border border-[#FFFFFF] p-2 flex flex-col justify-between text-left relative overflow-hidden shadow-xl scale-105">
              <span className="text-[10px] font-mono text-[#FFFFFF]">CLIP 2 • 14s</span>
              <div className="my-auto py-1 px-1.5 rounded bg-[#000000]/80 border border-[#272727]">
                <p className="text-[10px] font-bold text-[#FFFFFF] leading-tight">
                  "CUT EVERY SINGLE PAUSE"
                </p>
              </div>
              <div className="w-full bg-[#FFFFFF] h-1 rounded-full"></div>
            </div>

            <div className="hidden sm:flex w-28 sm:w-32 aspect-[9/16] rounded-lg bg-[#181818] border border-[#313131] p-2 flex-col justify-between text-left relative overflow-hidden">
              <span className="text-[10px] font-mono text-emerald-400">CLIP 3 • 11s</span>
              <div className="my-auto py-1 px-1.5 rounded bg-[#000000]/80 border border-[#272727]">
                <p className="text-[10px] font-bold text-[#00F0FF] leading-tight">
                  "80% WATCH ON MUTE"
                </p>
              </div>
              <div className="w-full bg-[#00F0FF] h-1 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Down indicator */}
      <a
        href="#studio-tool"
        aria-label="Scroll to clip studio"
        className="mt-8 text-[#9B9B9B] hover:text-[#FFFFFF] transition-fluid animate-bounce"
      >
        <ArrowDown size={20} />
      </a>
    </section>
  )
}
