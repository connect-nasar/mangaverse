import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload, BookOpen, FileText } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Manga, Chapter } from '../lib/apiService';

const AdminPanel: React.FC = () => {
  const { mangaService, manga, refreshManga } = useData();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'manga' | 'chapters'>('manga');
  const [selectedManga, setSelectedManga] = useState<string>('');
  const [selectedMangaChapters, setSelectedMangaChapters] = useState<Chapter[]>([]);
  const [isAddingManga, setIsAddingManga] = useState(false);
  const [isAddingChapter, setIsAddingChapter] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newManga, setNewManga] = useState<Partial<Manga>>({
    title: '',
    author: '',
    genre: [],
    rating: 0,
    views: 0,
    coverImage: '',
    status: 'Ongoing',
    lastUpdated: '',
    description: '',
    year: new Date().getFullYear(),
    alternativeTitles: []
  });

  const [newChapter, setNewChapter] = useState<Partial<Chapter>>({
    title: '',
    number: 1,
    date: new Date().toISOString().split('T')[0],
    pages: []
  });

  const [pageUrls, setPageUrls] = useState<string>('');

  useEffect(() => {
    if (selectedManga && mangaService) {
      loadChapters();
    }
  }, [selectedManga, mangaService]);

  const loadChapters = async () => {
    if (!selectedManga || !mangaService) return;
    
    try {
      const chapters = await mangaService.getChaptersByMangaId(selectedManga);
      setSelectedMangaChapters(chapters);
      setNewChapter(prev => ({ ...prev, number: chapters.length + 1 }));
    } catch (error) {
      console.error('Error loading chapters:', error);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'uygd8gduygfutdfytyy@#$%') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  const handleAddManga = async () => {
    if (!newManga.title || !newManga.author || !mangaService) {
      alert('Please fill in required fields');
      return;
    }

    try {
      setLoading(true);
      await mangaService.createManga({
        id: Date.now().toString(),
        title: newManga.title!,
        author: newManga.author!,
        genre: newManga.genre!,
        rating: newManga.rating!,
        views: newManga.views!,
        coverImage: newManga.coverImage!,
        status: newManga.status!,
        lastUpdated: newManga.lastUpdated!,
        description: newManga.description!,
        year: newManga.year!,
        alternativeTitles: newManga.alternativeTitles!
      });

      await refreshManga();
      setIsAddingManga(false);
      setNewManga({
        title: '',
        author: '',
        genre: [],
        rating: 0,
        views: 0,
        coverImage: '',
        status: 'Ongoing',
        lastUpdated: '',
        description: '',
        year: new Date().getFullYear(),
        alternativeTitles: []
      });
      alert('Manga added successfully!');
    } catch (error) {
      console.error('Error adding manga:', error);
      alert('Failed to add manga');
    } finally {
      setLoading(false);
    }
  };

  const handleAddChapter = async () => {
    if (!selectedManga || !newChapter.title || !pageUrls || !mangaService) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await mangaService.createChapter({
        id: Date.now().toString(),
        mangaId: selectedManga,
        title: newChapter.title!,
        number: newChapter.number!,
        date: newChapter.date!,
        pages: pageUrls.split('\n').filter(url => url.trim())
      });

      await loadChapters();
      setIsAddingChapter(false);
      setNewChapter({
        title: '',
        number: selectedMangaChapters.length + 2,
        date: new Date().toISOString().split('T')[0],
        pages: []
      });
      setPageUrls('');
      alert('Chapter added successfully!');
    } catch (error) {
      console.error('Error adding chapter:', error);
      alert('Failed to add chapter');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteManga = async (id: string) => {
    if (!mangaService || !confirm('Are you sure you want to delete this manga?')) return;

    try {
      setLoading(true);
      await mangaService.deleteManga(id);
      await refreshManga();
      alert('Manga deleted successfully!');
    } catch (error) {
      console.error('Error deleting manga:', error);
      alert('Failed to delete manga');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (!mangaService || !confirm('Are you sure you want to delete this chapter?')) return;

    try {
      setLoading(true);
      await mangaService.deleteChapter(chapterId);
      await loadChapters();
      alert('Chapter deleted successfully!');
    } catch (error) {
      console.error('Error deleting chapter:', error);
      alert('Failed to delete chapter');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage manga and chapters</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('manga')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'manga'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BookOpen className="w-4 h-4 inline mr-2" />
                Manage Manga
              </button>
              <button
                onClick={() => setActiveTab('chapters')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'chapters'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Manage Chapters
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'manga' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Manga Management</h2>
                  <button
                    onClick={() => setIsAddingManga(true)}
                    disabled={loading}
                    className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Manga
                  </button>
                </div>

                {/* Add Manga Form */}
                {isAddingManga && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Manga</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Title"
                        value={newManga.title}
                        onChange={(e) => setNewManga({...newManga, title: e.target.value})}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Author"
                        value={newManga.author}
                        onChange={(e) => setNewManga({...newManga, author: e.target.value})}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Genres (comma separated)"
                        value={newManga.genre?.join(', ')}
                        onChange={(e) => setNewManga({...newManga, genre: e.target.value.split(',').map(g => g.trim())})}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <input
                        type="number"
                        placeholder="Rating"
                        step="0.1"
                        value={newManga.rating}
                        onChange={(e) => setNewManga({...newManga, rating: parseFloat(e.target.value)})}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <input
                        type="url"
                        placeholder="Cover Image URL"
                        value={newManga.coverImage}
                        onChange={(e) => setNewManga({...newManga, coverImage: e.target.value})}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <select
                        value={newManga.status}
                        onChange={(e) => setNewManga({...newManga, status: e.target.value})}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                        <option value="Hiatus">Hiatus</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Year"
                        value={newManga.year}
                        onChange={(e) => setNewManga({...newManga, year: parseInt(e.target.value)})}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Last Updated"
                        value={newManga.lastUpdated}
                        onChange={(e) => setNewManga({...newManga, lastUpdated: e.target.value})}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <textarea
                      placeholder="Description"
                      value={newManga.description}
                      onChange={(e) => setNewManga({...newManga, description: e.target.value})}
                      className="w-full mt-4 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      rows={3}
                    />
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={handleAddManga}
                        disabled={loading}
                        className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => setIsAddingManga(false)}
                        disabled={loading}
                        className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Manga List */}
                <div className="space-y-4">
                  {manga.map((mangaItem) => (
                    <div key={mangaItem.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{mangaItem.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400">by {mangaItem.author}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{mangaItem.views} views</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDeleteManga(mangaItem.id)}
                            disabled={loading}
                            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm flex items-center"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'chapters' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Chapter Management</h2>
                  <button
                    onClick={() => setIsAddingChapter(true)}
                    disabled={!selectedManga || loading}
                    className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Chapter
                  </button>
                </div>

                {/* Manga Selection */}
                <div className="mb-6">
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                    Select Manga
                  </label>
                  <select
                    value={selectedManga}
                    onChange={(e) => setSelectedManga(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Choose a manga...</option>
                    {manga.map((mangaItem) => (
                      <option key={mangaItem.id} value={mangaItem.id}>{mangaItem.title}</option>
                    ))}
                  </select>
                </div>

                {/* Add Chapter Form */}
                {isAddingChapter && selectedManga && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Chapter</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Chapter Title"
                        value={newChapter.title}
                        onChange={(e) => setNewChapter({...newChapter, title: e.target.value})}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <input
                        type="number"
                        placeholder="Chapter Number"
                        value={newChapter.number}
                        onChange={(e) => setNewChapter({...newChapter, number: parseInt(e.target.value)})}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <input
                        type="date"
                        value={newChapter.date}
                        onChange={(e) => setNewChapter({...newChapter, date: e.target.value})}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                        Page URLs (one per line)
                      </label>
                      <textarea
                        placeholder="Enter CDN image URLs, one per line..."
                        value={pageUrls}
                        onChange={(e) => setPageUrls(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        rows={6}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddChapter}
                        disabled={loading}
                        className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? 'Saving...' : 'Save Chapter'}
                      </button>
                      <button
                        onClick={() => setIsAddingChapter(false)}
                        disabled={loading}
                        className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Chapters List */}
                {selectedManga && (
                  <div className="space-y-4">
                    {selectedMangaChapters.map((chapter) => (
                      <div key={chapter.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              Chapter {chapter.number}: {chapter.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">{chapter.pages.length} pages</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{chapter.date}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDeleteChapter(chapter.id)}
                              disabled={loading}
                              className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm flex items-center"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;