// Web Audio API background music synthesizer
// Provides 100% royalty free ambient tracks that can be mixed in browser

class AudioEngine {
  private ctx: AudioContext | null = null
  private gainNode: GainNode | null = null
  private isPlaying: boolean = false
  private currentTrackId: string = 'lofi'
  private masterVolume: number = 0.3
  private timerId: number | null = null
  private currentStep: number = 0

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioContextClass()
      this.gainNode = this.ctx.createGain()
      this.gainNode.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime)
      this.gainNode.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  public getAudioContext(): AudioContext {
    this.initContext()
    return this.ctx!
  }

  public getGainNode(): GainNode {
    this.initContext()
    return this.gainNode!
  }

  public playTrack(trackId: string, volume: number = 0.3) {
    this.initContext()
    if (!this.ctx || !this.gainNode) return

    this.stop()
    this.currentTrackId = trackId
    this.masterVolume = volume
    this.gainNode.gain.cancelScheduledValues(this.ctx.currentTime)
    this.gainNode.gain.setValueAtTime(volume, this.ctx.currentTime)
    this.isPlaying = true
    this.currentStep = 0

    const stepInterval = trackId === 'lofi' ? 400 : trackId === 'synth' ? 240 : trackId === 'trap' ? 220 : 600

    this.timerId = window.setInterval(() => {
      this.scheduleStep()
    }, stepInterval)
  }

  private scheduleStep() {
    if (!this.ctx || !this.gainNode || !this.isPlaying) return

    const now = this.ctx.currentTime
    const step = this.currentStep % 16

    if (this.currentTrackId === 'lofi') {
      // Warm Rhodes chord notes
      const chords = [
        [261.63, 329.63, 392.0, 493.88], // Cmaj7
        [220.0, 261.63, 329.63, 392.0],  // Am7
        [174.61, 220.0, 261.63, 329.63], // Fmaj7
        [196.0, 246.94, 293.66, 349.23], // G7
      ]
      const chordIndex = Math.floor(this.currentStep / 4) % chords.length
      if (step % 4 === 0) {
        const chord = chords[chordIndex]
        chord.forEach((freq) => {
          this.playTone(freq, 0.8, 'sine', 0.08, now)
        })
      }
      // Gentle kick on 0 and 8, soft snare on 4 and 12
      if (step === 0 || step === 8) {
        this.playDrum(65, 0.25, now)
      } else if (step === 4 || step === 12) {
        this.playSnare(now)
      }
    } else if (this.currentTrackId === 'synth') {
      // Arpeggiated bass notes
      const notes = [130.81, 164.81, 196.0, 246.94, 261.63, 196.0, 164.81, 146.83]
      const noteFreq = notes[step % notes.length]
      this.playTone(noteFreq, 0.18, 'sawtooth', 0.06, now)

      if (step % 4 === 0) {
        this.playDrum(80, 0.2, now)
      }
      if (step === 4 || step === 12) {
        this.playSnare(now)
      }
    } else if (this.currentTrackId === 'ambient') {
      if (step % 8 === 0) {
        const drones = [174.61, 220.0, 261.63, 329.63]
        const freq = drones[Math.floor(this.currentStep / 8) % drones.length]
        this.playTone(freq, 2.0, 'sine', 0.09, now)
        this.playTone(freq * 1.5, 1.8, 'triangle', 0.04, now + 0.1)
      }
    } else if (this.currentTrackId === 'trap') {
      if (step === 0 || step === 6 || step === 10) {
        this.playDrum(55, 0.35, now)
      }
      if (step === 4 || step === 12) {
        this.playSnare(now)
      }
      // Hi-hat tick
      this.playHiHat(now)
    }

    this.currentStep++
  }

  private playTone(freq: number, duration: number, type: OscillatorType, gainAmt: number, time: number) {
    if (!this.ctx || !this.gainNode) return
    const osc = this.ctx.createOscillator()
    const toneGain = this.ctx.createGain()

    osc.type = type
    osc.frequency.setValueAtTime(freq, time)

    toneGain.gain.setValueAtTime(0.001, time)
    toneGain.gain.exponentialRampToValueAtTime(gainAmt, time + 0.03)
    toneGain.gain.exponentialRampToValueAtTime(0.0001, time + duration)

    osc.connect(toneGain)
    toneGain.connect(this.gainNode)

    osc.start(time)
    osc.stop(time + duration + 0.05)
  }

  private playDrum(startFreq: number, duration: number, time: number) {
    if (!this.ctx || !this.gainNode) return
    const osc = this.ctx.createOscillator()
    const drumGain = this.ctx.createGain()

    osc.frequency.setValueAtTime(startFreq, time)
    osc.frequency.exponentialRampToValueAtTime(25, time + duration)

    drumGain.gain.setValueAtTime(0.3, time)
    drumGain.gain.exponentialRampToValueAtTime(0.001, time + duration)

    osc.connect(drumGain)
    drumGain.connect(this.gainNode)

    osc.start(time)
    osc.stop(time + duration)
  }

  private playSnare(time: number) {
    if (!this.ctx || !this.gainNode) return
    const osc = this.ctx.createOscillator()
    const sGain = this.ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(140, time)

    sGain.gain.setValueAtTime(0.12, time)
    sGain.gain.exponentialRampToValueAtTime(0.001, time + 0.12)

    osc.connect(sGain)
    sGain.connect(this.gainNode)

    osc.start(time)
    osc.stop(time + 0.15)
  }

  private playHiHat(time: number) {
    if (!this.ctx || !this.gainNode) return
    const osc = this.ctx.createOscillator()
    const hGain = this.ctx.createGain()

    osc.type = 'highpass' as unknown as OscillatorType // fallback
    osc.frequency.setValueAtTime(8000, time)

    hGain.gain.setValueAtTime(0.05, time)
    hGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.05)

    osc.connect(hGain)
    hGain.connect(this.gainNode)

    osc.start(time)
    osc.stop(time + 0.06)
  }

  public setVolume(vol: number) {
    this.masterVolume = vol
    if (this.ctx && this.gainNode) {
      this.gainNode.gain.cancelScheduledValues(this.ctx.currentTime)
      this.gainNode.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.05)
    }
  }

  public setDucking(isSpeaking: boolean) {
    if (!this.ctx || !this.gainNode) return
    const targetVol = isSpeaking ? this.masterVolume * 0.25 : this.masterVolume
    this.gainNode.gain.setTargetAtTime(targetVol, this.ctx.currentTime, 0.08)
  }

  public stop() {
    if (this.timerId !== null) {
      clearInterval(this.timerId)
      this.timerId = null
    }
    this.isPlaying = false
  }
}

export const backgroundAudioEngine = new AudioEngine()

export const AVAILABLE_TRACKS = [
  {
    id: 'lofi',
    name: 'Midnight Chill Beats',
    genre: 'Lo-Fi Chill',
    bpm: 85,
    description: 'Warm chords with subtle vinyl warmth, ideal for conversational podcasts',
  },
  {
    id: 'synth',
    name: 'Neon Cyber Pulse',
    genre: 'Synthwave',
    bpm: 120,
    description: 'Dynamic retro arpeggios that build excitement and curiosity',
  },
  {
    id: 'ambient',
    name: 'Deep Resonance',
    genre: 'Ambient Focus',
    bpm: 60,
    description: 'Subtle atmospheric textures that keep dialogue front and center',
  },
  {
    id: 'trap',
    name: 'Social Bounce Beat',
    genre: 'Modern Trap',
    bpm: 130,
    description: 'Punchy 808 rhythm tailored for high tempo TikTok and Reels',
  },
]
