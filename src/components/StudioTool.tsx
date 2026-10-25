import React, { useState, useId } from 'react'
import {
  UploadSimple,
  FilmReel,
  Waveform,
  SlidersHorizontal,
  MusicNotes,
  TextT,
  CheckCircle,
  Lightning,
} from '@phosphor-icons/react'
import type { ClipMoment, EffectSettings, TranscriptSegment } from '../types'

import { SAMPLE_LONG_TRANSCRIPT } from '../utils/sampleData'
import { extractViralClips, parseUploadedTranscript } from '../utils/clipGenerator'
import { detectSilenceGaps } from '../utils/silenceDetector'
import { AVAILABLE_TRACKS } from '../utils/audioSynthesizer'
import { ReelPlayer } from './ReelPlayer'

export const StudioTool: React.FC = () => {
  const fileInputId = useId()
  const transcriptInputId = useId()

  const [segments, setSegments] = useState<TranscriptSegment[]>(SAMPLE_LONG_TRANSCRIPT)
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null)
  const [uploadedVideoName, setUploadedVideoName] = useState<string>('twenty_minute_podcast_interview.mp4')
  const [activeTab, setActiveTab] = useState<'editor' | 'silence' | 'effects'>('editor')

  // Effect settings
  const [settings, setSettings] = useState<EffectSettings>({
    zoomPunches: true,
    topHookBanner: true,
    bottomProgressBar: true,
    colorGrade: 'cinematic',
    subtitleStyle: 'mrbeast',
    musicTrack: 'lofi',
    musicVolume: 0.35,
    audioDucking: true,
    removeSilences: true,
    silenceCutThreshold: 0.4,
  })

  // Generated clips
  const [clips, setClips] = useState<ClipMoment[]>(() =>
    extractViralClips(SAMPLE_LONG_TRANSCRIPT, settings.silenceCutThreshold)
  )
  const [selectedClipId, setSelectedClipId] = useState<string>(clips[0]?.id || '')

  const selectedClip = clips.find((c) => c.id === selectedClipId) || clips[0]

  // Detect silence gaps across whole transcript
  const allGaps = detectSilenceGaps(segments, settings.silenceCutThreshold)
  const totalDeadSeconds = allGaps.reduce((acc, g) => acc + g.duration, 0)

  // Handle video upload
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setUploadedVideoUrl(url)
      setUploadedVideoName(file.name)
    }
  }

  // Handle transcript upload
  const handleTranscriptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        if (content) {
          const parsed = parseUploadedTranscript(content)
          if (parsed.length > 0) {
            setSegments(parsed)
            const newClips = extractViralClips(parsed, settings.silenceCutThreshold)
            setClips(newClips)
            if (newClips.length > 0) {
              setSelectedClipId(newClips[0].id)
            }
          }
        }
      }
      reader.readAsText(file)
    }
  }

  // Handle threshold change
  const handleThresholdChange = (val: number) => {
    setSettings((prev) => ({ ...prev, silenceCutThreshold: val }))
    const newClips = extractViralClips(segments, val)
    setClips(newClips)
  }

  // Restore sample video
  const handleResetToSample = () => {
    setUploadedVideoUrl(null)
    setUploadedVideoName('twenty_minute_podcast_interview.mp4')
    setSegments(SAMPLE_LONG_TRANSCRIPT)
    const newClips = extractViralClips(SAMPLE_LONG_TRANSCRIPT, settings.silenceCutThreshold)
    setClips(newClips)
    setSelectedClipId(newClips[0].id)
  }

  return (
    <section id="studio-tool" className="w-full max-w-7xl mx-auto px-4 py-12 scroll-mt-24">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#272727]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-mono text-[#9B9B9B] uppercase tracking-wider">
              Studio Workspace
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#FFFFFF]">
            LowClips Video To Reel Studio
          </h2>
          <p className="text-sm text-[#9B9B9B] mt-1">
            Remove dead air pauses, extract viral clips, and generate vertical shorts with captions
          </p>
        </div>

        {/* Source file badge & actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-[#181818] border border-[#272727] flex items-center gap-2">
            <FilmReel size={16} className="text-[#9B9B9B]" />
            <span className="text-xs font-mono text-[#FFFFFF] truncate max-w-[180px]">
              {uploadedVideoName}
            </span>
          </div>

          <label
            htmlFor={fileInputId}
            className="cursor-pointer px-3 py-1.5 rounded-lg bg-[#1F1F1F] hover:bg-[#272727] border border-[#272727] text-xs font-semibold text-[#FFFFFF] flex items-center gap-1.5 active:scale-[0.98] transition-fluid"
          >
            <UploadSimple size={14} />
            Upload video
            <input
              id={fileInputId}
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
            />
          </label>

          <label
            htmlFor={transcriptInputId}
            className="cursor-pointer px-3 py-1.5 rounded-lg bg-[#1F1F1F] hover:bg-[#272727] border border-[#272727] text-xs font-semibold text-[#FFFFFF] flex items-center gap-1.5 active:scale-[0.98] transition-fluid"
          >
            <UploadSimple size={14} />
            Upload transcript
            <input
              id={transcriptInputId}
              type="file"
              accept=".srt,.vtt,.txt,.json"
              onChange={handleTranscriptUpload}
              className="hidden"
            />
          </label>

          {uploadedVideoUrl && (
            <button
              type="button"
              onClick={handleResetToSample}
              className="px-2.5 py-1.5 rounded-lg border border-[#272727] text-xs text-[#9B9B9B] hover:text-[#FFFFFF] transition-fluid"
            >
              Reset sample
            </button>
          )}
        </div>
      </div>

      {/* Studio Navigation Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('editor')}
          className={`px-3 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-fluid ${
            activeTab === 'editor'
              ? 'bg-[#FFFFFF] text-[#000000]'
              : 'bg-[#181818] text-[#9B9B9B] hover:text-[#FFFFFF] border border-[#272727]'
          }`}
        >
          <FilmReel size={16} />
          Viral Clips ({clips.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('silence')}
          className={`px-3 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-fluid ${
            activeTab === 'silence'
              ? 'bg-[#FFFFFF] text-[#000000]'
              : 'bg-[#181818] text-[#9B9B9B] hover:text-[#FFFFFF] border border-[#272727]'
          }`}
        >
          <Waveform size={16} />
          Silence Removal ({allGaps.length} pauses detected)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('effects')}
          className={`px-3 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-fluid ${
            activeTab === 'effects'
              ? 'bg-[#FFFFFF] text-[#000000]'
              : 'bg-[#181818] text-[#9B9B9B] hover:text-[#FFFFFF] border border-[#272727]'
          }`}
        >
          <SlidersHorizontal size={16} />
          Effects, Captions & Music
        </button>
      </div>

      {/* Main Studio Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Clips List or Tab Panels */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {activeTab === 'editor' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-mono text-[#9B9B9B] uppercase">
                  Identified Viral Moments
                </span>
                <span className="text-xs font-mono text-emerald-400">
                  Target: 10 to 15 seconds
                </span>
              </div>

              {clips.map((clip) => {
                const isSelected = clip.id === selectedClip.id
                return (
                  <div
                    key={clip.id}
                    onClick={() => setSelectedClipId(clip.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-fluid text-left ${
                      isSelected
                        ? 'border-[#FFFFFF] bg-[#1F1F1F]'
                        : 'border-[#272727] bg-[#181818] hover:border-[#313131]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-[#181818] border border-[#272727] text-xs font-mono text-[#FFFFFF]">
                          {clip.duration}s
                        </span>
                        <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold font-mono">
                          <Lightning size={14} weight="fill" />
                          <span>{clip.score} Virality</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-[#9B9B9B]">
                        {clip.silencesCut} pauses cut
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-[#FFFFFF] mb-1">
                      {clip.title}
                    </h3>
                    <p className="text-xs text-[#9B9B9B] line-clamp-2 mb-3">
                      {clip.text}
                    </p>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-[#272727]">
                      <span className="text-[#9B9B9B]">
                        Speakers: {clip.speakers.join(', ')}
                      </span>
                      <span className="text-emerald-400 font-mono">
                        Saved {clip.savedSeconds}s dead air
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {activeTab === 'silence' && (
            <div className="p-6 rounded-xl border border-[#272727] bg-[#181818] flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-semibold text-[#FFFFFF] mb-1">
                  Automatic Dead Air Elimination
                </h3>
                <p className="text-xs text-[#9B9B9B]">
                  Cuts awkward pauses between speakers so dialogue flows like a snappy social media reel
                </p>
              </div>

              {/* Master Jump Cut Toggle */}
              <div className="p-4 rounded-lg bg-[#1F1F1F] border border-[#272727] flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#FFFFFF]">Enable Jump Cuts</p>
                  <p className="text-xs text-[#9B9B9B]">Skip pauses automatically during playback</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSettings((p) => ({ ...p, removeSilences: !p.removeSilences }))
                  }
                  className={`w-12 h-6 rounded-full transition-fluid p-1 flex items-center ${
                    settings.removeSilences ? 'bg-emerald-500 justify-end' : 'bg-[#313131] justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-[#FFFFFF]"></div>
                </button>
              </div>

              {/* Threshold Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="silence-slider" className="text-xs font-semibold text-[#FFFFFF]">Silence Detection Threshold</label>
                  <span className="text-xs font-mono text-[#9B9B9B]">
                    {settings.silenceCutThreshold} seconds
                  </span>
                </div>
                <input
                  id="silence-slider"
                  type="range"
                  min={0.2}
                  max={1.0}
                  step={0.1}
                  value={settings.silenceCutThreshold}
                  onChange={(e) => handleThresholdChange(parseFloat(e.target.value))}
                  className="w-full accent-[#FFFFFF] cursor-pointer"
                />
                <span className="text-[11px] text-[#9B9B9B]">
                  Lower threshold removes smaller breathing pauses; higher threshold preserves natural pacing
                </span>
              </div>

              {/* Silence stats summary */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-[#1F1F1F] border border-[#272727]">
                  <span className="text-xs text-[#9B9B9B] block mb-1">Total Dead Time</span>
                  <span className="text-xl font-bold font-mono text-[#FFFFFF]">
                    {totalDeadSeconds.toFixed(1)}s
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-[#1F1F1F] border border-[#272727]">
                  <span className="text-xs text-[#9B9B9B] block mb-1">Pauses Detected</span>
                  <span className="text-xl font-bold font-mono text-emerald-400">
                    {allGaps.length}
                  </span>
                </div>
              </div>

              {/* Visual Silence Waveform Preview */}
              <div className="flex flex-col gap-2 pt-2">
                <span className="text-xs font-mono text-[#9B9B9B] uppercase">
                  Detected Dialogue Gaps Map
                </span>
                <div className="h-10 w-full rounded-lg bg-[#131209] border border-[#272727] p-1.5 flex items-center gap-1 overflow-hidden">
                  {allGaps.slice(0, 12).map((g, idx) => (
                    <div
                      key={g.id || idx}
                      className="h-full flex-1 rounded bg-[#272727] relative group hover:bg-emerald-500 transition-fluid"
                    >
                      <div className="hidden group-hover:block absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#181818] border border-[#313131] rounded text-[10px] text-[#FFFFFF] whitespace-nowrap z-20">
                        {g.speakerBefore} to {g.speakerAfter} ({g.duration}s pause)
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'effects' && (
            <div className="p-6 rounded-xl border border-[#272727] bg-[#181818] flex flex-col gap-6">
              {/* Subtitle Style Selector */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TextT size={18} className="text-[#FFFFFF]" />
                  <h3 className="text-sm font-semibold text-[#FFFFFF]">
                    Animated Karaoke Captions
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'mrbeast', label: 'MrBeast Bold', desc: 'Punchy yellow with black stroke' },
                    { id: 'clean', label: 'Clean Minimal', desc: 'Sleek white pill box' },
                    { id: 'cyber', label: 'Cyber Glow', desc: 'Electric cyan highlight' },
                    { id: 'sunset', label: 'Sunset Gold', desc: 'Vibrant orange accent' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() =>
                        setSettings((p) => ({ ...p, subtitleStyle: st.id as EffectSettings['subtitleStyle'] }))
                      }
                      className={`p-3 rounded-lg border text-left transition-fluid ${
                        settings.subtitleStyle === st.id
                          ? 'border-[#FFFFFF] bg-[#1F1F1F]'
                          : 'border-[#272727] bg-[#131209] hover:border-[#313131]'
                      }`}
                    >
                      <span className="text-xs font-semibold text-[#FFFFFF] block mb-0.5">
                        {st.label}
                      </span>
                      <span className="text-[11px] text-[#9B9B9B]">{st.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Music Selector */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MusicNotes size={18} className="text-[#FFFFFF]" />
                  <h3 className="text-sm font-semibold text-[#FFFFFF]">
                    Royalty Free Background Music
                  </h3>
                </div>
                <div className="flex flex-col gap-2">
                  {AVAILABLE_TRACKS.map((track) => (
                    <div
                      key={track.id}
                      onClick={() =>
                        setSettings((p) => ({ ...p, musicTrack: track.id }))
                      }
                      className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-fluid ${
                        settings.musicTrack === track.id
                          ? 'border-[#FFFFFF] bg-[#1F1F1F]'
                          : 'border-[#272727] bg-[#131209] hover:border-[#313131]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[#FFFFFF]">
                            {track.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#181818] border border-[#272727] text-[#9B9B9B]">
                            {track.genre}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#9B9B9B] mt-0.5 block">
                          {track.description}
                        </span>
                      </div>
                      {settings.musicTrack === track.id && (
                        <CheckCircle size={18} className="text-emerald-400" weight="fill" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Music Volume & Ducking */}
                <div className="mt-4 p-3 rounded-lg bg-[#1F1F1F] border border-[#272727] flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label htmlFor="music-vol-slider" className="text-xs text-[#FFFFFF]">Music Volume</label>
                    <span className="text-xs font-mono text-[#9B9B9B]">
                      {Math.round(settings.musicVolume * 100)}%
                    </span>
                  </div>
                  <input
                    id="music-vol-slider"
                    type="range"
                    min={0.05}
                    max={0.8}
                    step={0.05}
                    value={settings.musicVolume}
                    onChange={(e) =>
                      setSettings((p) => ({ ...p, musicVolume: parseFloat(e.target.value) }))
                    }
                    className="w-full accent-[#FFFFFF] cursor-pointer"
                  />

                  <div className="flex items-center justify-between pt-1 border-t border-[#272727]">
                    <div>
                      <span className="text-xs font-semibold text-[#FFFFFF] block">
                        Auto Audio Ducking
                      </span>
                      <span className="text-[11px] text-[#9B9B9B]">
                        Lowers beat volume automatically when dialogue begins
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setSettings((p) => ({ ...p, audioDucking: !p.audioDucking }))
                      }
                      className={`w-10 h-5 rounded-full transition-fluid p-0.5 flex items-center ${
                        settings.audioDucking ? 'bg-emerald-500 justify-end' : 'bg-[#313131] justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-[#FFFFFF]"></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Video Enhancement Toggles */}
              <div>
                <h3 className="text-sm font-semibold text-[#FFFFFF] mb-3">
                  Engagement Video Enhancements
                </h3>
                <div className="flex flex-col gap-2">
                  {[
                    {
                      key: 'zoomPunches',
                      label: 'Dynamic Zoom Punches',
                      desc: 'Subtle punch zooms on dialogue emphasis',
                    },
                    {
                      key: 'topHookBanner',
                      label: 'Top Hook Header Banner',
                      desc: 'Displays the curiosity title at top safe zone',
                    },
                    {
                      key: 'bottomProgressBar',
                      label: 'Bottom Reel Progress Bar',
                      desc: 'Smooth horizontal bar showing clip completion',
                    },
                  ].map((enh) => (
                    <div
                      key={enh.key}
                      className="p-3 rounded-lg bg-[#1F1F1F] border border-[#272727] flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-semibold text-[#FFFFFF] block">
                          {enh.label}
                        </span>
                        <span className="text-[11px] text-[#9B9B9B]">{enh.desc}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setSettings((p) => ({
                            ...p,
                            [enh.key]: !p[enh.key as keyof EffectSettings],
                          }))
                        }
                        className={`w-10 h-5 rounded-full transition-fluid p-0.5 flex items-center ${
                          settings[enh.key as keyof EffectSettings]
                            ? 'bg-emerald-500 justify-end'
                            : 'bg-[#313131] justify-start'
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full bg-[#FFFFFF]"></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Grading Filter */}
              <div>
                <label htmlFor="color-grade-select" className="text-xs font-semibold text-[#FFFFFF] block mb-2">
                  Cinematic Color Grade
                </label>
                <select
                  id="color-grade-select"
                  value={settings.colorGrade}
                  onChange={(e) =>
                    setSettings((p) => ({
                      ...p,
                      colorGrade: e.target.value as EffectSettings['colorGrade'],
                    }))
                  }
                  className="w-full p-2.5 rounded-lg bg-[#1F1F1F] border border-[#272727] text-xs text-[#FFFFFF] focus:outline-none focus:border-[#FFFFFF]"
                >
                  <option value="none">Neutral Clean</option>
                  <option value="cinematic">Moody Teal and Slate</option>
                  <option value="vibrant">High Contrast Vibrant</option>
                  <option value="warm">Warm Film Tone</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: 9:16 Canvas Reel Player & Export */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <ReelPlayer
            clip={selectedClip}
            settings={settings}
            uploadedVideoUrl={uploadedVideoUrl}
            onSettingsChange={setSettings}
          />
        </div>
      </div>
    </section>
  )
}
