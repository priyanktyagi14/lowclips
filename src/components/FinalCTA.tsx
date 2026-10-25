import React from 'react'
import { Sparkle, ShieldCheck } from '@phosphor-icons/react'

export const FinalCTA: React.FC = () => {
  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-24 text-center">
      <div className="p-8 sm:p-12 rounded-3xl border border-[#272727] bg-[#181818] flex flex-col items-center">
        <h2 className="max-w-[680px] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FFFFFF] mb-4">
          Ready to turn long recordings into viral reels?
        </h2>
        <p className="max-w-[540px] text-sm sm:text-base text-[#9B9B9B] mb-8 leading-relaxed">
          Launch the studio now to test with our sample podcast interview or import your own footage in seconds.
        </p>

        {/* Primary CTA identical to top per A2 */}
        <a
          href="#studio-tool"
          className="py-2 px-4 text-base font-semibold rounded-lg bg-[#FFFFFF] text-[#000000] hover:bg-[#E5E5E5] active:scale-[0.98] active:translate-y-[1px] transition-fluid flex items-center gap-2 shadow-2xl focus-visible:ring-2 focus-visible:ring-[#9B9B9B] focus-visible:outline-none mb-4"
        >
          <Sparkle size={18} weight="fill" />
          <span>Launch clip studio</span>
        </a>

        {/* Risk reversal per A4 */}
        <div className="flex items-center gap-2 text-xs text-[#9B9B9B]">
          <ShieldCheck size={16} className="text-emerald-400" />
          <span>Free tier includes five vertical exports weekly. No credit card required.</span>
        </div>
      </div>
    </section>
  )
}
