import { PianoKeyInfo } from './types';

const BOTTOM_ROW_MAPPING = ['z', 's', 'x', 'd', 'c', 'v', 'g', 'b', 'h', 'n', 'j', 'm'];
const TOP_ROW_MAPPING =    ['q', '2', 'w', '3', 'e', 'r', '5', 't', '6', 'y', '7', 'u'];
const NOTE_NAMES =         ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const KEY_TYPES: ('white' | 'black')[] = ['white', 'black', 'white', 'black', 'white', 'white', 'black', 'white', 'black', 'white', 'black', 'white'];

export const LFO_SPEEDS = ['1n', '2n', '4n', '8n', '16n'];

export const generateOctaveKeys = (octave: number, keyboardRow: 'bottom' | 'top'): PianoKeyInfo[] => {
    const keyMap = keyboardRow === 'bottom' ? BOTTOM_ROW_MAPPING : TOP_ROW_MAPPING;
    return NOTE_NAMES.map((name, index) => ({
        note: `${name}${octave}`,
        type: KEY_TYPES[index],
        keyboardKey: keyMap[index],
    }));
};

// --- Pitch Conversion Utilities ---
export const NOTE_MAP: { [key: string]: number } = {
  'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5,
  'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
};

export const noteToMidi = (note: string): number => {
  const match = note.match(/([A-G][b#]?)(\d+)/);
  if (!match) return 60; // Default to middle C if parsing fails
  const [, pitch, octaveStr] = match;
  const octave = parseInt(octaveStr, 10);
  const noteValue = NOTE_MAP[pitch];
  if (noteValue === undefined) return 60;
  return 12 * (octave + 1) + noteValue;
};
