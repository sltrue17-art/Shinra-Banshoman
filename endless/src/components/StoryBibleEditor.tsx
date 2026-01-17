'use client';

import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import {
  X,
  Plus,
  Trash2,
  User,
  MapPin,
  Bookmark,
  Save,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { StoryBible, Character, WorldElement, PlotPoint } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface StoryBibleEditorProps {
  storyBible?: StoryBible | null;
  onSave: (storyBible: StoryBible) => void;
  onClose: () => void;
}

export default function StoryBibleEditor({
  storyBible,
  onSave,
  onClose,
}: StoryBibleEditorProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'characters' | 'world' | 'plot'>('general');
  const [data, setData] = useState<StoryBible>(() => {
    if (storyBible) return { ...storyBible };
    const now = Date.now();
    return {
      id: uuidv4(),
      name: '',
      description: '',
      createdAt: now,
      updatedAt: now,
      characters: [],
      worldBuilding: [],
      plotPoints: [],
      themes: [],
      tone: '',
      genre: '',
      customNotes: '',
    };
  });
  const [expandedCharacter, setExpandedCharacter] = useState<string | null>(null);
  const [themesInput, setThemesInput] = useState(data.themes.join(', '));

  const handleSave = () => {
    const themes = themesInput.split(',').map(t => t.trim()).filter(Boolean);
    onSave({
      ...data,
      themes,
      updatedAt: Date.now(),
    });
  };

  const addCharacter = () => {
    const newChar: Character = {
      id: uuidv4(),
      name: 'New Character',
      aliases: [],
      description: '',
      personality: '',
      backstory: '',
      relationships: [],
      traits: [],
      speechPatterns: '',
      goals: '',
      arc: '',
    };
    setData({ ...data, characters: [...data.characters, newChar] });
    setExpandedCharacter(newChar.id);
  };

  const updateCharacter = (id: string, updates: Partial<Character>) => {
    setData({
      ...data,
      characters: data.characters.map(c =>
        c.id === id ? { ...c, ...updates } : c
      ),
    });
  };

  const deleteCharacter = (id: string) => {
    setData({
      ...data,
      characters: data.characters.filter(c => c.id !== id),
    });
  };

  const addWorldElement = () => {
    const newElement: WorldElement = {
      id: uuidv4(),
      name: 'New Element',
      type: 'location',
      description: '',
      significance: '',
      relatedElements: [],
    };
    setData({ ...data, worldBuilding: [...data.worldBuilding, newElement] });
  };

  const updateWorldElement = (id: string, updates: Partial<WorldElement>) => {
    setData({
      ...data,
      worldBuilding: data.worldBuilding.map(w =>
        w.id === id ? { ...w, ...updates } : w
      ),
    });
  };

  const deleteWorldElement = (id: string) => {
    setData({
      ...data,
      worldBuilding: data.worldBuilding.filter(w => w.id !== id),
    });
  };

  const addPlotPoint = () => {
    const newPoint: PlotPoint = {
      id: uuidv4(),
      title: 'New Plot Point',
      description: '',
      status: 'planned',
      order: data.plotPoints.length + 1,
    };
    setData({ ...data, plotPoints: [...data.plotPoints, newPoint] });
  };

  const updatePlotPoint = (id: string, updates: Partial<PlotPoint>) => {
    setData({
      ...data,
      plotPoints: data.plotPoints.map(p =>
        p.id === id ? { ...p, ...updates } : p
      ),
    });
  };

  const deletePlotPoint = (id: string) => {
    setData({
      ...data,
      plotPoints: data.plotPoints.filter(p => p.id !== id),
    });
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Bookmark },
    { id: 'characters', label: 'Characters', icon: User },
    { id: 'world', label: 'World', icon: MapPin },
    { id: 'plot', label: 'Plot', icon: Bookmark },
  ] as const;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-endless-dark border border-purple-500/30 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-glow-lg">
        {/* Header */}
        <div className="p-4 border-b border-purple-500/20 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-purple-200">
            {storyBible ? 'Edit Story Bible' : 'New Story Bible'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-purple-500/20 px-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'flex items-center gap-2 px-4 py-3 border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-300'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  className="input-dream w-full"
                  placeholder="My Epic Story"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea
                  value={data.description}
                  onChange={(e) => setData({ ...data, description: e.target.value })}
                  className="input-dream w-full h-24 resize-none"
                  placeholder="A brief overview of your story..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Genre</label>
                  <input
                    type="text"
                    value={data.genre}
                    onChange={(e) => setData({ ...data, genre: e.target.value })}
                    className="input-dream w-full"
                    placeholder="Fantasy, Sci-Fi, Romance..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Tone</label>
                  <input
                    type="text"
                    value={data.tone}
                    onChange={(e) => setData({ ...data, tone: e.target.value })}
                    className="input-dream w-full"
                    placeholder="Dark, Lighthearted, Epic..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Themes (comma-separated)</label>
                <input
                  type="text"
                  value={themesInput}
                  onChange={(e) => setThemesInput(e.target.value)}
                  className="input-dream w-full"
                  placeholder="Redemption, Power, Love..."
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Additional Notes</label>
                <textarea
                  value={data.customNotes}
                  onChange={(e) => setData({ ...data, customNotes: e.target.value })}
                  className="input-dream w-full h-32 resize-none"
                  placeholder="Any other important details about your story..."
                />
              </div>
            </div>
          )}

          {activeTab === 'characters' && (
            <div className="space-y-4">
              <button
                onClick={addCharacter}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Character
              </button>

              {data.characters.map((char) => (
                <div key={char.id} className="card-dream overflow-hidden">
                  <button
                    onClick={() => setExpandedCharacter(expandedCharacter === char.id ? null : char.id)}
                    className="w-full p-4 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-purple-200 font-medium">{char.name || 'Unnamed'}</p>
                        <p className="text-gray-500 text-sm">{char.description.substring(0, 50) || 'No description'}</p>
                      </div>
                    </div>
                    {expandedCharacter === char.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {expandedCharacter === char.id && (
                    <div className="p-4 pt-0 space-y-3 border-t border-purple-500/10">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Name</label>
                        <input
                          type="text"
                          value={char.name}
                          onChange={(e) => updateCharacter(char.id, { name: e.target.value })}
                          className="input-dream w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Description</label>
                        <textarea
                          value={char.description}
                          onChange={(e) => updateCharacter(char.id, { description: e.target.value })}
                          className="input-dream w-full h-20 resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Personality</label>
                        <textarea
                          value={char.personality}
                          onChange={(e) => updateCharacter(char.id, { personality: e.target.value })}
                          className="input-dream w-full h-20 resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Backstory</label>
                        <textarea
                          value={char.backstory}
                          onChange={(e) => updateCharacter(char.id, { backstory: e.target.value })}
                          className="input-dream w-full h-20 resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Speech Patterns</label>
                        <input
                          type="text"
                          value={char.speechPatterns}
                          onChange={(e) => updateCharacter(char.id, { speechPatterns: e.target.value })}
                          className="input-dream w-full"
                          placeholder="How do they talk? Catchphrases, accent, vocabulary..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Goals</label>
                          <input
                            type="text"
                            value={char.goals}
                            onChange={(e) => updateCharacter(char.id, { goals: e.target.value })}
                            className="input-dream w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Character Arc</label>
                          <input
                            type="text"
                            value={char.arc}
                            onChange={(e) => updateCharacter(char.id, { arc: e.target.value })}
                            className="input-dream w-full"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => deleteCharacter(char.id)}
                        className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Character
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'world' && (
            <div className="space-y-4">
              <button
                onClick={addWorldElement}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add World Element
              </button>

              {data.worldBuilding.map((element) => (
                <div key={element.id} className="card-dream p-4 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={element.name}
                          onChange={(e) => updateWorldElement(element.id, { name: e.target.value })}
                          className="input-dream flex-1"
                          placeholder="Element name"
                        />
                        <select
                          value={element.type}
                          onChange={(e) => updateWorldElement(element.id, { type: e.target.value as WorldElement['type'] })}
                          className="input-dream w-40"
                        >
                          <option value="location">Location</option>
                          <option value="organization">Organization</option>
                          <option value="item">Item</option>
                          <option value="concept">Concept</option>
                          <option value="event">Event</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <textarea
                        value={element.description}
                        onChange={(e) => updateWorldElement(element.id, { description: e.target.value })}
                        className="input-dream w-full h-20 resize-none"
                        placeholder="Description..."
                      />
                      <input
                        type="text"
                        value={element.significance}
                        onChange={(e) => updateWorldElement(element.id, { significance: e.target.value })}
                        className="input-dream w-full"
                        placeholder="Significance to the story..."
                      />
                    </div>
                    <button
                      onClick={() => deleteWorldElement(element.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'plot' && (
            <div className="space-y-4">
              <button
                onClick={addPlotPoint}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Plot Point
              </button>

              {data.plotPoints.sort((a, b) => a.order - b.order).map((point) => (
                <div key={point.id} className="card-dream p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="number"
                      value={point.order}
                      onChange={(e) => updatePlotPoint(point.id, { order: parseInt(e.target.value) || 0 })}
                      className="input-dream w-16 text-center"
                      min={1}
                    />
                    <div className="flex-1 space-y-3">
                      <input
                        type="text"
                        value={point.title}
                        onChange={(e) => updatePlotPoint(point.id, { title: e.target.value })}
                        className="input-dream w-full"
                        placeholder="Plot point title"
                      />
                      <textarea
                        value={point.description}
                        onChange={(e) => updatePlotPoint(point.id, { description: e.target.value })}
                        className="input-dream w-full h-20 resize-none"
                        placeholder="Description..."
                      />
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={point.chapter || ''}
                          onChange={(e) => updatePlotPoint(point.id, { chapter: e.target.value })}
                          className="input-dream flex-1"
                          placeholder="Chapter (optional)"
                        />
                        <select
                          value={point.status}
                          onChange={(e) => updatePlotPoint(point.id, { status: e.target.value as PlotPoint['status'] })}
                          className="input-dream w-40"
                        >
                          <option value="planned">Planned</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={() => deletePlotPoint(point.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-purple-500/20 flex justify-end gap-3">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleSave} className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Story Bible
          </button>
        </div>
      </div>
    </div>
  );
}
