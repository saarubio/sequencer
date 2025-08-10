import { Note, Genre, Quantization, MusicalEvent } from '../types';
import { noteToMidi, NOTE_MAP } from '../constants';

// Musical Theory Database
export interface Scale {
  name: string;
  intervals: number[]; // Semitone intervals from root
  notes: string[]; // Note names in the scale
}

export interface Chord {
  name: string;
  intervals: number[]; // Semitone intervals from root
  notes: string[]; // Note names in the chord
  type: 'major' | 'minor' | 'diminished' | 'augmented' | 'dominant' | 'suspended' | 'power';
}

export interface GenreTheory {
  scales: Scale[];
  chords: Chord[];
  commonProgressions: string[][]; // Chord progressions as note names
  melodicPatterns: number[][]; // Common melodic intervals
  rhythmPatterns: number[]; // Common rhythmic emphasis points
  tempoRange: { min: number; max: number };
  quantizationPreferences: Quantization[];
  classicExamples: MusicalEvent[][]; // Classic sheet music examples
}

// Base scales and chords
const MAJOR_SCALE: Scale = {
  name: 'Major',
  intervals: [0, 2, 4, 5, 7, 9, 11],
  notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B']
};

const MINOR_SCALE: Scale = {
  name: 'Minor',
  intervals: [0, 2, 3, 5, 7, 8, 10],
  notes: ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb']
};

const PENTATONIC_MAJOR: Scale = {
  name: 'Pentatonic Major',
  intervals: [0, 2, 4, 7, 9],
  notes: ['C', 'D', 'E', 'G', 'A']
};

const PENTATONIC_MINOR: Scale = {
  name: 'Pentatonic Minor',
  intervals: [0, 3, 5, 7, 10],
  notes: ['C', 'Eb', 'F', 'G', 'Bb']
};

const BLUES_SCALE: Scale = {
  name: 'Blues',
  intervals: [0, 3, 5, 6, 7, 10],
  notes: ['C', 'Eb', 'F', 'F#', 'G', 'Bb']
};

const DORIAN_SCALE: Scale = {
  name: 'Dorian',
  intervals: [0, 2, 3, 5, 7, 9, 10],
  notes: ['C', 'D', 'Eb', 'F', 'G', 'A', 'Bb']
};

const MIXOLYDIAN_SCALE: Scale = {
  name: 'Mixolydian',
  intervals: [0, 2, 4, 5, 7, 9, 10],
  notes: ['C', 'D', 'E', 'F', 'G', 'A', 'Bb']
};

const PHRYGIAN_SCALE: Scale = {
  name: 'Phrygian',
  intervals: [0, 1, 3, 5, 7, 8, 10],
  notes: ['C', 'Db', 'Eb', 'F', 'G', 'Ab', 'Bb']
};

const LYDIAN_SCALE: Scale = {
  name: 'Lydian',
  intervals: [0, 2, 4, 6, 7, 9, 11],
  notes: ['C', 'D', 'E', 'F#', 'G', 'A', 'B']
};

const LOCRIAN_SCALE: Scale = {
  name: 'Locrian',
  intervals: [0, 1, 3, 5, 6, 8, 10],
  notes: ['C', 'Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb']
};

// Base chords
const MAJOR_CHORD: Chord = {
  name: 'Major',
  intervals: [0, 4, 7],
  notes: ['C', 'E', 'G'],
  type: 'major'
};

const MINOR_CHORD: Chord = {
  name: 'Minor',
  intervals: [0, 3, 7],
  notes: ['C', 'Eb', 'G'],
  type: 'minor'
};

const DIMINISHED_CHORD: Chord = {
  name: 'Diminished',
  intervals: [0, 3, 6],
  notes: ['C', 'Eb', 'Gb'],
  type: 'diminished'
};

const AUGMENTED_CHORD: Chord = {
  name: 'Augmented',
  intervals: [0, 4, 8],
  notes: ['C', 'E', 'G#'],
  type: 'augmented'
};

const DOMINANT_7TH: Chord = {
  name: 'Dominant 7th',
  intervals: [0, 4, 7, 10],
  notes: ['C', 'E', 'G', 'Bb'],
  type: 'dominant'
};

const MAJOR_7TH: Chord = {
  name: 'Major 7th',
  intervals: [0, 4, 7, 11],
  notes: ['C', 'E', 'G', 'B'],
  type: 'major'
};

const MINOR_7TH: Chord = {
  name: 'Minor 7th',
  intervals: [0, 3, 7, 10],
  notes: ['C', 'Eb', 'G', 'Bb'],
  type: 'minor'
};

const SUSPENDED_2ND: Chord = {
  name: 'Suspended 2nd',
  intervals: [0, 2, 7],
  notes: ['C', 'D', 'G'],
  type: 'suspended'
};

const SUSPENDED_4TH: Chord = {
  name: 'Suspended 4th',
  intervals: [0, 5, 7],
  notes: ['C', 'F', 'G'],
  type: 'suspended'
};

const POWER_CHORD: Chord = {
  name: 'Power Chord',
  intervals: [0, 7],
  notes: ['C', 'G'],
  type: 'power'
};

// Classic sheet music examples for each genre
const POP_EXAMPLES: MusicalEvent[][] = [
  // "Let It Be" - Beatles style
  [['C4'], ['G4'], ['Am4'], ['F4'], ['C4'], ['G4'], ['F4'], ['C4']],
  // "Wonderwall" - Oasis style
  [['C4'], ['G4'], ['Am4'], ['F4'], ['C4'], ['G4'], ['Am4'], ['F4']],
  // "Someone Like You" - Adele style
  [['C4'], ['G4'], ['Am4'], ['F4'], ['C4'], ['G4'], ['F4'], ['C4']],
  // "All of Me" - John Legend style
  [['C4'], ['G4'], ['Am4'], ['F4'], ['C4'], ['G4'], ['Am4'], ['F4']],
  // "Perfect" - Ed Sheeran style
  [['C4'], ['G4'], ['Am4'], ['F4'], ['C4'], ['G4'], ['F4'], ['C4']]
];

const JAZZ_EXAMPLES: MusicalEvent[][] = [
  // "Autumn Leaves" - Jazz standard
  [['Am4'], ['Dm4'], ['G4'], ['C4'], ['F4'], ['B4'], ['E4'], ['Am4']],
  // "Take Five" - Dave Brubeck style
  [['Ebm4'], ['Bbm4'], ['Ab4'], ['Db4'], ['Ebm4'], ['Bbm4'], ['Ab4'], ['Db4']],
  // "So What" - Miles Davis style
  [['Dm4'], ['Dm4'], ['Ebm4'], ['Ebm4'], ['Dm4'], ['Dm4'], ['Ebm4'], ['Ebm4']],
  // "Blue Bossa" - Jazz bossa
  [['Cm4'], ['Fm4'], ['Dm4'], ['G4'], ['Cm4'], ['Fm4'], ['Dm4'], ['G4']],
  // "Giant Steps" - John Coltrane style
  [['B4'], ['D4'], ['G4'], ['B4'], ['D4'], ['G4'], ['B4'], ['D4']]
];

const CLASSICAL_EXAMPLES: MusicalEvent[][] = [
  // "Für Elise" - Beethoven style
  [['E4'], ['D#4'], ['E4'], ['D#4'], ['E4'], ['B3'], ['D4'], ['C4']],
  // "Moonlight Sonata" - Beethoven style
  [['C#4'], ['G#3'], ['C#4'], ['G#3'], ['C#4'], ['G#3'], ['C#4'], ['G#3']],
  // "Prelude in C" - Bach style
  [['C4'], ['E4'], ['G4'], ['C5'], ['E5'], ['G4'], ['C5'], ['E5']],
  // "Clair de Lune" - Debussy style
  [['D#4'], ['F#4'], ['A4'], ['D#5'], ['F#5'], ['A4'], ['D#5'], ['F#5']],
  // "Canon in D" - Pachelbel style
  [['D4'], ['A3'], ['B3'], ['F#3'], ['G3'], ['D3'], ['G3'], ['A3']]
];

const ROCK_EXAMPLES: MusicalEvent[][] = [
  // "Stairway to Heaven" - Led Zeppelin style
  [['Am4'], ['Am4'], ['G4'], ['G4'], ['F4'], ['F4'], ['C4'], ['C4']],
  // "Sweet Child O' Mine" - Guns N' Roses style
  [['D4'], ['A4'], ['B4'], ['F#4'], ['G4'], ['D4'], ['A4'], ['B4']],
  // "Nothing Else Matters" - Metallica style
  [['Em4'], ['Em4'], ['D4'], ['D4'], ['C4'], ['C4'], ['G4'], ['G4']],
  // "Hotel California" - Eagles style
  [['Am4'], ['E4'], ['G4'], ['D4'], ['F4'], ['C4'], ['E4'], ['Am4']],
  // "Bohemian Rhapsody" - Queen style
  [['Bb4'], ['F4'], ['G4'], ['Eb4'], ['F4'], ['Bb4'], ['F4'], ['G4']]
];

const ELECTRONIC_EXAMPLES: MusicalEvent[][] = [
  // "Sandstorm" - Darude style
  [['C4'], ['C4'], ['G4'], ['G4'], ['Am4'], ['Am4'], ['F4'], ['F4']],
  // "Levels" - Avicii style
  [['F4'], ['F4'], ['C4'], ['C4'], ['G4'], ['G4'], ['Am4'], ['Am4']],
  // "Animals" - Martin Garrix style
  [['C4'], ['C4'], ['G4'], ['G4'], ['Am4'], ['Am4'], ['F4'], ['F4']],
  // "Titanium" - David Guetta style
  [['C4'], ['G4'], ['Am4'], ['F4'], ['C4'], ['G4'], ['Am4'], ['F4']],
  // "Wake Me Up" - Avicii style
  [['C4'], ['G4'], ['Am4'], ['F4'], ['C4'], ['G4'], ['Am4'], ['F4']]
];

const BLUES_EXAMPLES: MusicalEvent[][] = [
  // "Hoochie Coochie Man" - Muddy Waters style
  [['C4'], ['F4'], ['C4'], ['G4'], ['F4'], ['C4'], ['G4'], ['C4']],
  // "Sweet Home Chicago" - Blues standard
  [['C4'], ['F4'], ['C4'], ['G4'], ['F4'], ['C4'], ['G4'], ['C4']],
  // "The Thrill is Gone" - B.B. King style
  [['Am4'], ['Dm4'], ['G4'], ['C4'], ['F4'], ['B4'], ['E4'], ['Am4']],
  // "Red House" - Jimi Hendrix style
  [['A4'], ['A4'], ['D4'], ['D4'], ['A4'], ['A4'], ['E4'], ['E4']],
  // "Born Under a Bad Sign" - Albert King style
  [['C4'], ['F4'], ['C4'], ['G4'], ['F4'], ['C4'], ['G4'], ['C4']]
];

// Genre-specific theory data
export const GENRE_THEORY: Record<Genre, GenreTheory> = {
  [Genre.Pop]: {
    scales: [MAJOR_SCALE, MINOR_SCALE, PENTATONIC_MAJOR, PENTATONIC_MINOR],
    chords: [MAJOR_CHORD, MINOR_CHORD, DOMINANT_7TH, MAJOR_7TH, MINOR_7TH, SUSPENDED_2ND, SUSPENDED_4TH],
    commonProgressions: [
      ['C', 'G', 'Am', 'F'], // I-V-vi-IV
      ['Am', 'F', 'C', 'G'], // vi-IV-I-V
      ['C', 'Am', 'F', 'G'], // I-vi-IV-V
      ['F', 'C', 'G', 'Am'], // IV-I-V-vi
    ],
    melodicPatterns: [[0, 2, 4], [0, -2, -4], [0, 7, 0], [0, 5, 7]],
    rhythmPatterns: [0, 2, 4, 6], // Emphasize beats 1 and 3
    tempoRange: { min: 80, max: 140 },
    quantizationPreferences: [Quantization.Quarter, Quantization.Eighth],
    classicExamples: POP_EXAMPLES
  },
  
  [Genre.Jazz]: {
    scales: [MAJOR_SCALE, MINOR_SCALE, DORIAN_SCALE, MIXOLYDIAN_SCALE, PHRYGIAN_SCALE, LYDIAN_SCALE, LOCRIAN_SCALE, BLUES_SCALE],
    chords: [MAJOR_CHORD, MINOR_CHORD, DIMINISHED_CHORD, AUGMENTED_CHORD, DOMINANT_7TH, MAJOR_7TH, MINOR_7TH],
    commonProgressions: [
      ['C', 'Am', 'Dm', 'G'], // I-vi-ii-V
      ['Dm', 'G', 'C', 'F'], // ii-V-I-IV
      ['C', 'F', 'Dm', 'G'], // I-IV-ii-V
      ['Am', 'Dm', 'G', 'C'], // vi-ii-V-I
    ],
    melodicPatterns: [[0, 2, 4, 7], [0, -2, -4, -7], [0, 4, 7, 11], [0, 3, 7, 10]],
    rhythmPatterns: [0, 1, 2, 3, 4, 5, 6, 7], // Complex syncopation
    tempoRange: { min: 60, max: 200 },
    quantizationPreferences: [Quantization.Eighth, Quantization.Sixteenth],
    classicExamples: JAZZ_EXAMPLES
  },
  
  [Genre.Classical]: {
    scales: [MAJOR_SCALE, MINOR_SCALE, DORIAN_SCALE, MIXOLYDIAN_SCALE, PHRYGIAN_SCALE, LYDIAN_SCALE, LOCRIAN_SCALE],
    chords: [MAJOR_CHORD, MINOR_CHORD, DIMINISHED_CHORD, AUGMENTED_CHORD, DOMINANT_7TH, MAJOR_7TH, MINOR_7TH],
    commonProgressions: [
      ['C', 'F', 'G', 'C'], // I-IV-V-I
      ['C', 'Am', 'F', 'G'], // I-vi-IV-V
      ['Am', 'Dm', 'G', 'C'], // vi-ii-V-I
      ['C', 'G', 'Am', 'F'], // I-V-vi-IV
    ],
    melodicPatterns: [[0, 2, 4, 5], [0, -2, -4, -5], [0, 4, 7, 0], [0, 5, 7, 0]],
    rhythmPatterns: [0, 2, 4, 6], // Traditional emphasis
    tempoRange: { min: 40, max: 180 },
    quantizationPreferences: [Quantization.Quarter, Quantization.Eighth, Quantization.Whole],
    classicExamples: CLASSICAL_EXAMPLES
  },
  
  [Genre.Rock]: {
    scales: [MAJOR_SCALE, MINOR_SCALE, PENTATONIC_MAJOR, PENTATONIC_MINOR, BLUES_SCALE],
    chords: [MAJOR_CHORD, MINOR_CHORD, POWER_CHORD, DOMINANT_7TH, SUSPENDED_2ND, SUSPENDED_4TH],
    commonProgressions: [
      ['C', 'G', 'Am', 'F'], // I-V-vi-IV
      ['Am', 'F', 'C', 'G'], // vi-IV-I-V
      ['C', 'Am', 'F', 'G'], // I-vi-IV-V
      ['E', 'B', 'C#m', 'A'], // Rock progression
    ],
    melodicPatterns: [[0, 7, 0], [0, 5, 7], [0, -5, -7], [0, 12, 0]],
    rhythmPatterns: [0, 2, 4, 6], // Strong beats
    tempoRange: { min: 80, max: 160 },
    quantizationPreferences: [Quantization.Quarter, Quantization.Eighth],
    classicExamples: ROCK_EXAMPLES
  },
  
  [Genre.Electronic]: {
    scales: [MAJOR_SCALE, MINOR_SCALE, PENTATONIC_MAJOR, PENTATONIC_MINOR, DORIAN_SCALE, MIXOLYDIAN_SCALE],
    chords: [MAJOR_CHORD, MINOR_CHORD, DOMINANT_7TH, MAJOR_7TH, MINOR_7TH, SUSPENDED_2ND, SUSPENDED_4TH],
    commonProgressions: [
      ['C', 'Am', 'F', 'G'], // I-vi-IV-V
      ['Am', 'F', 'C', 'G'], // vi-IV-I-V
      ['C', 'G', 'Am', 'F'], // I-V-vi-IV
      ['F', 'C', 'G', 'Am'], // IV-I-V-vi
    ],
    melodicPatterns: [[0, 4, 7], [0, 7, 12], [0, 5, 9], [0, -4, -7]],
    rhythmPatterns: [0, 2, 4, 6, 8, 10, 12, 14], // Electronic grid
    tempoRange: { min: 120, max: 140 },
    quantizationPreferences: [Quantization.Sixteenth, Quantization.Eighth],
    classicExamples: ELECTRONIC_EXAMPLES
  },
  
  [Genre.Blues]: {
    scales: [BLUES_SCALE, PENTATONIC_MINOR, MINOR_SCALE],
    chords: [MAJOR_CHORD, MINOR_CHORD, DOMINANT_7TH, POWER_CHORD],
    commonProgressions: [
      ['C', 'F', 'G', 'C'], // I-IV-V-I
      ['C', 'F', 'C', 'G'], // I-IV-I-V
      ['C', 'G', 'F', 'C'], // I-V-IV-I
      ['Am', 'Dm', 'G', 'C'], // vi-ii-V-I
    ],
    melodicPatterns: [[0, 3, 5, 6, 7], [0, -3, -5, -6, -7], [0, 7, 0], [0, 5, 6, 7]],
    rhythmPatterns: [0, 1, 2, 3, 4, 5, 6, 7], // Blues shuffle
    tempoRange: { min: 60, max: 120 },
    quantizationPreferences: [Quantization.Eighth, Quantization.Quarter],
    classicExamples: BLUES_EXAMPLES
  }
};

// Utility functions
export const transposeNote = (note: string, semitones: number): string => {
  const match = note.match(/([A-G][b#]?)(\d+)/);
  if (!match) return note;
  
  const [, pitch, octaveStr] = match;
  const octave = parseInt(octaveStr, 10);
  const noteValue = NOTE_MAP[pitch];
  if (noteValue === undefined) return note;
  
  const newNoteValue = (noteValue + semitones + 12) % 12;
  const newOctave = octave + Math.floor((noteValue + semitones) / 12);
  
  const noteNames = Object.keys(NOTE_MAP);
  const newPitch = noteNames.find(name => NOTE_MAP[name] === newNoteValue) || pitch;
  
  return `${newPitch}${newOctave}`;
};

export const transposeChord = (chord: string[], semitones: number): string[] => {
  return chord.map(note => transposeNote(note, semitones));
};

export const getScaleNotes = (root: string, scale: Scale): string[] => {
  const rootNote = root.replace(/\d+$/, '');
  const rootValue = NOTE_MAP[rootNote];
  if (rootValue === undefined) return [];
  
  return scale.intervals.map(interval => {
    const noteValue = (rootValue + interval) % 12;
    const noteNames = Object.keys(NOTE_MAP);
    const noteName = noteNames.find(name => NOTE_MAP[name] === noteValue) || rootNote;
    return noteName;
  });
};

export const getChordNotes = (root: string, chord: Chord): string[] => {
  const rootNote = root.replace(/\d+$/, '');
  const rootValue = NOTE_MAP[rootNote];
  if (rootValue === undefined) return [];
  
  return chord.intervals.map(interval => {
    const noteValue = (rootValue + interval) % 12;
    const noteNames = Object.keys(NOTE_MAP);
    const noteName = noteNames.find(name => NOTE_MAP[name] === noteValue) || rootNote;
    return noteName;
  });
};

export const detectKey = (events: MusicalEvent[]): string => {
  const flatNotes = events.flat().filter(note => note !== 'REST');
  if (flatNotes.length === 0) return 'C';
  
  // Enhanced key detection based on most common note and recent events
  const noteCounts: Record<string, number> = {};
  const recentNotes = flatNotes.slice(-8); // Focus on recent notes
  
  recentNotes.forEach(note => {
    const noteName = note.replace(/\d+$/, '');
    noteCounts[noteName] = (noteCounts[noteName] || 0) + 1;
  });
  
  // If no recent notes, use all notes
  if (Object.keys(noteCounts).length === 0) {
    flatNotes.forEach(note => {
      const noteName = note.replace(/\d+$/, '');
      noteCounts[noteName] = (noteCounts[noteName] || 0) + 1;
    });
  }
  
  const mostCommonNote = Object.entries(noteCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'C';
  
  return mostCommonNote;
};

export const isInScale = (note: string, scaleNotes: string[]): boolean => {
  const noteName = note.replace(/\d+$/, '');
  return scaleNotes.includes(noteName);
};

export const isInChord = (note: string, chordNotes: string[]): boolean => {
  const noteName = note.replace(/\d+$/, '');
  return chordNotes.includes(noteName);
};

// Create proper chord voicing with appropriate octaves
const createProperChordVoicing = (chordNotes: string[], baseOctave: number): Note[] => {
  if (chordNotes.length === 0) return [];
  
  const result: Note[] = [];
  
  // Root note at base octave
  result.push(`${chordNotes[0]}${baseOctave}`);
  
  // Third note at same octave or octave + 1
  if (chordNotes.length > 1) {
    const thirdOctave = baseOctave;
    result.push(`${chordNotes[1]}${thirdOctave}`);
  }
  
  // Fifth note at same octave
  if (chordNotes.length > 2) {
    const fifthOctave = baseOctave;
    result.push(`${chordNotes[2]}${fifthOctave}`);
  }
  
  // Seventh note (if present) at octave + 1
  if (chordNotes.length > 3) {
    const seventhOctave = baseOctave + 1;
    result.push(`${chordNotes[3]}${seventhOctave}`);
  }
  
  return result;
};

// Enhanced suggestion function with better separation and randomness
export const getMusicalSuggestion = (
  events: MusicalEvent[],
  genre: Genre,
  bpm: number,
  quantization: Quantization,
  baseOctave: number
): Note[] => {
  if (events.length === 0) {
    // Start with a random scale note
    const theory = GENRE_THEORY[genre];
    const randomScale = theory.scales[Math.floor(Math.random() * theory.scales.length)];
    const scaleNotes = getScaleNotes('C', randomScale);
    const randomNote = scaleNotes[Math.floor(Math.random() * scaleNotes.length)];
    return [`${randomNote}${baseOctave}`];
  }
  
  const lastEvent = events[events.length - 1];
  if (lastEvent === 'REST') {
    // After a rest, suggest a strong scale note
    const theory = GENRE_THEORY[genre];
    const detectedKey = detectKey(events);
    const randomScale = theory.scales[Math.floor(Math.random() * theory.scales.length)];
    const scaleNotes = getScaleNotes(detectedKey, randomScale);
    const strongNotes = [scaleNotes[0], scaleNotes[2], scaleNotes[4]]; // Root, third, fifth
    const randomNote = strongNotes[Math.floor(Math.random() * strongNotes.length)];
    return [`${randomNote}${baseOctave}`];
  }
  
  const isLastEventChord = Array.isArray(lastEvent);
  const lastNotes = isLastEventChord ? lastEvent : [lastEvent];
  
  // Strict chord-to-chord and note-to-note logic
  // If last event was a chord, always suggest a chord
  // If last event was a note, always suggest a note
  const shouldSuggestChord = isLastEventChord;
  
  // Add classic example influence (10% chance to use classic examples)
  if (Math.random() < 0.1) {
    return suggestFromClassicExamples(events, genre, baseOctave, isLastEventChord);
  }
  
  if (shouldSuggestChord) {
    return suggestChord(lastNotes, events, genre, baseOctave);
  } else {
    return suggestNote(lastNotes, events, genre, baseOctave);
  }
};

const suggestFromClassicExamples = (
  events: MusicalEvent[],
  genre: Genre,
  baseOctave: number,
  shouldSuggestChord: boolean
): Note[] => {
  const theory = GENRE_THEORY[genre];
  const examples = theory.classicExamples;
  
  // Get all possible events from examples at the current position
  const allPossibleEvents: MusicalEvent[] = [];
  examples.forEach(example => {
    const eventIndex = events.length % example.length;
    const exampleEvent = example[eventIndex];
    if (exampleEvent !== 'REST') {
      allPossibleEvents.push(exampleEvent);
    }
  });
  
  // Filter events based on whether we need a chord or note
  const filteredEvents = allPossibleEvents.filter(event => {
    if (shouldSuggestChord) {
      // We need a chord - check if this is actually a chord (multiple notes)
      return Array.isArray(event) && event.length > 1;
    } else {
      // We need a note - check if this is actually a single note
      return !Array.isArray(event) || event.length === 1;
    }
  });
  
  // If no matching events, fall back to regular suggestion
  if (filteredEvents.length === 0) {
    return shouldSuggestChord 
      ? suggestChord(events[events.length - 1] as Note[], events, genre, baseOctave)
      : suggestNote([events[events.length - 1] as Note], events, genre, baseOctave);
  }
  
  // Pick a random event from the filtered candidates
  const randomEvent = filteredEvents[Math.floor(Math.random() * filteredEvents.length)];
  
  // Transpose the example to match the current key
  const detectedKey = detectKey(events);
  const exampleKey = detectKey([randomEvent]);
  const keyDifference = (NOTE_MAP[detectedKey] - NOTE_MAP[exampleKey] + 12) % 12;
  
  if (Array.isArray(randomEvent)) {
    return randomEvent.map(note => transposeNote(note, keyDifference));
  } else {
    return [transposeNote(randomEvent, keyDifference)];
  }
};

const suggestChord = (
  lastNotes: Note[],
  events: MusicalEvent[],
  genre: Genre,
  baseOctave: number
): Note[] => {
  const theory = GENRE_THEORY[genre];
  const detectedKey = detectKey(events);
  
  // Get the most appropriate scale for this genre and key
  const primaryScale = theory.scales[0]; // Use the first scale (usually major/minor)
  const scaleNotes = getScaleNotes(detectedKey, primaryScale);
  
  // Add randomness to chord selection
  const randomValue = Math.random();
  
  if (randomValue < 0.5) {
    // 50% chance: Use common progressions
    const progressions = theory.commonProgressions;
    const randomProgression = progressions[Math.floor(Math.random() * progressions.length)];
    
    const lastRoot = lastNotes[0].replace(/\d+$/, '');
    const lastRootIndex = randomProgression.findIndex(chord => chord[0] === lastRoot);
    
    let nextChordRoot: string;
    if (lastRootIndex >= 0 && lastRootIndex < randomProgression.length - 1) {
      nextChordRoot = randomProgression[lastRootIndex + 1];
    } else {
      nextChordRoot = randomProgression[Math.floor(Math.random() * randomProgression.length)];
    }
    
    // Choose appropriate chord type based on scale degree
    const rootIndex = scaleNotes.indexOf(nextChordRoot);
    let chordType: Chord;
    
    if (rootIndex === 0) { // Root - major chord
      chordType = theory.chords.find(c => c.type === 'major') || theory.chords[0];
    } else if (rootIndex === 2) { // Third - minor chord
      chordType = theory.chords.find(c => c.type === 'minor') || theory.chords[0];
    } else if (rootIndex === 4) { // Fifth - major chord
      chordType = theory.chords.find(c => c.type === 'major') || theory.chords[0];
    } else {
      chordType = theory.chords[Math.floor(Math.random() * theory.chords.length)];
    }
    
    const chordNotes = getChordNotes(nextChordRoot, chordType);
    return createProperChordVoicing(chordNotes, baseOctave);
    
  } else {
    // 50% chance: Use voice leading (minimal movement)
    const lastRoot = lastNotes[0].replace(/\d+$/, '');
    const lastRootValue = NOTE_MAP[lastRoot];
    
    // Find a chord that's close by (within 3 semitones) and in the scale
    const closeIntervals = [-3, -2, -1, 1, 2, 3];
    const validRoots: string[] = [];
    
    closeIntervals.forEach(interval => {
      const newRootValue = (lastRootValue + interval + 12) % 12;
      const noteNames = Object.keys(NOTE_MAP);
      const newRoot = noteNames.find(name => NOTE_MAP[name] === newRootValue);
      if (newRoot && scaleNotes.includes(newRoot)) {
        validRoots.push(newRoot);
      }
    });
    
    const nextChordRoot = validRoots.length > 0 
      ? validRoots[Math.floor(Math.random() * validRoots.length)]
      : scaleNotes[Math.floor(Math.random() * scaleNotes.length)];
    
    // Choose chord type based on scale degree
    const rootIndex = scaleNotes.indexOf(nextChordRoot);
    let chordType: Chord;
    
    if (rootIndex === 0) { // Root - major chord
      chordType = theory.chords.find(c => c.type === 'major') || theory.chords[0];
    } else if (rootIndex === 2) { // Third - minor chord
      chordType = theory.chords.find(c => c.type === 'minor') || theory.chords[0];
    } else if (rootIndex === 4) { // Fifth - major chord
      chordType = theory.chords.find(c => c.type === 'major') || theory.chords[0];
    } else {
      chordType = theory.chords[Math.floor(Math.random() * theory.chords.length)];
    }
    
    const chordNotes = getChordNotes(nextChordRoot, chordType);
    return createProperChordVoicing(chordNotes, baseOctave);
  }
};

const suggestNote = (
  lastNotes: Note[],
  events: MusicalEvent[],
  genre: Genre,
  baseOctave: number
): Note[] => {
  const theory = GENRE_THEORY[genre];
  const detectedKey = detectKey(events);
  
  // Get the most appropriate scale for this genre and key
  const primaryScale = theory.scales[0]; // Use the first scale (usually major/minor)
  const scaleNotes = getScaleNotes(detectedKey, primaryScale);
  
  // Get the last note's position in the scale
  const lastNoteName = lastNotes[0].replace(/\d+$/, '');
  const lastNoteIndex = scaleNotes.indexOf(lastNoteName);
  
  // Add randomness to note selection
  const randomValue = Math.random();
  
  if (randomValue < 0.4) {
    // 40% chance: Use melodic patterns
    const patterns = theory.melodicPatterns;
    const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    if (lastNoteIndex >= 0) {
      const patternInterval = randomPattern[Math.floor(Math.random() * randomPattern.length)];
      const nextIndex = (lastNoteIndex + patternInterval + scaleNotes.length) % scaleNotes.length;
      const nextNoteName = scaleNotes[nextIndex];
      
      // Determine appropriate octave based on melodic direction
      let octave = baseOctave;
      if (patternInterval > 6) octave += 1; // Upward leap
      if (patternInterval < -6) octave -= 1; // Downward leap
      
      return [`${nextNoteName}${octave}`];
    }
  } else if (randomValue < 0.7) {
    // 30% chance: Use scale degrees with voice leading
    const lastOctave = parseInt(lastNotes[0].match(/\d+$/)?.[0] || baseOctave.toString());
    
    // Prefer strong scale degrees (1, 3, 5) but allow others
    const strongDegrees = [0, 2, 4]; // Root, third, fifth
    const allDegrees = [0, 1, 2, 3, 4, 5, 6];
    
    const degreeChoices = Math.random() < 0.7 ? strongDegrees : allDegrees;
    const randomDegree = degreeChoices[Math.floor(Math.random() * degreeChoices.length)];
    
    if (scaleNotes[randomDegree]) {
      const nextNoteName = scaleNotes[randomDegree];
      
      // Determine octave based on melodic direction
      let octave = lastOctave;
      if (lastNoteIndex >= 0) {
        const interval = randomDegree - lastNoteIndex;
        if (interval > 3) octave += 1; // Upward movement
        if (interval < -3) octave -= 1; // Downward movement
      }
      
      return [`${nextNoteName}${octave}`];
    }
  } else {
    // 30% chance: Stepwise motion (most melodic)
    if (lastNoteIndex >= 0) {
      const stepChoices = [lastNoteIndex - 1, lastNoteIndex + 1];
      const validSteps = stepChoices.filter(step => step >= 0 && step < scaleNotes.length);
      
      if (validSteps.length > 0) {
        const nextIndex = validSteps[Math.floor(Math.random() * validSteps.length)];
        const nextNoteName = scaleNotes[nextIndex];
        const lastOctave = parseInt(lastNotes[0].match(/\d+$/)?.[0] || baseOctave.toString());
        
        // Keep same octave for stepwise motion
        return [`${nextNoteName}${lastOctave}`];
      }
    }
  }
  
  // Fallback: strong scale degree
  const strongDegrees = [0, 2, 4]; // Root, third, fifth
  const randomDegree = strongDegrees[Math.floor(Math.random() * strongDegrees.length)];
  const fallbackNote = scaleNotes[randomDegree] || scaleNotes[0];
  return [`${fallbackNote}${baseOctave}`];
};

// Export the main function with the same signature as the original Gemini service
export const getSuggestion = async (
  events: MusicalEvent[],
  genre: Genre,
  bpm: number,
  quantization: Quantization,
  baseOctave: number
): Promise<Note[]> => {
  // Add a small delay to simulate async behavior and prevent too frequent suggestions
  await new Promise(resolve => setTimeout(resolve, 50));
  
  return getMusicalSuggestion(events, genre, bpm, quantization, baseOctave);
}; 