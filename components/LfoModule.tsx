
import React from 'react';
import { LfoState, LfoShape, LfoTarget } from '../types';
import { Knob } from './Knob';
import { LFO_SPEEDS } from '../constants';

interface LfoModuleProps {
    lfoState: LfoState;
    onUpdate: (id: number, newConfig: Partial<LfoState>) => void;
    onInteractionEnd: () => void;
}

const selectStyle = "bg-gray-800 border border-gray-700/80 text-white text-xs rounded-md focus:ring-purple-500 focus:border-purple-500 block w-full p-1.5 transition";

export const LfoModule: React.FC<LfoModuleProps> = ({ lfoState, onUpdate, onInteractionEnd }) => {

    const handleUpdate = (key: keyof LfoState, value: any) => {
        onUpdate(lfoState.id, { [key]: value });
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, key: keyof LfoState) => {
        handleUpdate(key, e.target.value);
        onInteractionEnd();
    };

    return (
        <div className="flex flex-col items-center gap-y-2">
            <Knob
                label="Speed"
                value={lfoState.speed}
                onChange={(val) => handleUpdate('speed', val)}
                min={0}
                max={LFO_SPEEDS.length - 1}
                step={1}
                displayValue={LFO_SPEEDS[lfoState.speed]}
                onInteractionEnd={onInteractionEnd}
            />
            <div className="flex flex-col gap-y-2 w-20">
                 <select
                    value={lfoState.shape}
                    onChange={(e) => handleSelectChange(e, 'shape')}
                    className={selectStyle}
                >
                    {Object.values(LfoShape).map((shape) => (
                        <option key={shape} value={shape}>
                            {shape.charAt(0).toUpperCase() + shape.slice(1)}
                        </option>
                    ))}
                </select>
                <select
                    value={lfoState.target}
                    onChange={(e) => handleSelectChange(e, 'target')}
                    className={selectStyle}
                >
                    {Object.values(LfoTarget).map((target) => (
                        <option key={target} value={target}>
                            {target}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};
