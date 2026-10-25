import React from 'react'
import { VideoCamera, ArrowUp } from '@phosphor-icons/react'

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="w-full border-t border-[#272727] bg-[#181818] py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#1F1F1F] border border-[#313131] flex items-center justify-center text-[#FFFFFF]">
            <VideoCamera size={14} weight="fill" />
          </div>
          <span className="text-sm font-bold text-[#FFFFFF]">LowClips</span>
          <span className="text-xs text-[#9B9B9B] ml-2">
            © 2026 LowClips. Built for social creators.
          </span>
        </div>

        {/* Legal links per B10 */}
        <div className="flex items-center gap-6 text-xs text-[#9B9B9B]">
          <a href="#studio-tool" className="hover:text-[#FFFFFF] transition-fluid">
            Studio
          </a>
          <a href="#" className="hover:text-[#FFFFFF] transition-fluid">
            Privacy policy
          </a>
          <a href="#" className="hover:text-[#FFFFFF] transition-fluid">
            Terms of service
          </a>
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1 hover:text-[#FFFFFF] transition-fluid ml-2"
          >
            <span>Back to top</span>
            <ArrowUp size={12} />
          </button>
        </div>
      </div>
    </footer>
  )
}
