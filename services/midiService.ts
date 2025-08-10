
import MidiWriter from 'midi-writer-js';
import { Note, Quantization, MusicalEvent } from '../types';

const getTickDuration = (quantization: Quantization): string => {
    switch (quantization) {
        case Quantization.Whole:
            return '1';
        case Quantization.Quarter:
            return '4';
        case Quantization.Eighth:
            return '8';
        case Quantization.Sixteenth:
            return '16';
        default:
            return '4'; // Default to quarter note
    }
};

export const createMidiFile = (events: MusicalEvent[], bpm: number, quantization: Quantization): string => {
    const track = new MidiWriter.Track();
    track.setTempo(bpm);
    track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: 1 })); // 1 = Acoustic Grand Piano

    const duration = getTickDuration(quantization);

    events.forEach(event => {
        let noteEvent;
        if (event === 'REST') {
            noteEvent = new MidiWriter.NoteEvent({ wait: duration });
        } else {
            const pitch = Array.isArray(event) ? event : [event];
            noteEvent = new MidiWriter.NoteEvent({
                pitch: pitch,
                duration: duration,
            });
        }
        track.addEvent(noteEvent);
    });

    const write = new MidiWriter.Writer([track]);
    return write.dataUri();
};
