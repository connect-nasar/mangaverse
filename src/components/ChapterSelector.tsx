import React, { useState } from 'react';
import { ChevronDown, BookOpen, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Chapter } from '../lib/mongodb';

interface ChapterSelectorProps {
  chapters: Chapter[];
  currentChapterId: string;
  mangaId: string;
}

const ChapterSelector: React.FC<ChapterSelectorProps> = ({ chapters, currentChapterId, mangaId }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const currentChapter = chapters.find(ch => ch.id === currentChapterId);
  const sortedChapters = [...chapters].sort((a, b) => a.number - b.number);

  return (
    <>
      {/* Chapter Selector Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
      >
        <BookOpen className="w-4 h-4" />
        <span>Ch. {currentChapter?.number}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select Chapter</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Chapter List */}
            <div className="overflow-y-auto max-h-96">
              {sortedChapters.map((chapter) => (
                <Link
                  key={chapter.id}
                  to={`/manga/${mangaId}/chapter/${chapter.id}`}
                  onClick={() => setIsOpen(false)}
                  className={`block p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    chapter.id === currentChapterId ? 'bg-orange-50 dark:bg-orange-900/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-medium ${
                        chapter.id === currentChapterId 
                          ? 'text-orange-600 dark:text-orange-400' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        Chapter {chapter.number}: {chapter.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(chapter.date).toLocaleDateString()}
                      </p>
                    </div>
                    {chapter.id === currentChapterId && (
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChapterSelector;