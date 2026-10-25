import React from 'react'
import { UploadSimple, Lightning, DownloadSimple } from '@phosphor-icons/react'

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      icon: UploadSimple,
      title: 'Import long recording and transcript',
      description: 'Upload your twenty minute video or paste a transcript. You can also test instantly with our preloaded studio conversation.',
    },
    {
      number: '02',
      icon: Lightning,
      title: 'Auto cut dead air and extract clips',
      description: 'LowClips identifies the five to ten highest engagement segments and snips every silence gap between dialogue turns.',
    },
    {
      number: '03',
      icon: DownloadSimple,
      title: 'Style captions, add music, and export',
      description: 'Select your preferred karaoke subtitle font, adjust background beats, and download a ready to publish nine by sixteen reel.',
    },
  ]

  return (
    <section id="how-it-works" className="w-full max-w-6xl mx-auto px-4 py-20">
      <div className="text-center max-w-[680px] mx-auto mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-[#9B9B9B] mb-2 block">
          Simple Workflow
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#FFFFFF] mb-4">
          From full episode to viral clips in three steps
        </h2>
        <p className="text-sm sm:text-base text-[#9B9B9B]">
          No complex video editing timeline or manual keyframing required.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((st) => {
          const Icon = st.icon
          return (
            <div
              key={st.number}
              className="p-6 rounded-2xl border border-[#272727] bg-[#181818] flex flex-col text-left transition-fluid hover:border-[#313131]"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-2xl font-bold font-mono text-[#9B9B9B]">
                  {st.number}
                </span>
                <div className="w-9 h-9 rounded-xl bg-[#1F1F1F] border border-[#272727] flex items-center justify-center text-[#FFFFFF]">
                  <Icon size={18} />
                </div>
              </div>
              <h3 className="text-base font-semibold text-[#FFFFFF] mb-2">
                {st.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#9B9B9B] leading-relaxed">
                {st.description}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
