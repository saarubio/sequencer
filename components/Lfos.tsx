import React from 'react';
import { LfoState } from '../types';
import { LfoModule } from './LfoModule';

interface LfosProps {
    lfos: LfoState[];
    onUpdate: (id: number, newConfig: Partial<LfoState>) => void;
    onInteractionEnd: () => void;
}

export const Lfos: React.FC<LfosProps> = ({ lfos, onUpdate, onInteractionEnd }) => {
    return (
        <div className="p-4 rounded-lg bg-gray-800/30">
            <div className="flex items-center justify-center p-2 border-b border-gray-700/50 mb-4">
                <h2 className="text-sm font-semibold uppercase text-cyan-400 tracking-widest">LFOs</h2>
            </div>
            <div className="flex flex-row items-start gap-x-6">
                {lfos.map((lfo) => (
                    <LfoModule 
                        key={lfo.id}
                        lfoState={lfo}
                        onUpdate={onUpdate}
                        onInteractionEnd={onInteractionEnd}
                    />
                ))}
            </div>
        </div>
    );
};
