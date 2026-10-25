import React, { useEffect, useRef, useState, useCallback } from 'react'
import {
  Play,
  Pause,
  ArrowCounterClockwise,
  DownloadSimple,
  Sparkle,
  FilmStrip,
  SpeakerHigh,
  SpeakerSlash,
} from '@phosphor-icons/react'
import type { ClipMoment, EffectSettings, TranscriptWord } from '../types'

import { backgroundAudioEngine } from '../utils/audioSynthesizer'
import { getJumpCutTime, detectSilenceGaps } from '../utils/silenceDetector'

interface ReelPlayerProps {
  clip: ClipMoment
  settings: EffectSettings
  uploadedVideoUrl: string | null
  onSettingsChange: (settings: EffectSettings) => void
}

export const ReelPlayer: React.FC<ReelPlayerProps> = ({
  clip,
  settings,
  uploadedVideoUrl,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const animFrameRef = useRef<number | null>(null)

  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(clip.start)
  const [isExporting, setIsExporting] = useState<boolean>(false)
  const [exportProgress, setExportProgress] = useState<number>(0)
  const [activeSpeaker, setActiveSpeaker] = useState<string>('Marcus')
  const [currentWord, setCurrentWord] = useState<TranscriptWord | null>(null)
  const [muted, setMuted] = useState<boolean>(false)
  const [exportDownloadUrl, setExportDownloadUrl] = useState<string | null>(null)

  const gaps = detectSilenceGaps(clip.rawSegments, settings.silenceCutThreshold)

  // Reset time when clip changes
  useEffect(() => {
    setIsPlaying(false)
    setCurrentTime(clip.start)
    if (videoRef.current) {
      videoRef.current.currentTime = clip.start
      videoRef.current.pause()
    }
    backgroundAudioEngine.stop()
  }, [clip])

  // Handle play / pause
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false)
      if (videoRef.current) videoRef.current.pause()
      backgroundAudioEngine.stop()
    } else {
      setIsPlaying(true)
      if (videoRef.current) videoRef.current.play()
      if (settings.musicTrack && !muted) {
        backgroundAudioEngine.playTrack(settings.musicTrack, settings.musicVolume)
      }
    }
  }, [isPlaying, settings.musicTrack, settings.musicVolume, muted])

  // Rewind
  const handleRestart = () => {
    setCurrentTime(clip.start)
    if (videoRef.current) {
      videoRef.current.currentTime = clip.start
    }
  }

  // Animation and rendering loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let lastTimestamp = performance.now()

    const render = (now: number) => {
      const dt = (now - lastTimestamp) / 1000
      lastTimestamp = now

      let newTime = currentTime

      if (isPlaying) {
        if (uploadedVideoUrl && videoRef.current) {
          newTime = videoRef.current.currentTime
        } else {
          newTime += dt
        }

        // Jump cut check
        if (settings.removeSilences) {
          const jumpTo = getJumpCutTime(newTime, gaps)
          if (jumpTo !== null && jumpTo < clip.end) {
            newTime = jumpTo
            if (videoRef.current) {
              videoRef.current.currentTime = jumpTo
            }
          }
        }

        // Loop clip when reaching end
        if (newTime >= clip.end) {
          newTime = clip.start
          if (videoRef.current) {
            videoRef.current.currentTime = clip.start
          }
        }

        setCurrentTime(newTime)
      }

      // Determine active speaker and active word
      let speaker = 'Elena'
      let activeW: TranscriptWord | null = null

      for (const seg of clip.rawSegments) {
        if (newTime >= seg.start && newTime <= seg.end) {
          speaker = seg.speaker
          for (const w of seg.words) {
            if (newTime >= w.start && newTime <= w.end) {
              activeW = w
              break
            }
          }
          break
        }
      }

      setActiveSpeaker(speaker)
      setCurrentWord(activeW)

      // Audio ducking
      if (settings.audioDucking && isPlaying) {
        backgroundAudioEngine.setDucking(activeW !== null)
      }

      // ---------------- DRAW 9:16 CANVAS ----------------
      const width = canvas.width
      const height = canvas.height

      ctx.clearRect(0, 0, width, height)

      // Color grade background base
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, width, height)

      // Video frame or synthetic podcast studio
      if (uploadedVideoUrl && videoRef.current && videoRef.current.readyState >= 2) {
        // Draw blurred backdrop for 9:16 pillarbox fill
        ctx.save()
        ctx.filter = 'blur(20px) brightness(0.4)'
        ctx.drawImage(videoRef.current, -width * 0.2, 0, width * 1.4, height)
        ctx.restore()

        // Draw main centered video frame
        const vRatio = videoRef.current.videoWidth / videoRef.current.videoHeight
        const drawH = width / vRatio
        const drawY = (height - drawH) / 2
        ctx.drawImage(videoRef.current, 0, drawY, width, drawH)
      } else {
        // High quality simulated podcast video stream
        drawSimulatedStudio(ctx, width, height, newTime, speaker, activeW !== null, settings)
      }

      // Apply Color Grading Filter overlay
      if (settings.colorGrade === 'vibrant') {
        ctx.fillStyle = 'rgba(255, 140, 0, 0.04)'
        ctx.fillRect(0, 0, width, height)
      } else if (settings.colorGrade === 'cinematic') {
        ctx.fillStyle = 'rgba(0, 60, 80, 0.08)'
        ctx.fillRect(0, 0, width, height)
      } else if (settings.colorGrade === 'warm') {
        ctx.fillStyle = 'rgba(180, 90, 20, 0.06)'
        ctx.fillRect(0, 0, width, height)
      }

      // Top Hook Banner
      if (settings.topHookBanner) {
        drawTopHookBanner(ctx, width, clip.hook)
      }

      // Animated Karaoke Subtitles
      drawAnimatedCaptions(ctx, width, height, clip, newTime, settings.subtitleStyle)

      // Bottom Progress Bar
      if (settings.bottomProgressBar) {
        const progress = Math.min(1, Math.max(0, (newTime - clip.start) / (clip.end - clip.start)))
        ctx.fillStyle = '#272727'
        ctx.fillRect(0, height - 6, width, 6)
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, height - 6, width * progress, 6)
      }

      animFrameRef.current = requestAnimationFrame(render)
    }

    animFrameRef.current = requestAnimationFrame(render)

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [isPlaying, currentTime, clip, settings, uploadedVideoUrl, gaps])

  // Realistic Studio Animation Drawing
  const drawSimulatedStudio = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    time: number,
    speaker: string,
    isSpeaking: boolean,
    opts: EffectSettings
  ) => {
    // Studio gradient background
    const bgGrad = ctx.createRadialGradient(w / 2, h * 0.45, 50, w / 2, h * 0.45, w * 0.9)
    bgGrad.addColorStop(0, '#1F1F1F')
    bgGrad.addColorStop(0.7, '#181818')
    bgGrad.addColorStop(1, '#000000')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, w, h)

    // Acoustic sound panels in background
    ctx.strokeStyle = '#272727'
    ctx.lineWidth = 2
    for (let i = 0; i < 5; i++) {
      ctx.strokeRect(40 + i * 85, h * 0.18, 60, 180)
    }

    // Dynamic zoom punch effect on dialogue emphasis
    ctx.save()
    let scale = 1.0
    if (opts.zoomPunches && isSpeaking) {
      scale = 1.0 + Math.sin(time * 6) * 0.02
    }
    ctx.translate(w / 2, h * 0.5)
    ctx.scale(scale, scale)
    ctx.translate(-w / 2, -h * 0.5)

    // Studio table
    ctx.fillStyle = '#131209'
    ctx.fillRect(0, h * 0.65, w, h * 0.35)
    ctx.strokeStyle = '#272727'
    ctx.beginPath()
    ctx.moveTo(0, h * 0.65)
    ctx.lineTo(w, h * 0.65)
    ctx.stroke()

    // Host & Guest Podcaster Avatars
    const isMarcus = speaker === 'Marcus'
    const centerX = isMarcus ? w * 0.58 : w * 0.42
    const avatarColor = isMarcus ? '#313131' : '#272727'
    const rimLight = isMarcus ? '#FFFFFF' : '#9B9B9B'

    // Subtle head motion
    const bob = isSpeaking ? Math.sin(time * 8) * 3 : 0

    // Speaker Silhouette / Studio Persona
    // Head
    ctx.beginPath()
    ctx.arc(centerX, h * 0.42 + bob, 54, 0, Math.PI * 2)
    ctx.fillStyle = avatarColor
    ctx.fill()
    ctx.strokeStyle = rimLight
    ctx.lineWidth = 3
    ctx.stroke()

    // Headphones
    ctx.strokeStyle = '#9B9B9B'
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.arc(centerX, h * 0.41 + bob, 58, Math.PI * 0.85, Math.PI * 2.15)
    ctx.stroke()

    // Body / shoulders
    ctx.beginPath()
    ctx.ellipse(centerX, h * 0.58 + bob, 95, 60, 0, 0, Math.PI * 2)
    ctx.fillStyle = '#181818'
    ctx.fill()
    ctx.strokeStyle = '#272727'
    ctx.lineWidth = 2
    ctx.stroke()

    // Studio Microphone (Shure SM7B style)
    const micX = centerX + (isMarcus ? -40 : 40)
    const micY = h * 0.5 + bob * 0.5
    ctx.fillStyle = '#000000'
    ctx.strokeStyle = '#9B9B9B'
    ctx.lineWidth = 2
    ctx.fillRect(micX - 12, micY - 24, 24, 48)
    ctx.strokeRect(micX - 12, micY - 24, 24, 48)

    // Mic arm
    ctx.beginPath()
    ctx.moveTo(micX, micY + 24)
    ctx.lineTo(micX + (isMarcus ? -60 : 60), h * 0.68)
    ctx.strokeStyle = '#313131'
    ctx.lineWidth = 5
    ctx.stroke()

    // Speaker badge
    ctx.fillStyle = 'rgba(24, 24, 24, 0.9)'
    ctx.strokeStyle = '#313131'
    ctx.lineWidth = 1
    const badgeW = 140
    const badgeH = 32
    ctx.beginPath()
    ctx.roundRect(centerX - badgeW / 2, h * 0.68, badgeW, badgeH, 16)
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = '#FFFFFF'
    ctx.font = '600 13px Manrope, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(speaker === 'Marcus' ? 'Marcus Brody' : 'Elena Vance', centerX, h * 0.68 + 20)

    ctx.restore()
  }

  // Top Hook Banner
  const drawTopHookBanner = (ctx: CanvasRenderingContext2D, w: number, hookText: string) => {
    ctx.save()
    const bannerW = w * 0.88
    const bannerH = 44
    const bannerX = (w - bannerW) / 2
    const bannerY = 95

    ctx.fillStyle = 'rgba(24, 24, 24, 0.95)'
    ctx.strokeStyle = '#313131'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.roundRect(bannerX, bannerY, bannerW, bannerH, 8)
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = '#FFFFFF'
    ctx.font = '700 14px Manrope, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Truncate if long
    let displayText = hookText
    if (displayText.length > 44) {
      displayText = displayText.slice(0, 42) + '...'
    }
    ctx.fillText(displayText, w / 2, bannerY + bannerH / 2)
    ctx.restore()
  }

  // Animated Karaoke Captions
  const drawAnimatedCaptions = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    currentClip: ClipMoment,
    time: number,
    style: string
  ) => {
    // Find active segment
    let activeSeg = currentClip.rawSegments.find((s) => time >= s.start && time <= s.end)
    if (!activeSeg) {
      // Pick nearest segment
      activeSeg = currentClip.rawSegments[0]
    }

    if (!activeSeg) return

    ctx.save()
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    const captionY = h * 0.78

    // Group words into 3 to 4 word chunks for punchy vertical rhythm
    const words = activeSeg.words
    let chunkStart = 0
    for (let i = 0; i < words.length; i++) {
      if (time >= words[i].start && time <= words[i].end) {
        chunkStart = Math.floor(i / 3) * 3
        break
      }
    }
    const currentChunk = words.slice(chunkStart, chunkStart + 3)

    // Calculate total chunk width with explicit word spacing
    const wordSpacing = 10
    ctx.font = '700 24px Manrope, sans-serif'
    const wordWidths = currentChunk.map((w) => ctx.measureText(w.word).width)
    const totalChunkWidth =
      wordWidths.reduce((a, b) => a + b, 0) + Math.max(0, currentChunk.length - 1) * wordSpacing

    let startX = (w - totalChunkWidth) / 2

    // Background pill for clean minimal style
    if (style === 'clean') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)'
      ctx.beginPath()
      ctx.roundRect(startX - 16, captionY - 22, totalChunkWidth + 32, 44, 8)
      ctx.fill()
    }

    for (let i = 0; i < currentChunk.length; i++) {
      const item = currentChunk[i]
      const isActive = time >= item.start && time <= item.end
      const wordText = item.word

      if (style === 'mrbeast') {
        // Punchy Yellow / White with black stroke (bold 700 per B1)
        ctx.font = '700 24px Manrope, sans-serif'
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 5
        ctx.strokeText(wordText, startX, captionY)

        ctx.fillStyle = isActive ? '#FFE600' : '#FFFFFF'
        ctx.fillText(wordText, startX, captionY)
      } else if (style === 'cyber') {
        // Electric Cyan highlight with shadow
        ctx.font = '700 24px Manrope, sans-serif'
        if (isActive) {
          ctx.shadowColor = '#00F0FF'
          ctx.shadowBlur = 12
          ctx.fillStyle = '#00F0FF'
        } else {
          ctx.shadowBlur = 0
          ctx.fillStyle = '#FFFFFF'
        }
        ctx.fillText(wordText, startX, captionY)
      } else if (style === 'sunset') {
        // Warm Orange Gold highlight
        ctx.font = '700 24px Manrope, sans-serif'
        ctx.fillStyle = isActive ? '#FF9F43' : '#FFFFFF'
        ctx.fillText(wordText, startX, captionY)
      } else {
        // Clean Minimal
        ctx.font = '600 22px Manrope, sans-serif'
        ctx.fillStyle = isActive ? '#FFFFFF' : '#9B9B9B'
        ctx.fillText(wordText, startX, captionY)
      }

      startX += wordWidths[i] + wordSpacing
    }

    ctx.restore()

  }

  // Real WebM/MP4 Export Recording
  const handleExport = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    setIsExporting(true)
    setExportProgress(10)
    setExportDownloadUrl(null)

    // Restart and play clip from beginning
    setCurrentTime(clip.start)
    if (videoRef.current) {
      videoRef.current.currentTime = clip.start
      videoRef.current.play()
    }
    if (settings.musicTrack) {
      backgroundAudioEngine.playTrack(settings.musicTrack, settings.musicVolume)
    }
    setIsPlaying(true)

    // Capture video stream from canvas
    const stream = canvas.captureStream(30)

    // Connect Web Audio background track to the stream if supported
    try {
      const audioCtx = backgroundAudioEngine.getAudioContext()
      const dest = audioCtx.createMediaStreamDestination()
      const gain = backgroundAudioEngine.getGainNode()
      gain.connect(dest)
      const audioTrack = dest.stream.getAudioTracks()[0]
      if (audioTrack) {
        stream.addTrack(audioTrack)
      }
    } catch {
      // Audio capture fallback
    }

    let mimeType = 'video/webm;codecs=vp9'
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm'
    }

    const recorder = new MediaRecorder(stream, { mimeType })
    const chunks: Blob[] = []

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunks.push(e.data)
      }
    }

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' })
      const url = URL.createObjectURL(blob)
      setExportDownloadUrl(url)
      setIsExporting(false)
      setExportProgress(100)
    }

    recorder.start()

    const clipDurationMs = (clip.end - clip.start) * 1000
    const interval = 250
    let elapsed = 0

    const progressTimer = setInterval(() => {
      elapsed += interval
      const pct = Math.min(95, Math.round((elapsed / clipDurationMs) * 100))
      setExportProgress(pct)

      if (elapsed >= clipDurationMs) {
        clearInterval(progressTimer)
        if (recorder.state === 'recording') {
          recorder.stop()
        }
        setIsPlaying(false)
        backgroundAudioEngine.stop()
      }
    }, interval)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start justify-center">
      {/* 9:16 Vertical Video Screen */}
      <div className="relative w-[300px] sm:w-[340px] aspect-[9/16] rounded-2xl border border-[#272727] bg-[#181818] overflow-hidden shadow-2xl flex flex-col items-center justify-center">
        {/* Hidden video element for user uploaded videos */}
        {uploadedVideoUrl && (
          <video
            ref={videoRef}
            src={uploadedVideoUrl}
            playsInline
            muted={muted}
            className="hidden"
          />
        )}

        <canvas
          ref={canvasRef}
          width={540}
          height={960}
          className="w-full h-full object-cover"
        />

        {/* Jump cut indicator pill */}
        {settings.removeSilences && (
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1F1F1F]/90 border border-[#313131] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-semibold text-[#FFFFFF]">Jump cuts active</span>
          </div>
        )}

        {/* Social watermark */}
        <div className="absolute top-4 right-4 z-10 px-2 py-1 rounded-md bg-[#000000]/60 backdrop-blur-sm border border-[#272727]">
          <span className="text-[10px] tracking-wider text-[#9B9B9B] uppercase font-mono">9:16 REEL</span>
        </div>

        {/* Export Progress Overlay */}
        {isExporting && (
          <div className="absolute inset-0 z-30 bg-[#000000]/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <Sparkle size={32} className="text-[#FFFFFF] animate-spin mb-3" />
            <h4 className="text-base font-semibold text-[#FFFFFF] mb-1">Rendering Vertical Reel</h4>
            <p className="text-xs text-[#9B9B9B] mb-4">Burning subtitles, cutting silences, and mixing audio</p>
            <div className="w-full bg-[#272727] rounded-full h-2 mb-2 overflow-hidden">
              <div
                className="bg-[#FFFFFF] h-2 rounded-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              ></div>
            </div>
            <span className="text-xs font-mono text-[#9B9B9B]">{exportProgress}% complete</span>
          </div>
        )}
      </div>

      {/* Control Panel Beside Reel */}
      <div className="w-full max-w-[380px] flex flex-col gap-4">
        {/* Playback Controls Card */}
        <div className="p-4 rounded-xl border border-[#272727] bg-[#181818] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-[#9B9B9B] uppercase">Current Speaker</span>
              <p className="text-sm font-semibold text-[#FFFFFF]">{activeSpeaker}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-[#9B9B9B] uppercase">Clip Duration</span>
              <p className="text-sm font-semibold text-[#FFFFFF] font-mono">{clip.duration}s</p>
            </div>
          </div>

          {/* Time Scrubber */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#9B9B9B]">
              {(currentTime - clip.start).toFixed(1)}s
            </span>
            <input
              type="range"
              min={clip.start}
              max={clip.end}
              step={0.1}
              value={currentTime}
              onChange={(e) => {
                const val = parseFloat(e.target.value)
                setCurrentTime(val)
                if (videoRef.current) videoRef.current.currentTime = val
              }}
              className="w-full accent-[#FFFFFF] cursor-pointer"
            />
            <span className="text-xs font-mono text-[#9B9B9B]">{clip.duration}s</span>
          </div>

          {/* Play / Restart / Mute buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={togglePlay}
              className="flex-1 py-2 px-3 rounded-lg bg-[#FFFFFF] text-[#000000] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#E5E5E5] active:scale-[0.98] transition-fluid"
            >
              {isPlaying ? <Pause size={18} weight="fill" /> : <Play size={18} weight="fill" />}
              {isPlaying ? 'Pause' : 'Play preview'}
            </button>

            <button
              type="button"
              onClick={handleRestart}
              aria-label="Restart clip"
              className="p-2 rounded-lg border border-[#272727] bg-[#1F1F1F] text-[#FFFFFF] hover:bg-[#272727] active:scale-[0.98] transition-fluid"
            >
              <ArrowCounterClockwise size={18} />
            </button>

            <button
              type="button"
              onClick={() => {
                setMuted(!muted)
                if (!muted) backgroundAudioEngine.stop()
              }}
              aria-label="Toggle audio"
              className="p-2 rounded-lg border border-[#272727] bg-[#1F1F1F] text-[#FFFFFF] hover:bg-[#272727] active:scale-[0.98] transition-fluid"
            >
              {muted ? <SpeakerSlash size={18} /> : <SpeakerHigh size={18} />}
            </button>
          </div>
        </div>

        {/* Dead Air Removal Stats */}
        <div className="p-4 rounded-xl border border-[#272727] bg-[#181818] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1F1F1F] border border-[#272727] flex items-center justify-center text-emerald-400">
              <FilmStrip size={20} />
            </div>
            <div>
              <p className="text-xs text-[#9B9B9B]">Dead Air Cut</p>
              <p className="text-sm font-semibold text-[#FFFFFF]">
                {clip.savedSeconds > 0 ? `${clip.savedSeconds}s removed` : 'Zero dead space'}
              </p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#1F1F1F] border border-[#272727] text-emerald-400 font-mono">
            {clip.silencesCut} pauses cut
          </span>
        </div>

        {/* Live Active Word Pill */}
        <div className="p-4 rounded-xl border border-[#272727] bg-[#181818]">
          <span className="text-xs font-mono text-[#9B9B9B] uppercase block mb-1">
            Karaoke Subtitle Sync
          </span>
          <p className="text-xs text-[#9B9B9B] mb-2">Synchronized with speaker cadence</p>
          <div className="min-h-[44px] flex items-center justify-center px-3 py-2 rounded-lg bg-[#1F1F1F] border border-[#272727]">
            <span className="text-base font-bold text-[#FFE600] font-mono">
              {currentWord ? `"${currentWord.word}"` : 'Listening...'}
            </span>
          </div>
        </div>

        {/* Export / Download Button */}
        {exportDownloadUrl ? (
          <a
            href={exportDownloadUrl}
            download={`${clip.title.toLowerCase().replace(/\s+/g, '_')}_reel.webm`}
            className="w-full py-2.5 px-3 rounded-lg bg-emerald-500 text-[#000000] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-emerald-400 active:scale-[0.98] transition-fluid shadow-lg"
          >
            <DownloadSimple size={18} weight="bold" />
            Download completed reel
          </a>
        ) : (
          <button
            type="button"
            disabled={isExporting}
            onClick={handleExport}
            className="w-full py-2.5 px-3 rounded-lg bg-[#FFFFFF] text-[#000000] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#E5E5E5] active:scale-[0.98] transition-fluid disabled:opacity-50"
          >
            <DownloadSimple size={18} weight="bold" />
            {isExporting ? 'Exporting vertical video...' : 'Export 9:16 vertical video'}
          </button>
        )}
      </div>
    </div>
  )
}
