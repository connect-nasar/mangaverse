import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Manga, Chapter } from '../lib/apiService';
import ChapterSelector from '../components/ChapterSelector';
import LoadingSpinner from '../components/LoadingSpinner';

const ChapterReaderPage: React.FC = () => {
  const { id, chapterId } = useParams<{ id: string; chapterId: string }>();
  const navigate = useNavigate();
  const { getMangaWithChapters, serviceReady, loading: contextLoading } = useData();
  const [manga, setManga] = useState<Manga | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);

  useEffect(() => {
    if (id && serviceReady) {
      loadData();
    }
  }, [id, serviceReady]);

  useEffect(() => {
    if (chapters.length > 0 && chapterId) {
      const chapter = chapters.find(ch => ch.id === chapterId);
      setCurrentChapter(chapter || null);
    }
  }, [chapters, chapterId]);

  // Hide/show header on scroll
  useEffect(() => {
    const el = contentRef.current;
    function handleScroll() {
      if (el && el.scrollTop === 0) {
        setShowHeader(true);
      } else if (el && el.scrollTop > 0) {
        setShowHeader(false);
      }
    }
    function handleWindowScroll() {
      if (window.scrollY === 0) {
        setShowHeader(true);
      } else if (window.scrollY > 0) {
        setShowHeader(false);
      }
    }
    if (el) {
      el.addEventListener('scroll', handleScroll);
    }
    window.addEventListener('scroll', handleWindowScroll);
    return () => {
      if (el) el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, [contentRef]);

  // Scroll to top when chapter changes
  useEffect(() => {
    const el = contentRef.current;
    if (el) {
      el.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [currentChapter]);

  const loadData = async () => {
    if (!id || !serviceReady) return;
    try {
      setLoading(true);
      const { manga: mangaData, chapters: chaptersData } = await getMangaWithChapters(id);
      setManga(mangaData);
      setChapters(chaptersData.sort((a, b) => a.number - b.number));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner if context is still loading or if we're loading chapter data
  if (contextLoading || loading || !serviceReady) return <LoadingSpinner />;

  // Only show error if chapters are loaded and chapter is not found
  if (!manga || !currentChapter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Chapter not found</h1>
          <Link to="/all-manga" className="text-orange-500 hover:text-orange-600">
            Return to catalog
          </Link>
        </div>
      </div>
    );
  }

  const currentChapterIndex = chapters.findIndex(ch => ch.id === chapterId);
  const nextChapter = chapters[currentChapterIndex + 1];
  const prevChapter = chapters[currentChapterIndex - 1];

  // Navigation buttons (top and bottom)
  const NavButtons = () => (
    <div className="my-4">
      {/* Home button always above, centered */}
      <div className="flex justify-center mb-2">
        <Link
          to="/"
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
        >
          <Home className="w-6 h-6" />
        </Link>
      </div>
      <div className="flex flex-row items-center justify-center gap-x-4 w-full">
        {/* Previous Chapter */}
        {prevChapter && (
          <Link
            to={`/manga/${id}/chapter/${prevChapter.id}`}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors min-w-[120px] justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Previous</span>
          </Link>
        )}
        {/* Chapter Selector */}
        <div className="flex-shrink-0" style={{ minWidth: 130 }}>
          <ChapterSelector
            chapters={chapters}
            currentChapterId={currentChapter.id}
            mangaId={id || ''}
          />
        </div>
        {/* Next Chapter */}
        {nextChapter && (
          <Link
            to={`/manga/${id}/chapter/${nextChapter.id}`}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors min-w-[120px] justify-center"
          >
            <span className="hidden sm:inline">Next</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Top Navigation/Header - REMOVED for immersive reading */}
      {/* (No fixed header here) */}

      {/* Main Content - All Images */}
      <div className="pt-20 pb-20 overflow-y-auto" ref={contentRef} style={{ maxHeight: '100vh' }}>
        {/* Top Nav Buttons */}
        <NavButtons />
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          {currentChapter.pages.map((page, index) => (
            <div key={index} className="flex justify-center">
              <img
                src={page}
                alt={`Page ${index + 1}`}
                className="w-full h-auto max-w-full object-contain cursor-pointer"
              />
            </div>
          ))}
        </div>
        {/* Bottom Nav Buttons */}
        <NavButtons />
        <div className="text-center text-gray-400 text-sm mt-4">
          Chapter {currentChapter.number} of {chapters.length}
        </div>
      </div>
    </div>
  );
};

export default ChapterReaderPage;