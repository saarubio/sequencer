import { MelodyPreset, Genre } from './types';

export const PRESETS: MelodyPreset[] = [
    {
        name: "Twinkle, Twinkle",
        bpm: 100,
        sequence: ['C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'G4', 'REST', 'F4', 'F4', 'E4', 'E4', 'D4', 'D4', 'C4']
    },
    {
        name: "Ode to Joy",
        bpm: 120,
        sequence: ['E4', 'E4', 'F4', 'G4', 'G4', 'F4', 'E4', 'D4', 'C4', 'C4', 'D4', 'E4', 'E4', 'REST', 'D4', 'D4']
    },
    {
        name: "Jingle Bells",
        bpm: 140,
        sequence: ['E4', 'E4', 'E4', 'REST', 'E4', 'E4', 'E4', 'REST', 'E4', 'G4', 'C4', 'D4', 'E4']
    },
    {
        name: "Happy Birthday",
        bpm: 110,
        sequence: ['C4', 'C4', 'D4', 'C4', 'F4', 'E4', 'REST', 'C4', 'C4', 'D4', 'C4', 'G4', 'F4']
    },
    {
        name: "Mary Had a Little Lamb",
        bpm: 100,
        sequence: ['E4', 'D4', 'C4', 'D4', 'E4', 'E4', 'E4', 'REST', 'D4', 'D4', 'D4', 'REST', 'E4', 'G4', 'G4']
    },
    {
        name: "Frère Jacques",
        bpm: 120,
        sequence: ['C4', 'D4', 'E4', 'C4', 'C4', 'D4', 'E4', 'C4', 'E4', 'F4', 'G4', 'REST', 'E4', 'F4', 'G4']
    },
    {
        name: "London Bridge",
        bpm: 125,
        sequence: ['G4', 'A4', 'G4', 'F4', 'E4', 'F4', 'G4', 'REST', 'D4', 'E4', 'F4', 'REST', 'E4', 'F4', 'G4']
    },
    {
        name: "Row Your Boat",
        bpm: 90,
        sequence: ['C4', 'C4', 'C4', 'D4', 'E4', 'REST', 'E4', 'D4', 'E4', 'F4', 'G4']
    },
    {
        name: "Amazing Grace",
        bpm: 80,
        sequence: ['G3', 'C4', 'E4', 'C4', 'E4', 'D4', 'C4', 'A3', 'G3']
    },
    {
        name: "Canon in D (Simple)",
        bpm: 75,
        sequence: ['F#4', 'E4', 'D4', 'C#4', 'B3', 'A3', 'B3', 'C#4']
    }
];

// Classic examples organized by genre
export const CLASSIC_PRESETS: Record<Genre, MelodyPreset[]> = {
    [Genre.Pop]: [
        {
            name: "Let It Be - Beatles Style",
            bpm: 120,
            sequence: [['C4', 'E4', 'G4'], ['G4', 'B4', 'D5'], ['A4', 'C5', 'E5'], ['F4', 'A4', 'C5'], ['C4', 'E4', 'G4'], ['G4', 'B4', 'D5'], ['F4', 'A4', 'C5'], ['C4', 'E4', 'G4']]
        },
        {
            name: "Wonderwall - Oasis Style",
            bpm: 130,
            sequence: [['C4', 'E4', 'G4'], ['G4', 'B4', 'D5'], ['A4', 'C5', 'E5'], ['F4', 'A4', 'C5'], ['C4', 'E4', 'G4'], ['G4', 'B4', 'D5'], ['A4', 'C5', 'E5'], ['F4', 'A4', 'C5']]
        },
        {
            name: "Someone Like You - Adele Style",
            bpm: 135,
            sequence: [['C4', 'E4', 'G4'], ['G4', 'B4', 'D5'], ['A4', 'C5', 'E5'], ['F4', 'A4', 'C5'], ['C4', 'E4', 'G4'], ['G4', 'B4', 'D5'], ['F4', 'A4', 'C5'], ['C4', 'E4', 'G4']]
        },
        {
            name: "All of Me - John Legend Style",
            bpm: 125,
            sequence: [['C4', 'E4', 'G4'], ['G4', 'B4', 'D5'], ['A4', 'C5', 'E5'], ['F4', 'A4', 'C5'], ['C4', 'E4', 'G4'], ['G4', 'B4', 'D5'], ['A4', 'C5', 'E5'], ['F4', 'A4', 'C5']]
        },
        {
            name: "Perfect - Ed Sheeran Style",
            bpm: 140,
            sequence: [['C4', 'E4', 'G4'], ['G4', 'B4', 'D5'], ['A4', 'C5', 'E5'], ['F4', 'A4', 'C5'], ['C4', 'E4', 'G4'], ['G4', 'B4', 'D5'], ['F4', 'A4', 'C5'], ['C4', 'E4', 'G4']]
        }
    ],
    [Genre.Jazz]: [
        {
            name: "Autumn Leaves - Jazz Standard",
            bpm: 140,
            sequence: [['Am4', 'C5', 'E5'], ['Dm4', 'F4', 'A4'], ['G4', 'B4', 'D5'], ['C4', 'E4', 'G4'], ['F4', 'A4', 'C5'], ['B4', 'D5', 'F5'], ['E4', 'G4', 'B4'], ['Am4', 'C5', 'E5']]
        },
        {
            name: "Take Five - Dave Brubeck Style",
            bpm: 180,
            sequence: [['Ebm4', 'Gb4', 'Bb4'], ['Bbm4', 'Db4', 'F4'], ['Ab4', 'C5', 'Eb5'], ['Db4', 'F4', 'Ab4'], ['Ebm4', 'Gb4', 'Bb4'], ['Bbm4', 'Db4', 'F4'], ['Ab4', 'C5', 'Eb5'], ['Db4', 'F4', 'Ab4']]
        },
        {
            name: "So What - Miles Davis Style",
            bpm: 160,
            sequence: [['Dm4', 'F4', 'A4'], ['Dm4', 'F4', 'A4'], ['Ebm4', 'Gb4', 'Bb4'], ['Ebm4', 'Gb4', 'Bb4'], ['Dm4', 'F4', 'A4'], ['Dm4', 'F4', 'A4'], ['Ebm4', 'Gb4', 'Bb4'], ['Ebm4', 'Gb4', 'Bb4']]
        },
        {
            name: "Blue Bossa - Jazz Bossa",
            bpm: 150,
            sequence: [['Cm4', 'Eb4', 'G4'], ['Fm4', 'Ab4', 'C5'], ['Dm4', 'F4', 'A4'], ['G4', 'B4', 'D5'], ['Cm4', 'Eb4', 'G4'], ['Fm4', 'Ab4', 'C5'], ['Dm4', 'F4', 'A4'], ['G4', 'B4', 'D5']]
        },
        {
            name: "Giant Steps - John Coltrane Style",
            bpm: 200,
            sequence: [['B4', 'D5', 'F#5'], ['D4', 'F4', 'A4'], ['G4', 'B4', 'D5'], ['B4', 'D5', 'F#5'], ['D4', 'F4', 'A4'], ['G4', 'B4', 'D5'], ['B4', 'D5', 'F#5'], ['D4', 'F4', 'A4']]
        }
    ],
    [Genre.Classical]: [
        {
            name: "Für Elise - Beethoven Style",
            bpm: 120,
            sequence: ['E4', 'D#4', 'E4', 'D#4', 'E4', 'B3', 'D4', 'C4', 'A3', 'C4', 'E4', 'A4', 'B4', 'C5', 'D5', 'E5']
        },
        {
            name: "Moonlight Sonata - Beethoven Style",
            bpm: 60,
            sequence: [['C#4', 'G#3', 'C#4'], ['G#3', 'C#4', 'G#3'], ['C#4', 'G#3', 'C#4'], ['G#3', 'C#4', 'G#3'], ['C#4', 'G#3', 'C#4'], ['G#3', 'C#4', 'G#3'], ['C#4', 'G#3', 'C#4'], ['G#3', 'C#4', 'G#3']]
        },
        {
            name: "Prelude in C - Bach Style",
            bpm: 80,
            sequence: ['C4', 'E4', 'G4', 'C5', 'E5', 'G4', 'C5', 'E5', 'F4', 'A4', 'C5', 'F5', 'E4', 'G4', 'C5', 'E5']
        },
        {
            name: "Clair de Lune - Debussy Style",
            bpm: 70,
            sequence: ['D#4', 'F#4', 'A4', 'D#5', 'F#5', 'A4', 'D#5', 'F#5', 'C#4', 'E4', 'G#4', 'C#5', 'E5', 'G#4', 'C#5', 'E5']
        },
        {
            name: "Canon in D - Pachelbel Style",
            bpm: 75,
            sequence: ['D4', 'A3', 'B3', 'F#3', 'G3', 'D3', 'G3', 'A3', 'D4', 'A3', 'B3', 'F#3', 'G3', 'D3', 'G3', 'A3']
        }
    ],
    [Genre.Rock]: [
        {
            name: "Stairway to Heaven - Led Zeppelin Style",
            bpm: 140,
            sequence: [['Am4', 'C5', 'E5'], ['Am4', 'C5', 'E5'], ['G4', 'B4', 'D5'], ['G4', 'B4', 'D5'], ['F4', 'A4', 'C5'], ['F4', 'A4', 'C5'], ['C4', 'E4', 'G4'], ['C4', 'E4', 'G4']]
        },
        {
            name: "Sweet Child O' Mine - Guns N' Roses Style",
            bpm: 150,
            sequence: ['D4', 'A4', 'B4', 'F#4', 'G4', 'D4', 'A4', 'B4', 'D4', 'A4', 'B4', 'F#4', 'G4', 'D4', 'A4', 'B4']
        },
        {
            name: "Nothing Else Matters - Metallica Style",
            bpm: 130,
            sequence: [['Em4', 'G4', 'B4'], ['Em4', 'G4', 'B4'], ['D4', 'F#4', 'A4'], ['D4', 'F#4', 'A4'], ['C4', 'E4', 'G4'], ['C4', 'E4', 'G4'], ['G4', 'B4', 'D5'], ['G4', 'B4', 'D5']]
        },
        {
            name: "Hotel California - Eagles Style",
            bpm: 145,
            sequence: [['Am4', 'C5', 'E5'], ['E4', 'G4', 'B4'], ['G4', 'B4', 'D5'], ['D4', 'F#4', 'A4'], ['F4', 'A4', 'C5'], ['C4', 'E4', 'G4'], ['E4', 'G4', 'B4'], ['Am4', 'C5', 'E5']]
        },
        {
            name: "Bohemian Rhapsody - Queen Style",
            bpm: 160,
            sequence: [['Bb4', 'D5', 'F5'], ['F4', 'A4', 'C5'], ['G4', 'B4', 'D5'], ['Eb4', 'G4', 'Bb4'], ['F4', 'A4', 'C5'], ['Bb4', 'D5', 'F5'], ['F4', 'A4', 'C5'], ['G4', 'B4', 'D5']]
        }
    ],
    [Genre.Electronic]: [
        {
            name: "Sandstorm - Darude Style",
            bpm: 135,
            sequence: [['C4', 'E4', 'G4'], ['C4', 'E4', 'G4'], ['G4', 'B4', 'D5'], ['G4', 'B4', 'D5'], ['A4', 'C5', 'E5'], ['A4', 'C5', 'E5'], ['F4', 'A4', 'C5'], ['F4', 'A4', 'C5']]
        },
        {
            name: "Levels - Avicii Style",
            bpm: 128,
            sequence: [['F4', 'A4', 'C5'], ['F4', 'A4', 'C5'], ['C4', 'E4', 'G4'], ['C4', 'E4', 'G4'], ['G4', 'B4', 'D5'], ['G4', 'B4', 'D5'], ['A4', 'C5', 'E5'], ['A4', 'C5', 'E5']]
        },
        {
            name: "Animals - Martin Garrix Style",
            bpm: 140,
            sequence: [['C4', 'E4', 'G4'], ['C4', 'E4', 'G4'], ['G4', 'B4', 'D5'], ['G4', 'B4', 'D5'], ['A4', 'C5', 'E5'], ['A4', 'C5', 'E5'], ['F4', 'A4', 'C5'], ['F4', 'A4', 'C5']]
        },
        {
            name: "Titanium - David Guetta Style",
            bpm: 130,
            sequence: [['C4', 'E4', 'G4'], ['G4', 'B4', 'D5'], ['A4', 'C5', 'E5'], ['F4', 'A4', 'C5'], ['C4', 'E4', 'G4'], ['G4', 'B4', 'D5'], ['A4', 'C5', 'E5'], ['F4', 'A4', 'C5']]
        },
        {
            name: "Wake Me Up - Avicii Style",
            bpm: 125,
            sequence: [['C4', 'E4', 'G4'], ['G4', 'B4', 'D5'], ['A4', 'C5', 'E5'], ['F4', 'A4', 'C5'], ['C4', 'E4', 'G4'], ['G4', 'B4', 'D5'], ['A4', 'C5', 'E5'], ['F4', 'A4', 'C5']]
        }
    ],
    [Genre.Blues]: [
        {
            name: "Hoochie Coochie Man - Muddy Waters Style",
            bpm: 90,
            sequence: [['C4', 'E4', 'G4'], ['F4', 'A4', 'C5'], ['C4', 'E4', 'G4'], ['G4', 'B4', 'D5'], ['F4', 'A4', 'C5'], ['C4', 'E4', 'G4'], ['G4', 'B4', 'D5'], ['C4', 'E4', 'G4']]
        },
        {
            name: "Sweet Home Chicago - Blues Standard",
            bpm: 95,
            sequence: [['C4', 'E4', 'G4'], ['F4', 'A4', 'C5'], ['C4', 'E4', 'G4'], ['G4', 'B4', 'D5'], ['F4', 'A4', 'C5'], ['C4', 'E4', 'G4'], ['G4', 'B4', 'D5'], ['C4', 'E4', 'G4']]
        },
        {
            name: "The Thrill is Gone - B.B. King Style",
            bpm: 85,
            sequence: [['Am4', 'C5', 'E5'], ['Dm4', 'F4', 'A4'], ['G4', 'B4', 'D5'], ['C4', 'E4', 'G4'], ['F4', 'A4', 'C5'], ['B4', 'D5', 'F5'], ['E4', 'G4', 'B4'], ['Am4', 'C5', 'E5']]
        },
        {
            name: "Red House - Jimi Hendrix Style",
            bpm: 100,
            sequence: ['A4', 'A4', 'D4', 'D4', 'A4', 'A4', 'E4', 'E4', 'A4', 'A4', 'D4', 'D4', 'A4', 'A4', 'E4', 'E4']
        },
        {
            name: "Born Under a Bad Sign - Albert King Style",
            bpm: 88,
            sequence: [['C4', 'E4', 'G4'], ['F4', 'A4', 'C5'], ['C4', 'E4', 'G4'], ['G4', 'B4', 'D5'], ['F4', 'A4', 'C5'], ['C4', 'E4', 'G4'], ['G4', 'B4', 'D5'], ['C4', 'E4', 'G4']]
        }
    ]
};

// Get all presets including classics
export const getAllPresets = (): MelodyPreset[] => {
    const allPresets = [...PRESETS];
    
    Object.values(CLASSIC_PRESETS).forEach(genrePresets => {
        allPresets.push(...genrePresets);
    });
    
    return allPresets;
};

// Get presets by genre
export const getPresetsByGenre = (genre: Genre): MelodyPreset[] => {
    return CLASSIC_PRESETS[genre] || [];
};
