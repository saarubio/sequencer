import React, { useState, useMemo } from 'react';
import { MelodyPreset, Genre } from '../types';
import { PRESETS, CLASSIC_PRESETS, getAllPresets } from '../presets';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadPreset: (preset: MelodyPreset) => void;
  currentGenre: Genre;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  onLoadPreset,
  currentGenre
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'classic' | 'traditional'>('all');
  const [selectedGenre, setSelectedGenre] = useState<Genre | 'all'>('all');

  const categories = [
    { id: 'all', name: 'All Presets', count: getAllPresets().length },
    { id: 'traditional', name: 'Traditional Melodies', count: PRESETS.length },
    { id: 'classic', name: 'Classic Examples', count: getAllPresets().length - PRESETS.length }
  ];

  const filteredPresets = useMemo(() => {
    let presets: MelodyPreset[] = [];

    // Filter by category
    if (selectedCategory === 'traditional') {
      presets = PRESETS;
    } else if (selectedCategory === 'classic') {
      presets = getAllPresets().filter(preset => !PRESETS.includes(preset));
    } else {
      presets = getAllPresets();
    }

    // Filter by genre
    if (selectedGenre !== 'all') {
      presets = presets.filter(preset => {
        // Check if preset belongs to the selected genre
        return CLASSIC_PRESETS[selectedGenre]?.some(genrePreset => genrePreset.name === preset.name);
      });
    }

    // Filter by search term
    if (searchTerm) {
      presets = presets.filter(preset =>
        preset.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return presets;
  }, [searchTerm, selectedCategory, selectedGenre]);

  const handlePresetClick = (preset: MelodyPreset) => {
    onLoadPreset(preset);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-gray-900 rounded-lg border border-gray-700 max-w-4xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Presets Library</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-700 space-y-4">
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Search presets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Category and Genre Filters */}
          <div className="flex gap-4 flex-wrap">
            {/* Category Filter */}
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Genre Filter */}
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value as any)}
                className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">All Genres</option>
                {Object.values(Genre).map(genre => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Presets Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredPresets.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <p className="text-lg">No presets found matching your criteria.</p>
              <p className="text-sm mt-2">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPresets.map((preset) => (
                <div
                  key={preset.name}
                  onClick={() => handlePresetClick(preset)}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-purple-500 hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white text-sm leading-tight">
                      {preset.name}
                    </h3>
                    <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                      {preset.bpm} BPM
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-400 mb-3">
                    {preset.sequence.length} events
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {preset.sequence.slice(0, 3).map((event, index) => {
                      if (event === 'REST') return 'REST';
                      if (Array.isArray(event)) {
                        return event.slice(0, 2).join('+');
                      }
                      return event;
                    }).join(' • ')}
                    {preset.sequence.length > 3 && ' • ...'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            {filteredPresets.length} preset{filteredPresets.length !== 1 ? 's' : ''} found
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}; 