import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import MangaCard from '../components/MangaCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useData } from '../contexts/DataContext';

const HomePage: React.FC = () => {
  const { manga, loading, error } = useData();

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

  const featuredManga = manga.slice(0, 3);
  const latestManga = manga.slice(0, 6);

  return (
    <>
      <Helmet>
        <title>Manga madness - Read Featured & Latest Manga Online</title>
        <meta name="description" content="Discover handpicked featured manga and the latest updates. Read manga online for free on Manga madness." />
        <meta property="og:title" content="Manga madness - Read Featured & Latest Manga Online" />
        <meta property="og:description" content="Discover handpicked featured manga and the latest updates. Read manga online for free on Manga madness." />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="min-h-screen">
      {/* Featured Manga */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Featured Manga</h2>
              <p className="text-gray-600 dark:text-gray-400">Handpicked stories you shouldn't miss</p>
            </div>
            <Link
              to="/all-manga"
              className="text-orange-500 hover:text-orange-600 flex items-center group"
            >
              View All
              <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {featuredManga.map((manga, index) => (
              <div key={manga.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                <MangaCard manga={manga} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Updates */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                <Clock className="w-8 h-8 mr-3 text-orange-500" />
                Latest Updates
              </h2>
              <p className="text-gray-600 dark:text-gray-400">Fresh chapters from your favorite series</p>
            </div>
            <Link
              to="/all-manga"
              className="text-orange-500 hover:text-orange-600 flex items-center group"
            >
              View All
              <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {latestManga.map((manga, index) => (
              <div key={manga.id} className="animate-slideInLeft" style={{ animationDelay: `${index * 0.1}s` }}>
                <MangaCard manga={manga} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default HomePage;