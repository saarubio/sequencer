# The Sequencer - Free Online MIDI Synthesizer & Piano

A powerful, free online MIDI synthesizer and piano application that allows you to create music, learn notes, and export your compositions as MIDI files. Perfect for music production, learning, and composition.

## 🎹 Features

### Core Functionality
- **Virtual Piano**: Full-featured piano keyboard with multiple octaves
- **MIDI Synthesizer**: Real-time audio synthesis with multiple oscillator types
- **Music Learning**: Built-in note learning and music theory assistance
- **MIDI Export**: Export your compositions as downloadable MIDI files
- **Real-time Audio**: Low-latency audio processing using Web Audio API

### Advanced Features
- **Multiple Oscillators**: Sawtooth, sine, square, and triangle wave options
- **Effects Processing**: Reverb, delay, filter, and resonance controls
- **LFO Modulation**: Low-frequency oscillators for dynamic sound shaping
- **Tempo Control**: Adjustable BPM with metronome functionality
- **Quantization**: Precise timing controls for professional results
- **Preset Melodies**: Pre-built patterns and melodies to get started
- **AI Assistance**: Intelligent music theory suggestions and chord progressions

### Music Learning Tools
- **Note Display**: Real-time note name and frequency display
- **Scale Learning**: Built-in scale patterns and theory
- **Chord Recognition**: Automatic chord detection and suggestions
- **Rhythm Training**: Metronome and quantization for timing practice

## 🚀 Getting Started

### Prerequisites
- Modern web browser with Web Audio API support
- Node.js (for development)

### Installation & Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/saarkohanovitch/the-sequencer.git
   cd the-sequencer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## 🎵 How to Use

### Basic Piano Playing
1. Use your computer keyboard to play notes
2. Adjust octave range using the octave controls
3. View note names and frequencies in real-time

### Creating Music
1. Select your preferred oscillator type
2. Adjust effects parameters (reverb, delay, filter)
3. Set your desired tempo and quantization
4. Record your performance
5. Export as MIDI file

### Learning Music Theory
1. Enable AI mode for music theory suggestions
2. Use preset melodies to learn patterns
3. Practice with the metronome for timing
4. Explore different scales and chord progressions

## 🛠️ Technology Stack

- **Frontend**: React 19 with TypeScript
- **Audio Engine**: Tone.js for Web Audio API
- **MIDI Processing**: midi-writer-js for file export
- **AI Integration**: Google Gemini API for music theory
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

## 📁 Project Structure

```
the-sequencer/
├── components/          # React components
│   ├── Piano.tsx       # Virtual piano keyboard
│   ├── Controls.tsx    # Main control panel
│   ├── NoteDisplay.tsx # Note information display
│   ├── WaveformDisplay.tsx # Audio waveform visualization
│   ├── Lfos.tsx        # LFO controls
│   ├── Knob.tsx        # Reusable knob component
│   └── PresetsModal.tsx # Preset selection modal
├── services/           # Business logic services
│   ├── midiService.ts  # MIDI file generation
│   └── musicalTheoryService.ts # Music theory AI
├── types.ts           # TypeScript type definitions
├── constants.ts       # Application constants
├── presets.ts         # Preset melodies and patterns
└── App.tsx           # Main application component
```

## 🎯 SEO Optimized

This application is fully optimized for search engines with:
- Comprehensive meta tags and structured data
- Open Graph and Twitter Card support
- XML sitemap and robots.txt
- Semantic HTML structure
- Fast loading times with Vite
- Mobile-responsive design

## 🌐 Live Demo

Visit [https://playmidi.live](https://playmidi.live) to try the application online.

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, please open an issue on GitHub or contact us through the application.

---

**The Sequencer** - Making music creation accessible to everyone, anywhere, anytime.
