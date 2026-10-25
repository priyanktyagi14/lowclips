import React from 'react'
import { Star, TrendUp, Clock, Eye } from '@phosphor-icons/react'

export const ProofSection: React.FC = () => {
  const metrics = [
    {
      icon: TrendUp,
      value: '+47.2%',
      label: 'Average retention uplift',
      detail: 'Viewers stayed through the entire clip after dead spaces were cut',
    },
    {
      icon: Eye,
      value: '3.4M',
      label: 'Organic views recorded',
      detail: 'Generated across customer TikTok and Instagram accounts last month',
    },
    {
      icon: Clock,
      value: '14 mins',
      label: 'Editing time reduced to seconds',
      detail: 'Replaced manual scrubbing with one click transcript segmentation',
    },
  ]

  const reviews = [
    {
      name: 'Maya Patel',
      role: 'Host at The Modern Studio Podcast',
      content:
        'Cutting pauses between guests used to take me two hours of tedious slicing on DaVinci. LowClips did it in eight seconds and the captions look identical to top creators.',
      metric: '320k views on first batch',
    },
    {
      name: 'Daniel Chen',
      role: 'Growth Lead at Orbit Audio',
      content:
        'The audio ducking is what sold our team. The background beat never covers up the punchline, and the MrBeast style subtitle highlight keeps muted viewers hooked.',
      metric: '4.8x share rate increase',
    },
    {
      name: 'Soraya Lindqvist',
      role: 'Independent Tech Creator',
      content:
        'I turned a single thirty minute discussion into nine distinct Reels. Five of them crossed ten thousand views within forty eight hours of posting.',
      metric: '128k followers gained',
    },
  ]

  return (
    <section id="proof" className="w-full max-w-6xl mx-auto px-4 py-20">
      <div className="text-center max-w-[680px] mx-auto mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-[#9B9B9B] mb-2 block">
          Social Proof
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#FFFFFF] mb-4">
          Trusted by social media creators
        </h2>
        <p className="text-sm sm:text-base text-[#9B9B9B]">
          Organic growth metrics from teams publishing daily short form content.
        </p>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {metrics.map((m) => {
          const Icon = m.icon
          return (
            <div
              key={m.label}
              className="p-6 rounded-2xl border border-[#272727] bg-[#181818] flex flex-col text-left"
            >
              <div className="flex items-center gap-2 mb-3 text-emerald-400">
                <Icon size={18} />
                <span className="text-xs font-semibold uppercase font-mono">Organic metric</span>
              </div>
              <span className="text-3xl font-bold font-mono text-[#FFFFFF] mb-1">
                {m.value}
              </span>
              <span className="text-sm font-semibold text-[#FFFFFF] mb-1">
                {m.label}
              </span>
              <p className="text-xs text-[#9B9B9B]">
                {m.detail}
              </p>
            </div>
          )
        })}
      </div>

      {/* Testimonial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((r) => (
          <div
            key={r.name}
            className="p-6 rounded-2xl border border-[#272727] bg-[#181818] flex flex-col justify-between text-left transition-fluid hover:border-[#313131]"
          >
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} weight="fill" />
                ))}
              </div>
              <p className="text-sm text-[#9B9B9B] leading-relaxed mb-6">
                "{r.content}"
              </p>
            </div>

            <div className="pt-4 border-t border-[#272727] flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#FFFFFF]">{r.name}</p>
                <p className="text-xs text-[#9B9B9B]">{r.role}</p>
              </div>
              <span className="px-2 py-1 rounded bg-[#1F1F1F] text-[10px] font-mono text-emerald-400 border border-[#272727]">
                {r.metric}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
