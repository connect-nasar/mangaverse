const API_BASE_URL = 'http://localhost:5000/api';

export interface Manga {
  id: string;
  title: string;
  author: string;
  genre: string[];
  rating: number;
  views: number;
  coverImage: string;
  status: string;
  lastUpdated: string;
  description: string;
  year: number;
  alternativeTitles: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Chapter {
  id: string;
  mangaId: string;
  title: string;
  number: number;
  date: string;
  pages: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  mangaId: string;
  name: string;
  message: string;
  createdAt: Date;
}

export class ApiService {
  async getAllManga(): Promise<Manga[]> {
    try {
      console.log('Fetching all manga from:', `${API_BASE_URL}/manga`);
      const response = await fetch(`${API_BASE_URL}/manga`);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        console.error('Failed to fetch manga. Status:', response.status);
        throw new Error(`Failed to fetch manga: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Manga data received:', data.length, 'items');
      return data;
    } catch (error) {
      console.error('Error in getAllManga:', error);
      throw error;
    }
  }

  async getMangaById(id: string): Promise<Manga | null> {
    try {
      console.log('Fetching manga by ID:', id);
      const response = await fetch(`${API_BASE_URL}/manga/${id}`);
      console.log('Response status:', response.status);
      
      if (response.status === 404) return null;
      if (!response.ok) {
        console.error('Failed to fetch manga. Status:', response.status);
        throw new Error(`Failed to fetch manga: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Manga data received:', data);
      return data;
    } catch (error) {
      console.error('Error in getMangaById:', error);
      throw error;
    }
  }

  async incrementViews(id: string): Promise<void> {
    try {
      console.log('Incrementing views for manga:', id);
      const response = await fetch(`${API_BASE_URL}/manga/${id}/views`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        console.error('Failed to increment views. Status:', response.status);
        throw new Error(`Failed to increment views: ${response.status}`);
      }
      
      console.log('Views incremented successfully');
    } catch (error) {
      console.error('Error in incrementViews:', error);
      throw error;
    }
  }

  async getChaptersByMangaId(mangaId: string): Promise<Chapter[]> {
    try {
      console.log('Fetching chapters for manga:', mangaId);
      const response = await fetch(`${API_BASE_URL}/manga/${mangaId}/chapters`);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        console.error('Failed to fetch chapters. Status:', response.status);
        throw new Error(`Failed to fetch chapters: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Chapters data received:', data.length, 'chapters');
      return data;
    } catch (error) {
      console.error('Error in getChaptersByMangaId:', error);
      throw error;
    }
  }

  async getChapterById(id: string): Promise<Chapter | null> {
    try {
      console.log('Fetching chapter by ID:', id);
      const response = await fetch(`${API_BASE_URL}/chapters/${id}`);
      console.log('Response status:', response.status);
      
      if (response.status === 404) return null;
      if (!response.ok) {
        console.error('Failed to fetch chapter. Status:', response.status);
        throw new Error(`Failed to fetch chapter: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Chapter data received:', data);
      return data;
    } catch (error) {
      console.error('Error in getChapterById:', error);
      throw error;
    }
  }

  async getCommentsByMangaId(mangaId: string): Promise<Comment[]> {
    try {
      console.log('Fetching comments for manga:', mangaId);
      const response = await fetch(`${API_BASE_URL}/manga/${mangaId}/comments`);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        console.error('Failed to fetch comments. Status:', response.status);
        throw new Error(`Failed to fetch comments: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Comments data received:', data.length, 'comments');
      return data;
    } catch (error) {
      console.error('Error in getCommentsByMangaId:', error);
      throw error;
    }
  }

  async createComment(comment: Omit<Comment, 'createdAt'>): Promise<void> {
    try {
      console.log('Creating comment:', comment);
      const response = await fetch(`${API_BASE_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(comment)
      });
      
      if (!response.ok) {
        console.error('Failed to create comment. Status:', response.status);
        throw new Error(`Failed to create comment: ${response.status}`);
      }
      
      console.log('Comment created successfully');
    } catch (error) {
      console.error('Error in createComment:', error);
      throw error;
    }
  }

  async createManga(manga: Omit<Manga, 'createdAt' | 'updatedAt'>): Promise<Manga> {
    try {
      console.log('Creating manga:', manga);
      const response = await fetch(`${API_BASE_URL}/manga`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(manga)
      });
      
      if (!response.ok) {
        console.error('Failed to create manga. Status:', response.status);
        throw new Error(`Failed to create manga: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Manga created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in createManga:', error);
      throw error;
    }
  }

  async updateManga(id: string, updates: Partial<Manga>): Promise<boolean> {
    try {
      console.log('Updating manga:', id, updates);
      const response = await fetch(`${API_BASE_URL}/manga/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
      
      console.log('Update response status:', response.status);
      return response.ok;
    } catch (error) {
      console.error('Error in updateManga:', error);
      throw error;
    }
  }

  async deleteManga(id: string): Promise<boolean> {
    try {
      console.log('Deleting manga:', id);
      const response = await fetch(`${API_BASE_URL}/manga/${id}`, {
        method: 'DELETE'
      });
      
      console.log('Delete response status:', response.status);
      return response.ok;
    } catch (error) {
      console.error('Error in deleteManga:', error);
      throw error;
    }
  }

  async createChapter(chapter: Omit<Chapter, 'createdAt' | 'updatedAt'>): Promise<Chapter> {
    try {
      console.log('Creating chapter:', chapter);
      const response = await fetch(`${API_BASE_URL}/chapters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(chapter)
      });
      
      if (!response.ok) {
        console.error('Failed to create chapter. Status:', response.status);
        throw new Error(`Failed to create chapter: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Chapter created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in createChapter:', error);
      throw error;
    }
  }

  async updateChapter(id: string, updates: Partial<Chapter>): Promise<boolean> {
    try {
      console.log('Updating chapter:', id, updates);
      const response = await fetch(`${API_BASE_URL}/chapters/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
      
      console.log('Update response status:', response.status);
      return response.ok;
    } catch (error) {
      console.error('Error in updateChapter:', error);
      throw error;
    }
  }

  async deleteChapter(id: string): Promise<boolean> {
    try {
      console.log('Deleting chapter:', id);
      const response = await fetch(`${API_BASE_URL}/chapters/${id}`, {
        method: 'DELETE'
      });
      
      console.log('Delete response status:', response.status);
      return response.ok;
    } catch (error) {
      console.error('Error in deleteChapter:', error);
      throw error;
    }
  }

  async deleteComment(id: string): Promise<boolean> {
    try {
      console.log('Deleting comment:', id);
      const response = await fetch(`${API_BASE_URL}/comments/${id}`, {
        method: 'DELETE'
      });
      
      console.log('Delete response status:', response.status);
      return response.ok;
    } catch (error) {
      console.error('Error in deleteComment:', error);
      throw error;
    }
  }
}