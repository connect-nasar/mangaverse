import React, { createContext, useContext, useEffect, useState } from 'react';
import { ApiService, Manga, Chapter, Comment } from '../lib/apiService';

interface DataContextType {
  mangaService: ApiService | null;
  manga: Manga[];
  loading: boolean;
  error: string | null;
  serviceReady: boolean;
  refreshManga: () => Promise<void>;
  getMangaWithChapters: (id: string) => Promise<{ manga: Manga | null; chapters: Chapter[] }>;
  getComments: (mangaId: string) => Promise<Comment[]>;
  addComment: (mangaId: string, name: string, message: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mangaService, setMangaService] = useState<ApiService | null>(null);
  const [manga, setManga] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serviceReady, setServiceReady] = useState(false);

  useEffect(() => {
    initializeService();
  }, []);

  const initializeService = async () => {
    try {
      setLoading(true);
      setError(null);
      setServiceReady(false);
      
      // Create the service
      const service = new ApiService();
      setMangaService(service);
      
      // Test the service by fetching manga data
      console.log('Initializing manga service...');
      const mangaData = await service.getAllManga();
      console.log('Manga data fetched successfully:', mangaData.length, 'manga found');
      
      setManga(mangaData);
      setServiceReady(true);
      setError(null);
    } catch (err) {
      console.error('API service initialization error:', err);
      setError('Failed to connect to server. Please check if the backend is running.');
      setServiceReady(false);
    } finally {
      setLoading(false);
    }
  };

  const refreshManga = async () => {
    if (!mangaService || !serviceReady) {
      console.log('Service not ready, cannot refresh manga');
      return;
    }
    try {
      setLoading(true);
      const mangaData = await mangaService.getAllManga();
      setManga(mangaData);
      setError(null);
    } catch (err) {
      console.error('Error refreshing manga:', err);
      setError('Failed to refresh manga data');
    } finally {
      setLoading(false);
    }
  };

  const getMangaWithChapters = async (id: string) => {
    if (!mangaService || !serviceReady) {
      console.log('MangaService not ready, returning empty result');
      return { manga: null, chapters: [] };
    }
    
    try {
      const manga = await mangaService.getMangaById(id);
      const chapters = manga ? await mangaService.getChaptersByMangaId(id) : [];
      
      // Increment views
      if (manga) {
        try {
          await mangaService.incrementViews(id);
        } catch (viewError) {
          console.error('Error incrementing views:', viewError);
          // Don't fail the entire request if view increment fails
        }
      }
      
      return { manga, chapters };
    } catch (err) {
      console.error('Error fetching manga with chapters:', err);
      return { manga: null, chapters: [] };
    }
  };

  const getComments = async (mangaId: string): Promise<Comment[]> => {
    if (!mangaService || !serviceReady) return [];
    try {
      return await mangaService.getCommentsByMangaId(mangaId);
    } catch (err) {
      console.error('Error fetching comments:', err);
      return [];
    }
  };

  const addComment = async (mangaId: string, name: string, message: string) => {
    if (!mangaService || !serviceReady) {
      throw new Error('Service not ready');
    }
    try {
      await mangaService.createComment({
        id: Date.now().toString(),
        mangaId,
        name,
        message
      });
    } catch (err) {
      console.error('Error adding comment:', err);
      throw err;
    }
  };

  return (
    <DataContext.Provider value={{
      mangaService,
      manga,
      loading,
      error,
      serviceReady,
      refreshManga,
      getMangaWithChapters,
      getComments,
      addComment
    }}>
      {children}
    </DataContext.Provider>
  );
};