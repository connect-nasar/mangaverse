import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import MangaCard from '../components/MangaCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useData } from '../contexts/DataContext';

const AllMangaPage: React.FC = () => {
  const { manga, loading, error } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const genres = ['Action', 'Romance', 'Fantasy', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Mystery', 'Slice of Life', 'Adventure', 'Martial Arts', 'Supernatural', 'Magic', 'School'];
  const statuses = ['Ongoing', 'Completed', 'Hiatus'];

  // Initialize search query from URL parameters
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
  }, [searchParams]);

  const filteredManga = useMemo(() => {
    let filtered = [...manga];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(manga =>
        manga.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        manga.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        manga.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by genre
    if (selectedGenre) {
      filtered = filtered.filter(manga => manga.genre.includes(selectedGenre));
    }

    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter(manga => manga.status === selectedStatus);
    }

    // Sort
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
          return b.rating - a.rating;
        case 'views':
          return b.views - a.views;
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [manga, searchQuery, selectedGenre, selectedStatus, sortBy]);

  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">All Manga</h1>
          <p className="text-gray-600 dark:text-gray-400">Discover your next favorite story from our vast collection</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search manga, authors, or genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="title">Sort by Title</option>
                <option value="rating">Sort by Rating</option>
                <option value="views">Sort by Views</option>
                <option value="updated">Sort by Updated</option>
              </select>
            </div>
          </div>

          {/* View Options */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {filteredManga.length} results found
              </span>
              {(searchQuery || selectedGenre || selectedStatus) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedGenre('');
                    setSelectedStatus('');
                    setSearchParams({});
                  }}
                  className="text-sm text-orange-500 hover:text-orange-600"
                >
                  Clear filters
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7' : 'grid-cols-1'}`}>
          {filteredManga.map((manga, index) => (
            <div key={manga.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 0.05}s` }}>
              <MangaCard manga={manga} />
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredManga.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No manga found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllMangaPage;