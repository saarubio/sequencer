


import React, { useRef, useEffect } from 'react';
import * as Tone from 'tone';
import { Note, MusicalEvent, Quantization } from '../types';
import { noteToMidi, NOTE_MAP } from '../constants';

// --- Pitch Visualization Helpers ---

const getQuantizationDurationInSeconds = (q: Quantization): number => {
    switch (q) {
        case Quantization.Sixteenth: return Tone.Time('16n').toSeconds();
        case Quantization.Eighth: return Tone.Time('8n').toSeconds();
        case Quantization.Quarter: return Tone.Time('4n').toSeconds();
        case Quantization.Whole: return Tone.Time('1n').toSeconds();
        default: return Tone.Time('4n').toSeconds();
    }
};


// --- Components ---

interface NoteDisplayProps {
  playedNotes: MusicalEvent[];
  suggestion: Note[] | null;
  isLoading: boolean;
  onClear: () => void;
  onAddRest: () => void;
  onDeleteLast: () => void;
  isPlaying: boolean;
  isAiModeOn: boolean;
  quantization: Quantization;
  minMidi: number;
  maxMidi: number;
  currentPresetName: string | null;
}

const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin h-5 w-5 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const NotePill: React.FC<{ note: Note; isSuggestion?: boolean }> = ({ note, isSuggestion = false }) => (
    <div className={`flex items-center justify-center h-8 px-4 ${isSuggestion ? 'bg-purple-500/90' : 'bg-cyan-600/90'} text-white font-semibold rounded-full shadow-md text-base transition-all`}>
      {note}
    </div>
);
  
const RestPill: React.FC = () => (
    <div className="flex items-center justify-center h-8 w-12 bg-gray-700/60 text-gray-400 font-semibold rounded-full shadow-md text-xl transition-all">
        —
    </div>
);

const NoteShape: React.FC<{ yPositionPercent: number }> = ({ yPositionPercent }) => {
    const stemGoesUp = yPositionPercent > 50; // If note is in the bottom half of the display, stem goes up
    const headColor = 'bg-cyan-600';
    const stemColor = 'bg-cyan-600/80';
  
    return (
      <div className="relative w-6 h-8 flex items-center justify-center">
        {/* Stem */}
        <div 
          className={`absolute w-0.5 h-6 ${stemColor} ${stemGoesUp ? 'bottom-1' : 'top-1'}`}
          style={stemGoesUp ? { right: '3px' } : { left: '3px' }}
        ></div>
        {/* Note Head (an oval) */}
        <div 
          className={`w-5 h-3.5 ${headColor} rounded-full transform -rotate-12 absolute ${stemGoesUp ? 'bottom-0' : 'top-0'}`}
        ></div>
      </div>
    );
  };

const GridBackground: React.FC<{ minMidi: number, maxMidi: number }> = ({ minMidi, maxMidi }) => {
    const lines = [];
    const midiRange = maxMidi - minMidi;
    if (midiRange <= 0) return null;

    for (let midi = Math.floor(minMidi); midi <= Math.ceil(maxMidi); midi++) {
      const noteName = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][(midi % 12)];
      const isNatural = !noteName.includes('#');
      const yPositionPercent = ((maxMidi - midi) / midiRange) * 100;
  
      lines.push(
        <div
          key={midi}
          className={`absolute w-full h-px ${isNatural ? 'bg-gray-700/40' : 'bg-gray-800/50'}`}
          style={{ top: `${yPositionPercent}%` }}
        ></div>
      );
    }
    return <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">{lines}</div>;
};

const EVENT_WIDTH_PX = 80;
const GAP_PX = 24;
const TOTAL_EVENT_WIDTH = EVENT_WIDTH_PX + GAP_PX;

export const NoteDisplay: React.FC<NoteDisplayProps> = ({ 
    playedNotes, suggestion, isLoading, onClear, onAddRest, onDeleteLast, 
    isPlaying, isAiModeOn, quantization, minMidi, maxMidi, currentPresetName
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const playbackHeadRef = useRef<HTMLDivElement>(null);
  const midiRange = maxMidi - minMidi;

  useEffect(() => {
    let animationFrameId: number;
    const head = playbackHeadRef.current;
    const scrollContainer = scrollContainerRef.current;

    const runAnimation = () => {
        if (!isPlaying || !head || !scrollContainer) {
            if(animationFrameId) cancelAnimationFrame(animationFrameId);
            return;
        }
        
        const stepDurationSecs = getQuantizationDurationInSeconds(quantization);
        const seconds = Tone.Transport.seconds;
        
        // The position is based on how many "steps" have passed in absolute time.
        const headPosition = (seconds / stepDurationSecs) * TOTAL_EVENT_WIDTH;

        head.style.transform = `translateX(${headPosition}px)`;

        const scrollLeft = scrollContainer.scrollLeft;
        const containerWidth = scrollContainer.offsetWidth;

        // Auto-scroll logic
        if (headPosition < scrollLeft + containerWidth * 0.25 || headPosition > scrollLeft + containerWidth * 0.75) {
            scrollContainer.scrollTo({
                left: headPosition - containerWidth / 2,
                behavior: 'auto'
            });
        }
        
        animationFrameId = requestAnimationFrame(runAnimation);
    };

    if (isPlaying) {
        runAnimation();
    } else if (head) {
        const lastEventPosition = playedNotes.length * TOTAL_EVENT_WIDTH;
        head.style.transform = `translateX(${lastEventPosition}px)`;
    }

    return () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, quantization, playedNotes.length]);

  useEffect(() => {
    if (scrollContainerRef.current && !isPlaying) {
        scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [playedNotes.length, isPlaying]);

  const totalWidth = playedNotes.length * TOTAL_EVENT_WIDTH + 100; // Add padding at the end

  return (
    <div className="h-full bg-black/50 rounded-lg flex flex-col border border-gray-700/50 shadow-inner overflow-hidden">
      {/* Preset Title */}
      <div className="flex-shrink-0 px-4 py-2 border-b border-gray-700/50 bg-gray-900/30">
        <h3 className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          {currentPresetName || "Create Your Magic ✨"}
        </h3>
      </div>
      <div ref={scrollContainerRef} className="relative z-10 flex-grow overflow-x-auto overflow-y-hidden">
        
        <div 
          className="relative h-full"
          style={{ width: `${totalWidth}px`, minWidth: '100%' }}
        >
          <GridBackground minMidi={minMidi} maxMidi={maxMidi} />
          
          <div 
            ref={playbackHeadRef} 
            className={`absolute top-0 bottom-0 w-px z-20 ${isPlaying ? 'bg-cyan-400 shadow-[0_0_10px_theme(colors.cyan.400)]' : 'bg-cyan-500/40'}`} 
            style={{ left: '0px' }}
          ></div>

          {playedNotes.map((event, index) => {
            const left = index * TOTAL_EVENT_WIDTH;

            if (event === 'REST') {
              return (
                <div 
                  key={index}
                  className="absolute flex justify-center items-center"
                  style={{ left: `${left}px`, width: `${EVENT_WIDTH_PX}px`, top: '50%', transform: 'translateY(-50%)' }}
                >
                  <RestPill />
                </div>
              );
            }

            const notes = Array.isArray(event) ? event : [event];
            return notes.map((note, noteIndex) => {
              const midi = noteToMidi(note);
              const yPositionPercent = midiRange > 0 ? ((maxMidi - midi) / midiRange) * 100 : 50;
              
              return (
                <div
                  key={`${index}-${noteIndex}`}
                  className="absolute flex items-center justify-center"
                  style={{
                    left: `${left}px`,
                    top: `calc(${yPositionPercent}% - 1rem)`, // 1rem is half of h-8
                    width: `${EVENT_WIDTH_PX}px`,
                    height: '2rem', // h-8
                  }}
                >
                  <NoteShape yPositionPercent={yPositionPercent} />
                </div>
              );
            });
          })}
        </div>
      </div>
      <div className="relative z-10 flex-shrink-0 h-14 flex items-center justify-between border-t border-gray-700/50 px-5">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-purple-400/90">SUGGESTION:</span>
          {isAiModeOn && isLoading && <LoadingSpinner />}
          {isAiModeOn && !isLoading && suggestion && suggestion.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 animate-pulse">
                {suggestion.map(note => <NotePill key={note} note={note} isSuggestion={true} />)}
              </div>
               <kbd className="px-2 py-1 text-xs font-semibold text-gray-200 bg-gray-700 border border-gray-600 rounded-md">Tab</kbd>
            </div>
          )}
          {(!isAiModeOn || (!isLoading && (!suggestion || suggestion.length === 0))) && playedNotes.length > 0 && (
            <span className="text-gray-500 italic text-sm">{isAiModeOn ? "No suggestion. Keep playing!" : "AI Mode is OFF"}</span>
          )}
           {(!isLoading || !isAiModeOn) && playedNotes.length === 0 && (
            <span className="text-gray-500 italic text-sm">{isAiModeOn ? "Play a note to begin..." : "AI Mode is OFF"}</span>
          )}
        </div>
        {playedNotes.length > 0 &&
            <div className="flex items-center gap-2">
                <button
                    onClick={onDeleteLast}
                    className="px-2 py-1 text-lg bg-gray-600/80 hover:bg-gray-500/80 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isPlaying || playedNotes.length === 0}
                    aria-label="Delete last event"
                >
                    ←
                </button>
                 <button
                    onClick={onAddRest}
                    className="px-2 py-1 text-lg bg-gray-600/80 hover:bg-gray-500/80 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isPlaying}
                    aria-label="Add rest"
                >
                    →
                </button>
                <button 
                    onClick={onClear} 
                    className="px-3 py-1 text-sm bg-red-600/80 hover:bg-red-500/80 text-white rounded-md transition-colors"
                    disabled={isPlaying}
                >
                    Clear
                </button>
            </div>
        }
      </div>
    </div>
  );
};