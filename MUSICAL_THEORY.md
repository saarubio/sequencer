# Enhanced Musical Theory System

This document explains the comprehensive musical theory system that powers the AI completion feature in the sequencer.

## Overview

The musical theory system replaces the external Gemini API with a mathematical and rule-based approach for generating musical suggestions. It uses genre-specific scales, chords, progressions, melodic patterns, and classic sheet music examples to create musically coherent completions with enhanced randomness and better separation between chord and note suggestions.

## Core Components

### 1. Scales

The system includes 10 different scales:

- **Major Scale**: [0, 2, 4, 5, 7, 9, 11] - C, D, E, F, G, A, B
- **Minor Scale**: [0, 2, 3, 5, 7, 8, 10] - C, D, Eb, F, G, Ab, Bb
- **Pentatonic Major**: [0, 2, 4, 7, 9] - C, D, E, G, A
- **Pentatonic Minor**: [0, 3, 5, 7, 10] - C, Eb, F, G, Bb
- **Blues Scale**: [0, 3, 5, 6, 7, 10] - C, Eb, F, F#, G, Bb
- **Dorian Mode**: [0, 2, 3, 5, 7, 9, 10] - C, D, Eb, F, G, A, Bb
- **Mixolydian Mode**: [0, 2, 4, 5, 7, 9, 10] - C, D, E, F, G, A, Bb
- **Phrygian Mode**: [0, 1, 3, 5, 7, 8, 10] - C, Db, Eb, F, G, Ab, Bb
- **Lydian Mode**: [0, 2, 4, 6, 7, 9, 11] - C, D, E, F#, G, A, B
- **Locrian Mode**: [0, 1, 3, 5, 6, 8, 10] - C, Db, Eb, F, Gb, Ab, Bb

### 2. Chords

The system includes 10 different chord types:

- **Major**: [0, 4, 7] - C, E, G
- **Minor**: [0, 3, 7] - C, Eb, G
- **Diminished**: [0, 3, 6] - C, Eb, Gb
- **Augmented**: [0, 4, 8] - C, E, G#
- **Dominant 7th**: [0, 4, 7, 10] - C, E, G, Bb
- **Major 7th**: [0, 4, 7, 11] - C, E, G, B
- **Minor 7th**: [0, 3, 7, 10] - C, Eb, G, Bb
- **Suspended 2nd**: [0, 2, 7] - C, D, G
- **Suspended 4th**: [0, 5, 7] - C, F, G
- **Power Chord**: [0, 7] - C, G

### 3. Classic Sheet Music Examples

Each genre includes 5 classic musical examples (2-4 bars each) that influence the autocomplete:

#### Pop Examples
- "Let It Be" - Beatles style
- "Wonderwall" - Oasis style  
- "Someone Like You" - Adele style
- "All of Me" - John Legend style
- "Perfect" - Ed Sheeran style

#### Jazz Examples
- "Autumn Leaves" - Jazz standard
- "Take Five" - Dave Brubeck style
- "So What" - Miles Davis style
- "Blue Bossa" - Jazz bossa
- "Giant Steps" - John Coltrane style

#### Classical Examples
- "Für Elise" - Beethoven style
- "Moonlight Sonata" - Beethoven style
- "Prelude in C" - Bach style
- "Clair de Lune" - Debussy style
- "Canon in D" - Pachelbel style

#### Rock Examples
- "Stairway to Heaven" - Led Zeppelin style
- "Sweet Child O' Mine" - Guns N' Roses style
- "Nothing Else Matters" - Metallica style
- "Hotel California" - Eagles style
- "Bohemian Rhapsody" - Queen style

#### Electronic Examples
- "Sandstorm" - Darude style
- "Levels" - Avicii style
- "Animals" - Martin Garrix style
- "Titanium" - David Guetta style
- "Wake Me Up" - Avicii style

#### Blues Examples
- "Hoochie Coochie Man" - Muddy Waters style
- "Sweet Home Chicago" - Blues standard
- "The Thrill is Gone" - B.B. King style
- "Red House" - Jimi Hendrix style
- "Born Under a Bad Sign" - Albert King style

### 4. Genre-Specific Theory

Each genre has its own musical characteristics:

#### Pop
- **Scales**: Major, Minor, Pentatonic Major, Pentatonic Minor
- **Chords**: Major, Minor, Dominant 7th, Major 7th, Minor 7th, Suspended 2nd, Suspended 4th
- **Common Progressions**: I-V-vi-IV, vi-IV-I-V, I-vi-IV-V, IV-I-V-vi
- **Tempo Range**: 80-140 BPM
- **Quantization**: Quarter, Eighth notes

#### Jazz
- **Scales**: All modes (Dorian, Mixolydian, Phrygian, Lydian, Locrian) + Blues
- **Chords**: All chord types including diminished and augmented
- **Common Progressions**: I-vi-ii-V, ii-V-I-IV, I-IV-ii-V, vi-ii-V-I
- **Tempo Range**: 60-200 BPM
- **Quantization**: Eighth, Sixteenth notes

#### Classical
- **Scales**: All modes
- **Chords**: All chord types
- **Common Progressions**: I-IV-V-I, I-vi-IV-V, vi-ii-V-I, I-V-vi-IV
- **Tempo Range**: 40-180 BPM
- **Quantization**: Quarter, Eighth, Whole notes

#### Rock
- **Scales**: Major, Minor, Pentatonic Major, Pentatonic Minor, Blues
- **Chords**: Major, Minor, Power Chord, Dominant 7th, Suspended chords
- **Common Progressions**: I-V-vi-IV, vi-IV-I-V, I-vi-IV-V
- **Tempo Range**: 80-160 BPM
- **Quantization**: Quarter, Eighth notes

#### Electronic
- **Scales**: Major, Minor, Pentatonic Major, Pentatonic Minor, Dorian, Mixolydian
- **Chords**: Major, Minor, Dominant 7th, Major 7th, Minor 7th, Suspended chords
- **Common Progressions**: I-vi-IV-V, vi-IV-I-V, I-V-vi-IV, IV-I-V-vi
- **Tempo Range**: 120-140 BPM
- **Quantization**: Sixteenth, Eighth notes

#### Blues
- **Scales**: Blues, Pentatonic Minor, Minor
- **Chords**: Major, Minor, Dominant 7th, Power Chord
- **Common Progressions**: I-IV-V-I, I-IV-I-V, I-V-IV-I, vi-ii-V-I
- **Tempo Range**: 60-120 BPM
- **Quantization**: Eighth, Quarter notes

## Enhanced Algorithm

### 1. Key Detection
The system analyzes the played notes to detect the current key by finding the most frequently used note.

### 2. Enhanced Suggestion Logic

#### For Empty Sequences
- Randomly selects a scale appropriate for the genre
- Suggests a random note from that scale

#### After Rests
- Suggests a strong scale note (root, third, or fifth)
- Uses the detected key and genre-appropriate scales

#### Chord vs Note Decision
- **After a chord**: 100% chance to suggest a chord (chord-to-chord)
- **After a note**: 100% chance to suggest a note (note-to-note)
- **Classic examples**: 10% chance to use classic sheet music examples

#### Note Completion Strategies
1. **Melodic Patterns (30%)**: Uses genre-specific melodic intervals
2. **Scale Degrees (30%)**: Prefers strong scale degrees (1, 3, 5) with 70% probability
3. **Random Scale Notes (40%)**: Completely random notes from the scale

#### Chord Completion Strategies
1. **Common Progressions (40%)**: Follows genre-specific chord progressions
2. **Voice Leading (30%)**: Minimal movement between chord roots (within 2 semitones)
3. **Random Chords (30%)**: Random chords from the genre's chord palette

### 3. Classic Examples Integration

The system includes classic sheet music examples that:
- Are transposed to match the current key
- Provide authentic genre-specific patterns
- Add variety and musical authenticity
- Are used 10% of the time for suggestions

### 4. Mathematical Approach

The system uses:
- **Interval Analysis**: Calculating semitone distances between notes
- **Scale Degree Mapping**: Converting notes to scale positions
- **Progression Logic**: Following common chord progressions
- **Voice Leading**: Minimizing movement between chord tones
- **Enhanced Randomization**: Multiple strategies with weighted probabilities
- **Key Transposition**: Adapting examples to the current musical context

## Benefits

1. **No External Dependencies**: Works offline without API calls
2. **Enhanced Randomness**: Multiple suggestion strategies with weighted probabilities
3. **Better Chord/Note Separation**: Clear logic for when to suggest chords vs notes
4. **Classic Examples**: Authentic musical patterns from famous songs
5. **Genre-Aware**: Tailored suggestions for each musical style
6. **Fast Response**: No network latency
7. **Musically Sound**: Based on established music theory principles
8. **Customizable**: Easy to modify scales, chords, progressions, and examples

## Usage

The system automatically:
- Detects the musical context (genre, tempo, quantization)
- Analyzes the current sequence
- Chooses appropriate suggestion strategy based on context
- Generates musically coherent suggestions
- Maintains variety through multiple randomization approaches
- Incorporates classic musical examples for authenticity

## Extending the System

To add new genres or modify existing ones:

1. Add new scales to the `Scale` interface
2. Add new chords to the `Chord` interface
3. Add classic examples to the genre's `classicExamples` array
4. Update the `GENRE_THEORY` object with new genre data
5. Modify the suggestion algorithms as needed
6. Adjust randomization weights for different strategies

The modular design makes it easy to extend and customize the musical theory system while maintaining musical coherence and authenticity. 