import React from 'react';
import { generateOctaveKeys } from '../constants';
import { Note, PianoKeyInfo } from '../types';

interface PianoProps {
  onNotePlay: (note: Note) => void;
  activeKeys: Set<string>;
  suggestion: Note[] | null;
  octave: number;
  onOctaveChange: (newOctave: number) => void;
}

const PianoKey: React.FC<{
  keyInfo: PianoKeyInfo;
  onNotePlay: (note: Note) => void;
  isPressed: boolean;
  isSuggestion: boolean;
}> = ({ keyInfo, onNotePlay, isPressed, isSuggestion }) => {
  const { note, type, keyboardKey } = keyInfo;

  // Shared styles
  const baseStyle = "border-2 rounded-b-md flex items-end justify-center pb-1 cursor-pointer transition-all duration-75 ease-in-out select-none";

  // White key styles
  const whiteKeyBase = "h-12 md:h-16 bg-gray-100 hover:bg-gray-200 shadow-md border-gray-600 z-0 w-full";
  const whiteActive = "bg-indigo-400 border-indigo-300 transform-gpu translate-y-0.5 shadow-[0_0_10px_rgba(129,140,248,0.6)]";
  const whiteSuggestion = "bg-purple-800/50 border-purple-600 shadow-[0_0_10px_rgba(192,132,252,0.4)]";

  // Black key styles
  const blackKeyBase = "h-8 md:h-10 bg-black hover:bg-gray-800 shadow-lg border-gray-400 z-10 absolute top-0 w-[60%] left-[70%]";
  const blackActive = "bg-indigo-500 border-indigo-300 transform-gpu translate-y-0.5 shadow-[0_0_10px_rgba(129,140,248,0.8)]";
  const blackSuggestion = "bg-purple-600/80 border-purple-500 shadow-[0_0_10px_rgba(192,132,252,0.6)]";
  
  const keyStyle = type === 'white'
    ? `${baseStyle} ${whiteKeyBase} ${isPressed ? whiteActive : isSuggestion ? whiteSuggestion : ''}`
    : `${baseStyle} ${blackKeyBase} ${isPressed ? blackActive : isSuggestion ? blackSuggestion : ''}`;

  let keyLabelColor;
  if (isPressed || (isSuggestion && type === 'black')) {
      keyLabelColor = 'text-white font-semibold';
  } else if (isSuggestion && type === 'white') {
      keyLabelColor = 'text-gray-100 font-semibold';
  } else {
      keyLabelColor = type === 'white' ? 'text-gray-500' : 'text-gray-300';
  }

  return (
    <div onMouseDown={() => onNotePlay(note)} className={keyStyle}>
      <span className={`font-mono text-xs ${keyLabelColor}`}>{keyboardKey.toUpperCase()}</span>
    </div>
  );
};

export const Piano: React.FC<PianoProps> = ({ onNotePlay, activeKeys, suggestion, octave, onOctaveChange }) => {
  const suggestionSet = new Set(suggestion || []);

  const renderOctave = (keys: PianoKeyInfo[]) => {
    const groupedKeys: { white: PianoKeyInfo; black: PianoKeyInfo | null }[] = [];
    let i = 0;
    while (i < keys.length) {
      if (keys[i].type === 'white') {
        const whiteKey = keys[i];
        let blackKey = null;
        if (i + 1 < keys.length && keys[i + 1].type === 'black') {
          blackKey = keys[i + 1];
          i++;
        }
        groupedKeys.push({ white: whiteKey, black: blackKey });
      }
      i++;
    }

    return (
      <div className="flex">
        {groupedKeys.map(({ white, black }) => (
          <div key={white.note} className="relative h-12 md:h-16 w-10 md:w-14">
            <PianoKey
              keyInfo={white}
              onNotePlay={onNotePlay}
              isPressed={activeKeys.has(white.note)}
              isSuggestion={suggestionSet.has(white.note)}
            />
            {black && (
              <PianoKey
                keyInfo={black}
                onNotePlay={onNotePlay}
                isPressed={activeKeys.has(black.note)}
                isSuggestion={suggestionSet.has(black.note)}
              />
            )}
          </div>
        ))}
      </div>
    );
  };
  
  const handleOctaveChange = (direction: 'up' | 'down') => {
    const newOctave = direction === 'up' ? octave + 1 : octave - 1;
    // Limit octaves from C0/C1 to C7/C8
    if (newOctave >= 0 && newOctave <= 6) {
      onOctaveChange(newOctave);
    }
  };

  const topOctaveKeys = generateOctaveKeys(octave + 1, 'top');
  const bottomOctaveKeys = generateOctaveKeys(octave, 'bottom');
  
  const octaveButtonStyle = "h-6 w-6 md:h-8 md:w-8 flex items-center justify-center text-sm md:text-lg bg-gray-700 hover:bg-gray-600 rounded-md text-cyan-400 leading-none disabled:opacity-50 transition-colors";

  return (
    <div className="w-full flex flex-col p-2 md:p-4 rounded-lg bg-gray-800/30 gap-y-1 md:gap-y-2">
      <div className="flex items-center gap-2 md:gap-4 w-full">
        <div className="flex items-center justify-center gap-1 md:gap-2 w-20 md:w-28 flex-shrink-0">
          <button onClick={() => handleOctaveChange('up')} className={octaveButtonStyle} disabled={octave >= 6}>▲</button>
          <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center bg-gray-900/40 rounded text-cyan-400 font-mono font-bold text-xs md:text-sm">
            C{octave + 1}
          </div>
        </div>
        {renderOctave(topOctaveKeys)}
      </div>
      <div className="flex items-center gap-2 md:gap-4 w-full">
        <div className="flex items-center justify-center gap-1 md:gap-2 w-20 md:w-28 flex-shrink-0">
          <button onClick={() => handleOctaveChange('down')} className={octaveButtonStyle} disabled={octave <= 0}>▼</button>
          <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center bg-gray-900/40 rounded text-cyan-400 font-mono font-bold text-xs md:text-sm">
            C{octave}
          </div>
        </div>
        {renderOctave(bottomOctaveKeys)}
      </div>
    </div>
  );
};