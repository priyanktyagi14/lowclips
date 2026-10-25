import type { TranscriptSegment, SilenceGap } from '../types'

/**
 * Detects dead air pauses between speaker turns and pauses within speech.
 * Default threshold is 0.4 seconds (standard for modern social short form).
 */
export function detectSilenceGaps(
  segments: TranscriptSegment[],
  thresholdSeconds: number = 0.4
): SilenceGap[] {
  const gaps: SilenceGap[] = []

  for (let i = 0; i < segments.length - 1; i++) {
    const current = segments[i]
    const next = segments[i + 1]
    const gapDuration = next.start - current.end

    if (gapDuration >= thresholdSeconds) {
      gaps.push({
        id: `gap-${i}`,
        start: current.end,
        end: next.start,
        duration: Number(gapDuration.toFixed(2)),
        speakerBefore: current.speaker,
        speakerAfter: next.speaker,
      })
    }
  }

  return gaps
}

/**
 * Calculates how many seconds of dead space exist within a given time range.
 */
export function calculateSavedTime(
  gaps: SilenceGap[],
  rangeStart: number,
  rangeEnd: number
): { savedSeconds: number; cutCount: number } {
  let saved = 0
  let count = 0

  for (const gap of gaps) {
    if (gap.start >= rangeStart && gap.end <= rangeEnd) {
      saved += gap.duration
      count++
    }
  }

  return {
    savedSeconds: Number(saved.toFixed(2)),
    cutCount: count,
  }
}

/**
 * Given a raw video timestamp, returns the next timestamp if it falls inside a dead silence gap.
 */
export function getJumpCutTime(
  currentTime: number,
  gaps: SilenceGap[]
): number | null {
  for (const gap of gaps) {
    if (currentTime >= gap.start && currentTime < gap.end) {
      return gap.end
    }
  }
  return null
}
