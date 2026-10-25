import React, { useState } from 'react'
import { CaretDown } from '@phosphor-icons/react'

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: 'How does the silence removal cut awkward dialogue gaps?',
      answer:
        'The silence detector measures pause durations between spoken words and across speaker turn transitions. When a gap exceeds your chosen threshold (for example 0.4 seconds), LowClips performs an instant jump cut so viewers never experience lingering dead air.',
    },
    {
      question: 'What video and transcript formats are supported?',
      answer:
        'You can import MP4, WebM, or MOV video files up to two gigabytes. For transcripts, we support SRT, VTT, JSON, and plain text formatted with timestamps. You can also paste transcript dialogue directly into the studio workspace.',
    },
    {
      question: 'Can I customize the duration of extracted clips?',
      answer:
        'Yes. By default the AI identifies viral segments between ten and fifteen seconds, which is the proven sweet spot for Instagram Reels and YouTube Shorts retention. You can trim start and end points manually with the timeline scrubber.',
    },
    {
      question: 'Are the background music tracks copyright safe for monetization?',
      answer:
        'Every background track provided in LowClips is synthesized royalty free audio. You can publish your vertical reels to TikTok, YouTube Shorts, Instagram Reels, and LinkedIn without risk of copyright strikes or audio muting.',
    },
    {
      question: 'How do the animated subtitles stay in sync during jump cuts?',
      answer:
        'Subtitles are indexed with millisecond word timestamps. When silence gaps are skipped, the playback timeline advances automatically to the next spoken syllable so captions remain perfectly synchronized.',
    },
    {
      question: 'Does video rendering happen locally on my computer?',
      answer:
        'Yes. Video canvas rendering, audio ducking synthesis, and clip export are processed directly inside your modern browser using Web Audio and MediaRecorder APIs. Your footage never leaves your device unless you choose cloud backup.',
    },
    {
      question: 'What is included in the free tier?',
      answer:
        'The free plan includes five vertical reel exports every week with full access to silence removal, all four karaoke subtitle styles, and background music tracks. No credit card is required to get started.',
    },
  ]

  return (
    <section id="faq" className="w-full max-w-4xl mx-auto px-4 py-20">
      <div className="text-center max-w-[680px] mx-auto mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-[#9B9B9B] mb-2 block">
          Questions and Answers
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#FFFFFF] mb-4">
          Frequently asked questions
        </h2>
        <p className="text-sm sm:text-base text-[#9B9B9B]">
          Everything you need to know about cutting dead air and creating viral social clips.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {faqs.map((f, i) => {
          const isOpen = openIndex === i
          return (
            <div
              key={f.question}
              className="rounded-xl border border-[#272727] bg-[#181818] overflow-hidden transition-fluid"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-[#FFFFFF]"
              >
                <span>{f.question}</span>
                <CaretDown
                  size={16}
                  className={`text-[#9B9B9B] transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-[#FFFFFF]' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-[#9B9B9B] leading-relaxed border-t border-[#272727] pt-4">
                  {f.answer}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
