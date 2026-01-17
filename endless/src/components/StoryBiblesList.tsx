'use client';

import { clsx } from 'clsx';
import { X, Plus, Edit2, Trash2, Book, Users, MapPin, Bookmark } from 'lucide-react';
import type { StoryBible } from '@/types';

interface StoryBiblesListProps {
  storyBibles: StoryBible[];
  onClose: () => void;
  onNew: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function StoryBiblesList({
  storyBibles,
  onClose,
  onNew,
  onEdit,
  onDelete,
}: StoryBiblesListProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-endless-dark border border-purple-500/30 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-glow-lg">
        {/* Header */}
        <div className="p-4 border-b border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Book className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-semibold text-purple-200">Story Bibles</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* New Story Bible Button */}
          <button
            onClick={onNew}
            className="w-full mb-4 flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all"
          >
            <Plus className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300">Create New Story Bible</span>
          </button>

          {/* Story Bibles List */}
          {storyBibles.length === 0 ? (
            <div className="text-center py-12">
              <Book className="w-16 h-16 mx-auto text-purple-500/30 mb-4" />
              <p className="text-gray-400 mb-2">No Story Bibles yet</p>
              <p className="text-gray-500 text-sm">
                Create one to maintain consistency across your stories
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {storyBibles.map((sb) => (
                <div
                  key={sb.id}
                  className="card-dream p-4 group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-purple-200 truncate">
                        {sb.name || 'Untitled'}
                      </h3>
                      {sb.description && (
                        <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                          {sb.description}
                        </p>
                      )}

                      {/* Stats */}
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {sb.characters.length} characters
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {sb.worldBuilding.length} world elements
                        </span>
                        <span className="flex items-center gap-1">
                          <Bookmark className="w-3 h-3" />
                          {sb.plotPoints.length} plot points
                        </span>
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        {sb.genre && <span className="text-purple-400">{sb.genre}</span>}
                        <span>Updated {formatDate(sb.updatedAt)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(sb.id)}
                        className="p-2 hover:bg-purple-500/20 rounded-lg text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(sb.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
