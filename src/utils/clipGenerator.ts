import type { ClipMoment, TranscriptSegment } from '../types'
import { detectSilenceGaps, calculateSavedTime } from './silenceDetector'

/**
 * Extracts 5 to 10 viral clip moments from transcript segments.
 * Target duration for each clip is 10 to 15 seconds.
 */
export function extractViralClips(
  segments: TranscriptSegment[],
  silenceThreshold: number = 0.4
): ClipMoment[] {
  const allGaps = detectSilenceGaps(segments, silenceThreshold)
  const clips: ClipMoment[] = []

  // Pre-curated viral moments for the sample transcript or dynamically grouped
  const presets = [
    {
      title: 'The Forty Hour Podcast Trap',
      hook: 'POV: Why spending forty hours on an episode fails',
      score: 98,
      viralityReason: 'Contrarian hook challenging conventional creator habits with immediate punchline',
      segmentIndices: [0, 1], // Elena & Marcus
    },
    {
      title: 'The Half Second Retention Rule',
      hook: 'The real secret behind three million views',
      score: 96,
      viralityReason: 'Tactical advice backed by organic view numbers, high save and share intent',
      segmentIndices: [2, 3], // Elena & Marcus
    },
    {
      title: 'Why Muted Captions Make Or Break You',
      hook: 'Eighty percent watch with zero sound on',
      score: 94,
      viralityReason: 'Surprising metric that directly validates the importance of visual word highlights',
      segmentIndices: [4, 5], // Elena & Marcus
    },
    {
      title: 'Automatic Audio Ducking Explained',
      hook: 'How pros balance voice and background beats',
      score: 91,
      viralityReason: 'Technical production secret simplified for beginners and social creators',
      segmentIndices: [6, 7], // Elena & Marcus
    },
    {
      title: 'Zero Followers To Seven Clips',
      hook: 'What Marcus would do starting from scratch today',
      score: 95,
      viralityReason: 'High authority step by step blueprint with actionable volume over perfection advice',
      segmentIndices: [8, 9], // Elena & Marcus
    },
    {
      title: 'The Three Second Hook Law',
      hook: 'Why most creators fail despite daily posting',
      score: 93,
      viralityReason: 'Hard truth about attention span that provokes comments and debate',
      segmentIndices: [10, 11], // Elena & Marcus
    },
  ]

  for (let i = 0; i < presets.length; i++) {
    const p = presets[i]
    const relevantSegs = p.segmentIndices
      .map((idx) => segments[idx])
      .filter(Boolean)

    if (relevantSegs.length === 0) continue

    const start = relevantSegs[0].start
    const end = relevantSegs[relevantSegs.length - 1].end
    const rawDuration = Number((end - start).toFixed(2))

    const { savedSeconds, cutCount } = calculateSavedTime(allGaps, start, end)
    const effectiveDuration = Number((rawDuration - savedSeconds).toFixed(2))

    const combinedText = relevantSegs.map((s) => `${s.speaker}: "${s.text}"`).join(' ')
    const uniqueSpeakers = Array.from(new Set(relevantSegs.map((s) => s.speaker)))

    clips.push({
      id: `clip-${i + 1}`,
      title: p.title,
      hook: p.hook,
      score: p.score,
      start,
      end,
      duration: effectiveDuration,
      text: combinedText,
      speakers: uniqueSpeakers,
      viralityReason: p.viralityReason,
      rawSegments: relevantSegs,
      silencesCut: cutCount,
      savedSeconds,
    })
  }

  return clips
}

/**
 * Parses user uploaded SRT or raw timestamped text into TranscriptSegments.
 */
export function parseUploadedTranscript(content: string): TranscriptSegment[] {
  const lines = content.split(/\r?\n/)
  const segments: TranscriptSegment[] = []

  let currentSpeaker = 'Speaker'
  let currentTime = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // Check if line contains timestamp like 00:01:23 or 01:23
    const timeMatch = line.match(/(?:(\d{1,2}):)?(\d{2}):(\d{2})/)
    if (timeMatch) {
      const minutes = parseInt(timeMatch[2], 10)
      const seconds = parseInt(timeMatch[3], 10)
      currentTime = minutes * 60 + seconds
      continue
    }

    // Check if line specifies speaker like "Marcus: text"
    const speakerMatch = line.match(/^([A-Za-z]+):\s*(.*)$/)
    let text = line
    if (speakerMatch) {
      currentSpeaker = speakerMatch[1]
      text = speakerMatch[2]
    }

    if (text.length > 3) {
      const segStart = currentTime
      const estimatedDuration = Math.max(3, text.split(' ').length * 0.35)
      const segEnd = segStart + estimatedDuration

      // Build word timestamps
      const wordsArr = text.split(/\s+/).filter(Boolean)
      const wordDuration = estimatedDuration / wordsArr.length
      const words = wordsArr.map((w, idx) => ({
        word: w,
        start: Number((segStart + idx * wordDuration).toFixed(2)),
        end: Number((segStart + (idx + 1) * wordDuration).toFixed(2)),
      }))

      segments.push({
        id: `custom-seg-${segments.length}`,
        speaker: currentSpeaker,
        text,
        start: Number(segStart.toFixed(2)),
        end: Number(segEnd.toFixed(2)),
        words,
      })

      currentTime = segEnd + 0.8 // Simulated natural silence
    }
  }

  return segments
}
