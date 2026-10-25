import React from 'react'
import { Scissors, TextT, SpeakerHigh, DeviceMobileCamera } from '@phosphor-icons/react'

export const Benefits: React.FC = () => {
  const benefits = [
    {
      icon: Scissors,
      title: 'Zero dead air',
      description: 'Automated jump cuts eliminate awkward pauses between dialogue turns in one click so viewers stay locked to the screen.',
    },
    {
      icon: TextT,
      title: 'Word level karaoke subtitles',
      description: 'Punchy bottom captions highlight individual spoken words in real time, capturing the eighty percent of users who watch on mute.',
    },
    {
      icon: SpeakerHigh,
      title: 'Automatic royalty free audio',
      description: 'Background beats duck automatically whenever someone speaks, ensuring speech remains crisp and intelligible.',
    },
    {
      icon: DeviceMobileCamera,
      title: 'Vertical nine by sixteen reframing',
      description: 'Converts horizontal footage into social ready vertical formats with smart speaker centering and blurred pillarbox fill.',
    },
  ]

  return (
    <section id="benefits" className="w-full max-w-6xl mx-auto px-4 py-20">
      <div className="text-center max-w-[680px] mx-auto mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-[#9B9B9B] mb-2 block">
          Key Advantages
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#FFFFFF] mb-4">
          Engineered for social retention
        </h2>
        <p className="text-sm sm:text-base text-[#9B9B9B]">
          Every feature in LowClips is designed around one goal: keeping viewers from swiping away before your punchline lands.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {benefits.map((b) => {
          const Icon = b.icon
          return (
            <div
              key={b.title}
              className="p-6 rounded-2xl border border-[#272727] bg-[#181818] flex flex-col gap-4 text-left transition-fluid hover:border-[#313131]"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1F1F1F] border border-[#272727] flex items-center justify-center text-[#FFFFFF]">
                <Icon size={20} weight="fill" />
              </div>
              <h3 className="text-lg font-semibold text-[#FFFFFF]">
                {b.title}
              </h3>
              <p className="text-sm text-[#9B9B9B] leading-relaxed">
                {b.description}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
