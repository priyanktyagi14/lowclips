export interface TranscriptWord {
  word: string
  start: number
  end: number
}

export interface TranscriptSegment {
  id: string
  speaker: string
  text: string
  start: number
  end: number
  words: TranscriptWord[]
}

export interface SilenceGap {
  id: string
  start: number
  end: number
  duration: number
  speakerBefore: string
  speakerAfter: string
}

export interface ClipMoment {
  id: string
  title: string
  hook: string
  score: number
  start: number
  end: number
  duration: number
  text: string
  speakers: string[]
  viralityReason: string
  rawSegments: TranscriptSegment[]
  silencesCut: number
  savedSeconds: number
}

export type SubtitleStyle = 'mrbeast' | 'clean' | 'cyber' | 'sunset'

export type ColorGrade = 'none' | 'vibrant' | 'cinematic' | 'warm'

export interface BackgroundTrack {
  id: string
  name: string
  genre: string
  bpm: number
  description: string
}

export interface EffectSettings {
  zoomPunches: boolean
  topHookBanner: boolean
  bottomProgressBar: boolean
  colorGrade: ColorGrade
  subtitleStyle: SubtitleStyle
  musicTrack: string
  musicVolume: number
  audioDucking: boolean
  removeSilences: boolean
  silenceCutThreshold: number
}
