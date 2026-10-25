# LowClips

> Turn long recordings into viral vertical reels with zero dead air, word-level animated karaoke captions, and royalty-free background beats.

LowClips takes long-form recordings (20-minute podcasts, interviews, lectures, or talk shows), removes dead space and pauses between dialogue turns, extracts 5–10 high-retention 10–15 second clips, and renders them into 9:16 vertical shorts ready for Instagram Reels, YouTube Shorts, and TikTok.

---

## Features

- **Automated Silence Removal & Jump Cuts**: Measures dead air between speakers and pauses in speech. Automatically skips silence during playback and export so dialogue flows snappily.
- **Viral Moment Segmenter**: Discovers 5–10 punchy 10–15s clips with calculated Virality Scores and curiosity hooks.
- **Animated Karaoke Subtitles**: Word-by-word synchronized highlighting with 4 aesthetic presets:
  - *MrBeast Bold* (high contrast yellow with dark outline)
  - *Clean Minimal* (translucent dark pill with white text)
  - *Cyber Glow* (electric cyan neon highlight)
  - *Sunset Gold* (warm gold accent)
- **Royalty-Free Synthesized Background Music**:
  - In-browser Web Audio synthesis (Lo-Fi Chill, Synthwave Pulse, Ambient Resonance, Trap Bounce).
  - **Auto-Ducking**: Automatically drops music volume whenever a speaker talks so speech punches through clearly.
- **Visual Engagement Effects**:
  - Dynamic punch zoom on dialogue emphasis
  - Top curiosity hook banner
  - Bottom progress bar
  - Cinematic color grading (Teal & Slate, High Contrast Vibrant, Warm Film)
- **Direct 9:16 In-Browser Export**:
  - Exports `.webm`/`.mp4` clips locally via the MediaRecorder API.

---

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 with custom fluid bezier transitions
- **Typography**: Manrope (Body & Headings) + Geist Mono (Data, Numbers & Timestamps)
- **Icons**: Phosphor Icons (`@phosphor-icons/react`)
- **Audio Engine**: Web Audio API background music synthesizer & ducking processor

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/priyanktyagi14/lowclips.git
cd lowclips

# Install dependencies
npm install

# Start the local development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Building for Production

```bash
npm run build
```

---

## License

MIT
