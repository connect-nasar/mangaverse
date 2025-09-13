import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Eye, Calendar } from 'lucide-react';
import { Manga } from '../lib/apiService';

interface MangaCardProps {
  manga: Manga;
}

const MangaCard: React.FC<MangaCardProps> = ({ manga }) => {
  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <Link to={`/manga/${manga.id}`}>
        <div className="relative">
          <img
            src={manga.coverImage}
            alt={manga.title}
            className="w-full h-48 object-contain bg-gray-100 dark:bg-gray-700 transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Status Badge */}
          <div className="absolute top-2 left-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              manga.status === 'Ongoing' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-500 text-white'
            }`}>
              {manga.status}
            </span>
          </div>

          {/* Rating */}
          <div className="absolute bottom-2 right-2 flex items-center space-x-1 bg-black/70 rounded-full px-2 py-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-white text-xs font-medium">{manga.rating}</span>
          </div>
        </div>

        <div className="p-3">
          <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-orange-500 transition-colors">
            {manga.title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">
            by {manga.author}
          </p>

          <div className="flex flex-wrap gap-1 mb-2">
            {manga.genre.slice(0, 2).map((g) => (
              <span
                key={g}
                className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs rounded-full"
              >
                {g}
              </span>
            ))}
            {manga.genre.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                +{manga.genre.length - 2}
              </span>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-xs mb-2 line-clamp-2">
            {manga.description}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{manga.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(manga.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MangaCard;