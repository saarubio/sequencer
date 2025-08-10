export type Note = string;

export type MusicalEvent = Note | Note[] | 'REST';

export enum Genre {
  Pop = "Pop",
  Jazz = "Jazz",
  Classical = "Classical",
  Rock = "Rock",
  Electronic = "Electronic",
  Blues = "Blues",
}

export enum Quantization {
  Sixteenth = "1/16",
  Eighth = "1/8",
  Quarter = "1/4",
  Whole = "1/1",
}

export enum OscillatorType {
    Sawtooth = "sawtooth",
    Square = "square",
    Sine = "sine",
}

export interface PianoKeyInfo {
  note: Note;
  type: 'white' | 'black';
  keyboardKey: string;
}

export interface MelodyPreset {
    name: string;
    bpm: number;
    sequence: MusicalEvent[];
}

// --- LFO Types ---
export enum LfoShape {
    Sine = "sine",
    Square = "square",
    Sawtooth = "sawtooth",
    Triangle = "triangle",
}

export enum LfoTarget {
    None = "None",
    Cutoff = "Cutoff",
    Resonance = "Resonance",
    Delay = "Delay",
    Reverb = "Reverb",
}

export interface LfoState {
    id: number;
    speed: number; // Index of the speed array
    shape: LfoShape;
    target: LfoTarget;
}