


import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import * as Tone from 'tone';
import { Piano } from './components/Piano';
import { Controls } from './components/Controls';
import { NoteDisplay } from './components/NoteDisplay';
import { WaveformDisplay } from './components/WaveformDisplay';
import { getSuggestion } from './services/musicalTheoryService';
import { createMidiFile } from './services/midiService';
import { generateOctaveKeys, noteToMidi } from './constants';
import { Genre, Quantization, Note, MusicalEvent, OscillatorType, LfoState, LfoShape, LfoTarget, MelodyPreset } from './types';
import { Knob } from './components/Knob';
import { PRESETS, getAllPresets } from './presets';
import { Lfos } from './components/Lfos';
import { LFO_SPEEDS } from './constants';
import { PresetsModal } from './components/PresetsModal';
import SEO from './components/SEO';


type PartEvent = { time: number, pitch: Note[] | null, duration: number };

const getQuantizationDuration = (q: Quantization): Tone.Unit.Time => {
    switch (q) {
        case Quantization.Sixteenth: return '16n';
        case Quantization.Eighth: return '8n';
        case Quantization.Quarter: return '4n';
        case Quantization.Whole: return '1n';
        default: return '4n';
    }
};

const App: React.FC = () => {
  const [playedNotes, setPlayedNotes] = useState<MusicalEvent[]>([]);
  const [suggestion, setSuggestion] = useState<Note[] | null>(null);
  const [genre, setGenre] = useState<Genre>(Genre.Electronic);
  const [bpm, setBpm] = useState<number>(120);
  const [quantization, setQuantization] = useState<Quantization>(Quantization.Quarter);
  const [oscillatorType, setOscillatorType] = useState<OscillatorType>(OscillatorType.Sawtooth);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [octave, setOctave] = useState<number>(3);
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [currentPresetName, setCurrentPresetName] = useState<string | null>(null);


  // Controls State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMetronomeOn, setIsMetronomeOn] = useState<boolean>(false);
  const [isAiModeOn, setIsAiModeOn] = useState<boolean>(true);
  const [isPresetsModalOpen, setIsPresetsModalOpen] = useState<boolean>(false);

  // Effects State
  const [delay, setDelay] = useState<number>(0);
  const [reverb, setReverb] = useState<number>(0);
  const [cutoffKnobValue, setCutoffKnobValue] = useState<number>(100); // Linear 0-100 for the knob
  const [resonance, setResonance] = useState<number>(0.1);
  const [unison, setUnison] = useState<number>(1);
  const [lfoStates, setLfoStates] = useState<LfoState[]>([
    { id: 0, speed: 2, shape: LfoShape.Sine, target: LfoTarget.None },
    { id: 1, speed: 2, shape: LfoShape.Sine, target: LfoTarget.None },
    { id: 2, speed: 2, shape: LfoShape.Sine, target: LfoTarget.None },
  ]);
  
  // Logarithmic conversion for cutoff frequency
  const cutoff = useMemo(() => {
    const minFreq = 100;
    const maxFreq = 20000;
    return minFreq * Math.pow(maxFreq / minFreq, cutoffKnobValue / 100);
  }, [cutoffKnobValue]);

  // Tone.js Refs
  const synthRef = useRef<Tone.PolySynth<Tone.Synth> | null>(null);
  const metronomeSynthRef = useRef<Tone.Synth | null>(null);
  const filterRef = useRef<Tone.Filter | null>(null);
  const delayRef = useRef<Tone.FeedbackDelay | null>(null);
  const reverbRef = useRef<Tone.Reverb | null>(null);
  const partRef = useRef<Tone.Part | null>(null);
  const metronomeLoopRef = useRef<Tone.Loop | null>(null);
  const lfoRefs = useRef<(Tone.LFO | null)[]>([]);
  const lfoSignalRefs = useRef<(Tone.Signal | null)[]>([]);
  
  // App Logic Refs
  const chordTimeoutRef = useRef<number | null>(null);
  const pendingNotesRef = useRef<Note[]>([]);


  const keyToNoteMap = useMemo(() => {
    const bottomKeys = generateOctaveKeys(octave, 'bottom');
    const topKeys = generateOctaveKeys(octave + 1, 'top');
    return [...bottomKeys, ...topKeys].reduce((acc, key) => {
      acc[key.keyboardKey] = key.note;
      return acc;
    }, {} as Record<string, string>);
  }, [octave]);

  const disabledKnobs = useMemo(() => {
    return new Set(lfoStates.map(lfo => lfo.target).filter(target => target !== LfoTarget.None));
  }, [lfoStates]);

  const midiRange = useMemo(() => {
    if (playedNotes.length === 0) {
        return { minMidi: 48, maxMidi: 72 }; // Default C3 to C5 view
    }

    let min = Infinity;
    let max = -Infinity;

    playedNotes.forEach(event => {
        if (event === 'REST') return;
        const notes = Array.isArray(event) ? event : [event];
        notes.forEach(note => {
            const midi = noteToMidi(note);
            if (midi < min) min = midi;
            if (midi > max) max = midi;
        });
    });

    // Add padding
    min -= 4;
    max += 4;
    
    // Enforce minimum range of 2 octaves (24 semitones)
    if (max - min < 24) {
        const center = (max + min) / 2;
        min = Math.floor(center - 12);
        max = Math.ceil(center + 12);
    }

    return { minMidi: min, maxMidi: max };
  }, [playedNotes]);


  useEffect(() => {
    const setupAudio = async () => {
        await Tone.start();
        
        const filter = new Tone.Filter(20000, "lowpass");
        filter.Q.value = 0.1;

        const delayNode = new Tone.FeedbackDelay("8n", 0);
        delayNode.wet.value = 0;

        const reverbNode = new Tone.Reverb({ decay: 1.5 });
        reverbNode.wet.value = 0;
        await reverbNode.generate();
        
        const fatOscillatorType = `fat${oscillatorType}` as const;
        const synth = new Tone.PolySynth(Tone.Synth, {
            oscillator: {
                type: fatOscillatorType,
                count: unison,
                spread: 40,
            },
            envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 1 }
        });
        
        synth.volume.value = -8;
        synth.chain(filter, delayNode, reverbNode, Tone.Destination);
        
        synthRef.current = synth;
        filterRef.current = filter;
        delayRef.current = delayNode;
        reverbRef.current = reverbNode;

        const metronomeSynth = new Tone.Synth({
          oscillator: { type: 'sine' },
          envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.1 }
        }).toDestination();
        metronomeSynth.volume.value = isMetronomeOn ? -4 : -Infinity;
        metronomeSynthRef.current = metronomeSynth;

        lfoRefs.current = lfoStates.map(lfoState => {
            const lfo = new Tone.LFO({
                frequency: LFO_SPEEDS[lfoState.speed], 
                min: 0, 
                max: 1
            }).sync().start(0);
            return lfo;
        });

        lfoSignalRefs.current = lfoRefs.current.map(lfo => {
          if (!lfo) return null;
          const signal = new Tone.Signal(0);
          lfo.connect(signal);
          return signal;
        });
    };
    
    setupAudio();

    return () => {
        synthRef.current?.dispose();
        filterRef.current?.dispose();
        delayRef.current?.dispose();
        reverbRef.current?.dispose();
        metronomeSynthRef.current?.dispose();
        lfoRefs.current.forEach(lfo => lfo?.dispose());
        lfoSignalRefs.current.forEach(signal => signal?.dispose());
        Tone.Transport.stop();
        Tone.Transport.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { 
    if (synthRef.current) {
        const fatOscillatorType = `fat${oscillatorType}` as const;
        synthRef.current.set({
            oscillator: {
                type: fatOscillatorType,
                count: unison
            }
        });
    }
  }, [oscillatorType, unison]);

  useEffect(() => {
    lfoStates.forEach((lfoState, index) => {
        const lfo = lfoRefs.current[index];
        if (!lfo) return;

        // Disconnect from all previous targets to avoid multiple modulations
        lfo.disconnect();

        // Update basic LFO properties
        lfo.frequency.value = LFO_SPEEDS[lfoState.speed];
        lfo.type = lfoState.shape;

        const targetNode = (() => {
            switch (lfoState.target) {
                case LfoTarget.Cutoff:
                    lfo.min = 200;
                    lfo.max = 8000;
                    return filterRef.current?.frequency;
                case LfoTarget.Resonance:
                    lfo.min = 0.1;
                    lfo.max = 20;
                    return filterRef.current?.Q;
                case LfoTarget.Delay:
                    lfo.min = 0;
                    lfo.max = 0.7;
                    return delayRef.current?.wet;
                case LfoTarget.Reverb:
                    lfo.min = 0;
                    lfo.max = 0.9;
                    return reverbRef.current?.wet;
                default:
                    return null;
            }
        })();

        if (targetNode) {
            lfo.connect(targetNode);
        }
    });
  }, [lfoStates]);

  useEffect(() => { Tone.Transport.bpm.value = bpm; }, [bpm]);
  useEffect(() => { if (delayRef.current && !disabledKnobs.has(LfoTarget.Delay)) delayRef.current.wet.value = delay; }, [delay, disabledKnobs]);
  useEffect(() => { if (reverbRef.current && !disabledKnobs.has(LfoTarget.Reverb)) reverbRef.current.wet.value = reverb; }, [reverb, disabledKnobs]);
  useEffect(() => { if (filterRef.current && !disabledKnobs.has(LfoTarget.Cutoff)) filterRef.current.frequency.value = cutoff; }, [cutoff, disabledKnobs]);
  useEffect(() => { if (filterRef.current && !disabledKnobs.has(LfoTarget.Resonance)) filterRef.current.Q.value = resonance; }, [resonance, disabledKnobs]);

  useEffect(() => {
    if (metronomeSynthRef.current) {
        metronomeSynthRef.current.volume.value = isMetronomeOn ? -4 : -Infinity;
    }
  }, [isMetronomeOn]);


  // LFO Animation Loop
  useEffect(() => {
    let animationFrameId: number;
    const animateKnobs = () => {
        lfoStates.forEach((lfoState, index) => {
            const signal = lfoSignalRefs.current[index];
            if (!signal || lfoState.target === LfoTarget.None) return;

            const modulatedValue = signal.value;

            switch (lfoState.target) {
                case LfoTarget.Delay:
                    setDelay(modulatedValue);
                    break;
                case LfoTarget.Reverb:
                    setReverb(modulatedValue);
                    break;
                case LfoTarget.Resonance:
                    setResonance(modulatedValue);
                    break;
                case LfoTarget.Cutoff: {
                    const minFreq = 100;
                    const maxFreq = 20000;
                    // Reverse the logarithmic scale to get the linear knob value (0-100)
                    const knobValue = 100 * (Math.log(modulatedValue / minFreq) / Math.log(maxFreq / minFreq));
                    setCutoffKnobValue(knobValue);
                    break;
                }
            }
        });
        animationFrameId = requestAnimationFrame(animateKnobs);
    };

    if (isPlaying && disabledKnobs.size > 0) {
        animationFrameId = requestAnimationFrame(animateKnobs);
    }

    return () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    };
  }, [isPlaying, disabledKnobs, lfoStates]);

  const playSound = useCallback((note: Note | Note[], duration: Tone.Unit.Time = '8n', time?: Tone.Unit.Time) => {
    if (!synthRef.current) return;
    synthRef.current.triggerAttackRelease(note, duration, time);
  }, []);
  
  const commitMusicalEvent = useCallback(() => {
    if (pendingNotesRef.current.length > 0) {
      const notesToCommit = [...pendingNotesRef.current];
      const eventToAdd: MusicalEvent = notesToCommit.length === 1 ? notesToCommit[0] : notesToCommit;
      
      setPlayedNotes(prev => [...prev, eventToAdd]);
      setSuggestion(null);
      pendingNotesRef.current = [];

      if (Array.isArray(eventToAdd)) {
        playSound(eventToAdd);
      }
    }
  }, [playSound]);

  const fetchNewSuggestion = useCallback(async (currentNotes: MusicalEvent[], currentGenre: Genre, currentBpm: number, currentQuantization: Quantization) => {
    const flatNotes = currentNotes.flat();
    if (flatNotes.length === 0) {
      setSuggestion(null);
      return;
    }
    setIsLoading(true);
    try {
      const result = await getSuggestion(currentNotes, currentGenre, currentBpm, currentQuantization, octave);
      setSuggestion(result);
    } catch (error) {
      console.error("Error fetching suggestion:", error);
      setSuggestion(null);
    } finally {
      setIsLoading(false);
    }
  }, [octave]);
  
  useEffect(() => {
    if (!isAiModeOn) {
      setSuggestion(null);
      return;
    }
    
    const handler = setTimeout(() => {
      if (isPlaying) return;
      fetchNewSuggestion(playedNotes, genre, bpm, quantization);
    }, 500);

    return () => clearTimeout(handler);
  }, [playedNotes, genre, bpm, quantization, fetchNewSuggestion, isPlaying, isAiModeOn]);

  const playNote = useCallback((note: Note) => {
    if (Tone.context.state !== 'running') {
      Tone.context.resume();
    }

    if (pendingNotesRef.current.length === 0) {
        playSound(note);
    }
    pendingNotesRef.current.push(note);

    if (chordTimeoutRef.current) clearTimeout(chordTimeoutRef.current);

    chordTimeoutRef.current = window.setTimeout(commitMusicalEvent, 50);

    setActiveKeys(prev => new Set(prev).add(note));
    setTimeout(() => {
        setActiveKeys(prev => {
            const newActiveKeys = new Set(prev);
            newActiveKeys.delete(note);
            return newActiveKeys;
        });
    }, 200);
    
  }, [playSound, commitMusicalEvent]);

  const handleBackspace = useCallback(() => {
    commitMusicalEvent();
    setPlayedNotes(prev => prev.slice(0, prev.length - 1));
    setSuggestion(null);
  }, [commitMusicalEvent]);

  const handleAddRest = useCallback(() => {
    commitMusicalEvent();
    setPlayedNotes(prev => [...prev, 'REST']);
    setSuggestion(null);
  }, [commitMusicalEvent]);

  const handleTab = useCallback(() => {
    if (suggestion && suggestion.length > 0 && isAiModeOn) {
      const eventToAdd: MusicalEvent = suggestion.length === 1 ? suggestion[0] : suggestion;
      setPlayedNotes(prev => [...prev, eventToAdd]);
      playSound(suggestion, '8n', Tone.now());
      setSuggestion(null);
    }
  }, [suggestion, playSound, isAiModeOn]);
  
  const handleClear = useCallback(() => {
    setPlayedNotes([]);
    setSuggestion(null);
    setCurrentPresetName(null);
    pendingNotesRef.current = [];
    if(isPlaying) {
        Tone.Transport.stop();
        partRef.current?.dispose();
        metronomeLoopRef.current?.dispose();
        setIsPlaying(false);
    }
  }, [isPlaying]);

  const handleExportMidi = useCallback(() => {
    if (playedNotes.length === 0) return;
    const midiDataUri = createMidiFile(playedNotes, bpm, quantization);
    const link = document.createElement('a');
    link.href = midiDataUri;
    link.download = `composition-${Date.now()}.mid`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
  }, [playedNotes, bpm, quantization]);

  const handlePlayStop = useCallback(() => {
    if (Tone.context.state !== 'running') {
        Tone.context.resume();
    }

    if (isPlaying) {
      Tone.Transport.stop();
      partRef.current?.dispose();
      metronomeLoopRef.current?.dispose();
      setIsPlaying(false);
    } else {
      if (playedNotes.length === 0) return;
      
      const duration = getQuantizationDuration(quantization);
      let currentTime = 0;
      
      const events: PartEvent[] = playedNotes.map((event) => {
        const pitch = event === 'REST' ? null : Array.isArray(event) ? event : [event];
        const time = currentTime;
        const eventDuration = Tone.Time(duration).toSeconds();
        currentTime += eventDuration;
        return { time, pitch, duration: eventDuration };
      });

      const numSteps = playedNotes.length;
      const loopSteps = Math.ceil(numSteps / 4) * 4;
      const totalDuration = loopSteps * Tone.Time(duration).toSeconds();

      partRef.current = new Tone.Part((time, value) => {
        if (value.pitch) {
            playSound(value.pitch, value.duration, time);
        }
      }, events).start(0);

      Tone.Transport.loop = true;
      Tone.Transport.loopStart = 0;
      Tone.Transport.loopEnd = totalDuration;
      
      metronomeLoopRef.current = new Tone.Loop(time => {
          metronomeSynthRef.current?.triggerAttackRelease('C6', '32n', time);
      }, '4n').start(0);

      Tone.Transport.start();
      setIsPlaying(true);
    }
  }, [isPlaying, playedNotes, quantization, playSound]);

  const handleLoadPreset = useCallback((preset: MelodyPreset) => {
    if (isPlaying) {
        Tone.Transport.stop();
        partRef.current?.dispose();
        metronomeLoopRef.current?.dispose();
        setIsPlaying(false);
    }
    setPlayedNotes(preset.sequence);
    setBpm(preset.bpm);
    setCurrentPresetName(preset.name);
    setSuggestion(null);
    pendingNotesRef.current = [];
    
  }, [isPlaying]);

  const returnFocusToApp = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handleLfoUpdate = useCallback((id: number, newConfig: Partial<LfoState>) => {
    setLfoStates(currentLfos =>
      currentLfos.map(lfo => (lfo.id === id ? { ...lfo, ...newConfig } : lfo))
    );
  }, []);

  // Load a random preset when the app first loads
  useEffect(() => {
    const allPresets = getAllPresets();
    if (allPresets.length > 0) {
      const randomIndex = Math.floor(Math.random() * allPresets.length);
      const randomPreset = allPresets[randomIndex];
      handleLoadPreset(randomPreset);
    }
  }, []); // Empty dependency array means this runs only once on mount

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return;
      
      if (event.code === 'Space') {
        event.preventDefault();
        handlePlayStop();
      } else if (event.code === 'Tab') {
        event.preventDefault();
        handleTab();
      } else if (event.code === 'Backspace' || event.code === 'ArrowLeft') {
        event.preventDefault();
        handleBackspace();
      } else if (event.code === 'ArrowRight') {
        event.preventDefault();
        handleAddRest();
      } else if (keyToNoteMap[event.key]) {
        playNote(keyToNoteMap[event.key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleTab, handleBackspace, playNote, handlePlayStop, handleAddRest, keyToNoteMap]);

  return (
    <>
      <SEO />
      <div className="min-h-screen bg-black flex flex-col items-center p-2 md:p-4 font-sans overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-20%] left-[-20%] w-[50vw] h-[50vw] bg-[radial-gradient(circle_at_center,_rgba(167,139,250,0.2)_0%,transparent_70%)]"></div>
          <div className="absolute bottom-[-20%] right-[-20%] w-[50vw] h-[50vw] bg-[radial-gradient(circle_at_center,_rgba(56,189,189,0.2)_0%,transparent_70%)]"></div>
      </div>
      
      <div className="w-full max-w-7xl mx-auto z-10 flex flex-col h-[calc(100vh-1rem)] md:h-[calc(100vh-2rem)]">
                <header className="flex-shrink-0 mb-2 md:mb-4 p-2 md:p-4 bg-black/30 rounded-lg backdrop-blur-sm border border-gray-700/50">
          {/* Title Section */}
          <div className="text-center mb-2 md:mb-4">
            <h1 className="text-xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              The Sequencer
            </h1>
            <p className="text-sm md:text-base text-gray-400 mt-1">
              Free Online MIDI Synthesizer & Piano - Create, Learn & Export Music
            </p>
          </div>
          
          {/* Controls Section */}
          <div className="flex justify-center">
            <Controls 
              genre={genre} setGenre={setGenre}
              bpm={bpm} setBpm={setBpm}
              quantization={quantization} setQuantization={setQuantization}
              oscillatorType={oscillatorType} setOscillatorType={setOscillatorType}
              onExportMidi={handleExportMidi} isExportDisabled={playedNotes.length === 0 || isPlaying}
              isPlaying={isPlaying} onPlayStop={handlePlayStop}
              isMetronomeOn={isMetronomeOn} setIsMetronomeOn={setIsMetronomeOn}
              isAiModeOn={isAiModeOn} setIsAiModeOn={setIsAiModeOn}
              onLoadPreset={handleLoadPreset}
              onInteractionEnd={returnFocusToApp}
              onOpenPresetsModal={() => setIsPresetsModalOpen(true)}
            />
          </div>
        </header>

        <main className="flex-grow flex flex-col p-2 md:p-4 bg-black/30 rounded-lg backdrop-blur-sm border border-gray-700/50 min-h-0 gap-y-2 overflow-y-auto">
          {/* Effects and Waveform Section */}
          <div className="flex-shrink-0 flex flex-col md:flex-row items-stretch gap-y-2 md:gap-y-0 md:gap-x-2 h-auto md:h-36">
              <div className="p-1 rounded-lg bg-gray-900/40 border border-gray-700/50">
                  <div className="flex items-end gap-x-1 md:gap-x-2 flex-wrap">
                      <Knob label="Delay" value={delay} onChange={setDelay} min={0} max={1} onInteractionEnd={returnFocusToApp} disabled={disabledKnobs.has(LfoTarget.Delay)} />
                      <Knob label="Reverb" value={reverb} onChange={setReverb} min={0} max={1} onInteractionEnd={returnFocusToApp} disabled={disabledKnobs.has(LfoTarget.Reverb)} />
                      <Knob 
                        label="Cutoff" 
                        value={cutoffKnobValue} 
                        onChange={setCutoffKnobValue} 
                        min={0} 
                        max={100}
                        displayValue={cutoff.toFixed(0)}
                        onInteractionEnd={returnFocusToApp}
                        disabled={disabledKnobs.has(LfoTarget.Cutoff)}
                      />
                      <Knob label="Resonance" value={resonance} onChange={setResonance} min={0.1} max={20} onInteractionEnd={returnFocusToApp} disabled={disabledKnobs.has(LfoTarget.Resonance)} />
                      <Knob label="Unison" value={unison} onChange={setUnison} min={1} max={6} step={1} onInteractionEnd={returnFocusToApp} />
                  </div>
              </div>

              <div className="flex-grow p-2 rounded-lg bg-gray-900/40 border border-gray-700/50 min-h-[120px] md:min-h-0">
                  <WaveformDisplay isPlaying={isPlaying} oscillatorType={oscillatorType} />
              </div>
          </div>
          
          {/* Note Display Section (flexible height) 
          minimum height is 100px
          */}
          <div className="flex-grow min-h-[120px] md:min-h-[160px] p-0">
            <NoteDisplay 
              playedNotes={playedNotes} 
              suggestion={suggestion} 
              isLoading={isLoading}
              onClear={handleClear}
              onAddRest={handleAddRest}
              onDeleteLast={handleBackspace}
              isPlaying={isPlaying}
              isAiModeOn={isAiModeOn}
              quantization={quantization}
              minMidi={midiRange.minMidi}
              maxMidi={midiRange.maxMidi}
              currentPresetName={currentPresetName}
            />
          </div>
          
          <div className="flex-shrink-0 flex flex-col md:flex-row items-start gap-y-2 md:gap-y-0 md:gap-x-4">
            <div className="flex-grow w-full md:w-auto">
              <Piano 
                onNotePlay={playNote}
                activeKeys={activeKeys}
                suggestion={isAiModeOn ? suggestion : null}
                octave={octave}
                onOctaveChange={setOctave}
              />
            </div>
            <div className="w-full md:w-auto">
              <Lfos lfos={lfoStates} onUpdate={handleLfoUpdate} onInteractionEnd={returnFocusToApp} />
            </div>
          </div>
        </main>

        <footer className="flex-shrink-0 text-center text-gray-500 pt-2 md:pt-4 text-xs md:text-sm">
          <p className="hidden md:block">Use your keyboard to play. <kbd className="px-2 py-1 text-xs font-semibold text-gray-200 bg-gray-700 border border-gray-600 rounded-md">Tab</kbd> to accept suggestion. <kbd className="px-2 py-1 text-xs font-semibold text-gray-200 bg-gray-700 border border-gray-600 rounded-md">←</kbd>/<kbd className="px-2 py-1 text-xs font-semibold text-gray-200 bg-gray-700 border border-gray-600 rounded-md">Backspace</kbd> to delete. <kbd className="px-2 py-1 text-xs font-semibold text-gray-200 bg-gray-700 border border-gray-600 rounded-md">→</kbd> to add rest. <kbd className="px-2 py-1 text-xs font-semibold text-gray-200 bg-gray-700 border border-gray-600 rounded-md">Space</kbd> to Play/Stop.</p>
          <p className="md:hidden">Tap piano keys to play • <kbd className="px-1 py-0.5 text-xs font-semibold text-gray-200 bg-gray-700 border border-gray-600 rounded">Tab</kbd> accept • <kbd className="px-1 py-0.5 text-xs font-semibold text-gray-200 bg-gray-700 border border-gray-600 rounded">←</kbd> delete • <kbd className="px-1 py-0.5 text-xs font-semibold text-gray-200 bg-gray-700 border border-gray-600 rounded">Space</kbd> play/stop</p>
        </footer>
      </div>

      <PresetsModal
        isOpen={isPresetsModalOpen}
        onClose={() => setIsPresetsModalOpen(false)}
        onLoadPreset={handleLoadPreset}
        currentGenre={genre}
      />
    </div>
    </>
  );
};

export default App;