import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { Star, Eye, Calendar, User, Tag, BookOpen, Clock, RefreshCw } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Manga, Chapter } from '../lib/mongodb';
import CommentSection from '../components/CommentSection';
import LoadingSpinner from '../components/LoadingSpinner';

const MangaDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getMangaWithChapters, serviceReady, loading: contextLoading } = useData();
  const [manga, setManga] = useState<Manga | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (id && serviceReady) {
      loadMangaData();
    }
  }, [id, serviceReady]);

  const loadMangaData = async () => {
    if (!id || !serviceReady) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { manga: mangaData, chapters: chaptersData } = await getMangaWithChapters(id);
      
      if (!mangaData) {
        setError('Manga not found');
      } else {
        setManga(mangaData);
        setChapters(chaptersData);
      }
    } catch (error) {
      console.error('Error loading manga data:', error);
      setError('Failed to load manga data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(0);
    setError(null);
    loadMangaData();
  };

  // Show loading spinner if context is still loading or if we're loading manga data
  if (contextLoading || loading) return <LoadingSpinner />;

  if (error || !manga) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || 'Manga not found'}
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRetry}
              className="flex items-center justify-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </button>
            <Link 
              to="/all-manga" 
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
            >
              Return to all manga
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{manga.title} - Read Online | Manga madness</title>
        <meta name="description" content={manga.description?.slice(0, 160) || 'Read manga online on Manga madness.'} />
        <meta property="og:title" content={`${manga.title} - Read Online | Manga madness`} />
        <meta property="og:description" content={manga.description?.slice(0, 160) || 'Read manga online on Manga madness.'} />
        <meta property="og:type" content="article" />
        {manga.coverImage && <meta property="og:image" content={manga.coverImage} />}
      </Helmet>
      <div className="min-h-screen py-8">
      {/* Banner Section */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 flex items-end justify-center overflow-hidden">
        {/* Blurred, zoomed background */}
        <div
          className="absolute inset-0 w-full h-full bg-center bg-cover scale-110 blur-md brightness-75"
          style={{
            backgroundImage: `url(${manga.coverImage})`,
          }}
          aria-hidden="true"
        />
        {/* Overlay for darkening */}
        <div className="absolute inset-0 bg-black/60" />
        {/* Info Card */}
        <div className="relative z-10 flex flex-col items-center w-full max-w-2xl mx-auto px-4 pb-6">
          <div className="flex flex-col items-center md:flex-row md:items-end gap-6 w-full">
            <img
              src={manga.coverImage}
              alt={manga.title}
              className="w-40 h-56 object-cover rounded-xl shadow-lg border-4 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-700 -mt-20 md:mt-0"
            />
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex gap-2 mb-2">
                {manga.alternativeTitles.length > 0 && (
                  <span className="px-3 py-1 bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-full text-xs font-semibold">
                    {manga.alternativeTitles[0]}
                  </span>
                )}
                <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-semibold">
                  {manga.status}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 drop-shadow-lg">{manga.title}</h1>
              <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start mb-3">
                <div className="flex items-center gap-1 text-white/90">
                  <User className="w-5 h-5" />
                  <span className="font-medium">{manga.author}</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-5 h-5" />
                  <span className="font-medium">{manga.rating}/10</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="px-2 py-1 bg-green-500 text-white rounded-full text-xs font-semibold">{manga.status}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
                {manga.genre.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-semibold"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {chapters.length > 0 && (
                  <>
                    <Link
                      to={`/manga/${manga.id}/chapter/${chapters[0]?.id}`}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center"
                    >
                      <BookOpen className="w-5 h-5 mr-2" />
                      Read First
                    </Link>
                    <Link
                      to={`/manga/${manga.id}/chapter/${chapters[chapters.length - 1]?.id}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center"
                    >
                      <BookOpen className="w-5 h-5 mr-2" />
                      Read Last
                    </Link>
                    <Link
                      to={`/manga/${manga.id}/chapter/${chapters[0]?.id}`}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center"
                    >
                      <BookOpen className="w-5 h-5 mr-2" />
                      Start Reading
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Description */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Synopsis</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{manga.description}</p>
        </div>

        {/* Chapters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Chapters</h2>
          </div>
          <div className="p-6">
            {chapters.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No chapters available yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {chapters.map((chapter) => (
                  <Link
                    key={chapter.id}
                    to={`/manga/${manga.id}/chapter/${chapter.id}`}
                    className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Chapter {chapter.number}: {chapter.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(chapter.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {chapter.pages.length} pages
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <CommentSection mangaId={manga.id} />
      </div>
    </div>
    </>
  );
};

export default MangaDetailsPage;