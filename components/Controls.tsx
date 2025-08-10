
import React, { useState } from 'react';
import { Genre, Quantization, OscillatorType, MelodyPreset } from '../types';
import { PresetsModal } from './PresetsModal';

interface ControlsProps {
  genre: Genre;
  setGenre: (g: Genre) => void;
  bpm: number;
  setBpm: (b: number) => void;
  quantization: Quantization;
  setQuantization: (q: Quantization) => void;
  oscillatorType: OscillatorType;
  setOscillatorType: (o: OscillatorType) => void;
  onExportMidi: () => void;
  isExportDisabled: boolean;
  isPlaying: boolean;
  onPlayStop: () => void;
  isMetronomeOn: boolean;
  setIsMetronomeOn: (m: boolean) => void;
  isAiModeOn: boolean;
  setIsAiModeOn: (a: boolean) => void;
  onLoadPreset: (preset: MelodyPreset) => void;
  onInteractionEnd: () => void;
  onOpenPresetsModal: () => void;
}

const ControlWrapper: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex flex-col">
        <label className="text-xs text-gray-400 mb-1 text-center">{label}</label>
        {children}
    </div>
);

const selectStyle = "bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 transition disabled:opacity-50";
const buttonStyle = "self-end px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50";

const ToggleSwitch: React.FC<{
    label: string;
    id: string;
    isOn: boolean;
    onToggle: (isOn: boolean) => void;
    disabled?: boolean;
}> = ({ label, id, isOn, onToggle, disabled = false }) => (
    <div className="flex items-center">
        <label htmlFor={id} className={`text-sm mr-2 transition-colors ${disabled ? 'text-gray-600' : 'text-gray-300'}`}>{label}</label>
        <button
            id={id}
            onClick={() => onToggle(!isOn)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${isOn ? 'bg-purple-600' : 'bg-gray-700'} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            aria-checked={isOn}
            role="switch"
            disabled={disabled}
        >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isOn ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

export const Controls: React.FC<ControlsProps> = ({ 
    genre, setGenre, bpm, setBpm, quantization, setQuantization, 
    oscillatorType, setOscillatorType, onExportMidi, isExportDisabled,
    isPlaying, onPlayStop, isMetronomeOn, setIsMetronomeOn,
    isAiModeOn, setIsAiModeOn, onLoadPreset, onInteractionEnd, onOpenPresetsModal
}) => {

  return (
    <div className="flex flex-col md:flex-row items-center md:items-end gap-y-2 md:gap-y-0 md:gap-x-4 w-full">
      <div className="flex items-center p-2 rounded-lg bg-gray-800/50 border border-gray-700 gap-x-2">
        <button onClick={onPlayStop} className={`${buttonStyle} ${isPlaying ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'} w-20`}>
          {isPlaying ? 'Stop' : 'Play'}
        </button>
        <div className="border-l border-gray-600 h-8 mx-2"></div>
        <ToggleSwitch label="Metronome" id="metronome-toggle" isOn={isMetronomeOn} onToggle={(isOn) => { setIsMetronomeOn(isOn); onInteractionEnd(); }} />
        <div className="border-l border-gray-600 h-8 mx-2"></div>
        <ToggleSwitch label="AI Mode" id="ai-mode-toggle" isOn={isAiModeOn} onToggle={(isOn) => { setIsAiModeOn(isOn); onInteractionEnd(); }} />
      </div>

      <div className="flex items-end p-2 rounded-lg bg-gray-800/50 border border-gray-700 gap-x-2 md:gap-x-4 flex-wrap justify-center">
        <ControlWrapper >
            <button
                onClick={() => {
                    onOpenPresetsModal();
                    onInteractionEnd();
                }}
                className={`${selectStyle} cursor-pointer hover:bg-gray-700`}
                disabled={isPlaying}
            >
                Browse Presets...
            </button>
        </ControlWrapper>
        <ControlWrapper >
          <select value={oscillatorType} onChange={(e) => { setOscillatorType(e.target.value as OscillatorType); onInteractionEnd(); }} className={selectStyle} disabled={isPlaying}>
            {Object.values(OscillatorType).map((o) => (<option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>))}
          </select>
        </ControlWrapper>

        <ControlWrapper >
          <select value={genre} onChange={(e) => { setGenre(e.target.value as Genre); onInteractionEnd(); }} className={selectStyle} disabled={isPlaying}>
            {Object.values(Genre).map((g) => (<option key={g} value={g}>{g}</option>))}
          </select>
        </ControlWrapper>
        
        <ControlWrapper label={`BPM: ${bpm}`}>
          <input type="range" min="40" max="220" value={bpm} onChange={(e) => setBpm(parseInt(e.target.value, 10))} onMouseUp={onInteractionEnd} className="w-24 h-2 bg-gray-700 mb-3 rounded-lg appearance-none cursor-pointer accent-purple-500 disabled:opacity-50" disabled={isPlaying}/>
        </ControlWrapper>

        <ControlWrapper >
          <select value={quantization} onChange={(e) => { setQuantization(e.target.value as Quantization); onInteractionEnd(); }} className={selectStyle} disabled={isPlaying}>
            {Object.values(Quantization).map((q) => (<option key={q} value={q}>{q}</option>))}
          </select>
        </ControlWrapper>
      </div>
      
      <button onClick={onExportMidi} disabled={isExportDisabled} className={`${buttonStyle} bg-green-600 hover:bg-green-500`}>
        Export MIDI
      </button>


    </div>
  );
};
