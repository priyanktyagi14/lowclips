import React, { useState } from 'react'
import { VideoCamera, Sparkle } from '@phosphor-icons/react'

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { label: 'Studio', href: '#studio-tool' },
    { label: 'Silence cutter', href: '#silence-section' },
    { label: 'Benefits', href: '#benefits' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Proof', href: '#proof' },
    { label: 'FAQ', href: '#faq' },
  ]

  return (
    <>
      {/* Fluid Island Nav (B7) - Floating glass pill detached from top */}
      <header className="fixed top-0 left-0 right-0 z-40 pointer-events-none flex justify-center px-4">
        <nav
          aria-label="Main Navigation"
          className="mt-6 mx-auto w-max max-w-full rounded-full border border-[#272727] bg-[#181818]/90 backdrop-blur-xl px-4 py-2 flex items-center gap-6 shadow-2xl pointer-events-auto transition-fluid"
        >
          {/* Brand Logo */}
          <a
            href="#"
            className="flex items-center gap-2 text-sm font-bold text-[#FFFFFF] group"
          >
            <div className="w-7 h-7 rounded-full bg-[#1F1F1F] border border-[#313131] flex items-center justify-center text-[#FFFFFF] group-hover:border-[#FFFFFF] transition-fluid">
              <VideoCamera size={14} weight="fill" />
            </div>
            <span>LowClips</span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-5">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-xs font-semibold text-[#9B9B9B] hover:text-[#FFFFFF] transition-fluid"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right CTA Button & Hamburger */}
          <div className="flex items-center gap-3">
            <a
              href="#studio-tool"
              className="py-2 px-3 text-sm font-semibold rounded-lg bg-[#FFFFFF] text-[#000000] hover:bg-[#E5E5E5] active:scale-[0.98] active:translate-y-[1px] transition-fluid flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#9B9B9B] focus-visible:outline-none"
            >
              <Sparkle size={14} weight="fill" />
              <span>Launch studio</span>
            </a>

            {/* Hamburger Button for mobile adhering to B7 */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
              className="md:hidden relative w-8 h-8 flex flex-col justify-center items-center rounded-lg bg-[#1F1F1F] border border-[#272727] active:scale-[0.98]"
            >
              <span
                className={`block h-0.5 w-4 bg-[#FFFFFF] transition-all duration-300 ${
                  isOpen ? 'rotate-45 translate-y-[2px]' : '-translate-y-1'
                }`}
              ></span>
              <span
                className={`block h-0.5 w-4 bg-[#FFFFFF] transition-all duration-300 ${
                  isOpen ? '-rotate-45 -translate-y-[0px]' : 'translate-y-1'
                }`}
              ></span>
            </button>
          </div>
        </nav>
      </header>

      {/* Screen filling glass modal expansion on mobile (B7) */}
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-[#000000]/85 backdrop-blur-3xl flex flex-col items-center justify-center p-8 transition-fluid">
          <div className="flex flex-col items-center gap-6 text-center">
            {navLinks.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                style={{ transitionDelay: `${index * 50}ms` }}
                className="text-2xl font-bold text-[#FFFFFF] hover:text-[#9B9B9B] transition-fluid"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#studio-tool"
              onClick={() => setIsOpen(false)}
              className="mt-4 py-2 px-6 text-base font-semibold rounded-lg bg-[#FFFFFF] text-[#000000] active:scale-[0.98] transition-fluid"
            >
              Launch clip studio
            </a>
          </div>
        </div>
      )}
    </>
  )
}
