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

// Mock data for development
const mockManga: Manga[] = [
  {
    id: '1',
    title: 'Dragon Quest',
    author: 'Akira Toriyama',
    genre: ['Action', 'Adventure', 'Fantasy'],
    rating: 4.8,
    views: 15420,
    coverImage: 'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'Ongoing',
    lastUpdated: '2024-01-15',
    description: 'An epic adventure following a young hero on his quest to save the world from ancient evil.',
    year: 2020,
    alternativeTitles: ['DQ', 'Dragon Adventure'],
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Mystic Warriors',
    author: 'Yuki Tanaka',
    genre: ['Action', 'Supernatural', 'Drama'],
    rating: 4.6,
    views: 12350,
    coverImage: 'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'Completed',
    lastUpdated: '2023-12-20',
    description: 'A tale of warriors with mystical powers fighting against dark forces.',
    year: 2019,
    alternativeTitles: ['MW', 'Mystic Battle'],
    createdAt: new Date('2019-03-15'),
    updatedAt: new Date('2023-12-20')
  },
  {
    id: '3',
    title: 'Starlight Academy',
    author: 'Mika Suzuki',
    genre: ['Romance', 'School', 'Drama'],
    rating: 4.7,
    views: 18920,
    coverImage: 'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'Ongoing',
    lastUpdated: '2024-01-10',
    description: 'A heartwarming story about friendship and love in a prestigious academy.',
    year: 2021,
    alternativeTitles: ['SA', 'Academy Stars'],
    createdAt: new Date('2021-02-01'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '4',
    title: 'Cyber Detective',
    author: 'Kenji Yamamoto',
    genre: ['Sci-Fi', 'Mystery', 'Action'],
    rating: 4.5,
    views: 9870,
    coverImage: 'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'Ongoing',
    lastUpdated: '2024-01-12',
    description: 'A futuristic detective story set in a cyberpunk world.',
    year: 2022,
    alternativeTitles: ['CD', 'Digital Detective'],
    createdAt: new Date('2022-05-15'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '5',
    title: 'Comedy Club',
    author: 'Hiroshi Tanaka',
    genre: ['Comedy', 'Slice of Life'],
    rating: 4.3,
    views: 7560,
    coverImage: 'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'Ongoing',
    lastUpdated: '2024-01-08',
    description: 'Hilarious adventures of a comedy club trying to make it big.',
    year: 2023,
    alternativeTitles: ['CC', 'Laugh Factory'],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-01-08')
  },
  {
    id: '6',
    title: 'Fantasy Kingdom',
    author: 'Sakura Miyamoto',
    genre: ['Fantasy', 'Adventure', 'Romance'],
    rating: 4.9,
    views: 22340,
    coverImage: 'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'Ongoing',
    lastUpdated: '2024-01-14',
    description: 'A magical kingdom where dreams come true and love conquers all.',
    year: 2020,
    alternativeTitles: ['FK', 'Kingdom Dreams'],
    createdAt: new Date('2020-08-20'),
    updatedAt: new Date('2024-01-14')
  }
];

const mockChapters: Chapter[] = [
  {
    id: '1-1',
    mangaId: '1',
    title: 'The Beginning',
    number: 1,
    date: '2024-01-01',
    pages: [
      'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '1-2',
    mangaId: '1',
    title: 'First Challenge',
    number: 2,
    date: '2024-01-15',
    pages: [
      'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
];

let mockComments: Comment[] = [
  {
    id: '1',
    mangaId: '1',
    name: 'Reader123',
    message: 'Amazing manga! Can\'t wait for the next chapter.',
    createdAt: new Date('2024-01-10')
  }
];

export class MockMangaService {
  async getAllManga(): Promise<Manga[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockManga];
  }

  async getMangaById(id: string): Promise<Manga | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockManga.find(manga => manga.id === id) || null;
  }

  async incrementViews(id: string): Promise<void> {
    const manga = mockManga.find(m => m.id === id);
    if (manga) {
      manga.views += 1;
    }
  }

  async getChaptersByMangaId(mangaId: string): Promise<Chapter[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockChapters.filter(chapter => chapter.mangaId === mangaId);
  }

  async getChapterById(id: string): Promise<Chapter | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockChapters.find(chapter => chapter.id === id) || null;
  }

  async getCommentsByMangaId(mangaId: string): Promise<Comment[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockComments.filter(comment => comment.mangaId === mangaId);
  }

  async createComment(comment: Omit<Comment, 'createdAt'>): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newComment: Comment = {
      ...comment,
      createdAt: new Date()
    };
    mockComments.push(newComment);
  }

  async createManga(manga: Omit<Manga, 'createdAt' | 'updatedAt'>): Promise<Manga> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const now = new Date();
    const newManga: Manga = {
      ...manga,
      createdAt: now,
      updatedAt: now
    };
    mockManga.push(newManga);
    return newManga;
  }

  async updateManga(id: string, updates: Partial<Manga>): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockManga.findIndex(manga => manga.id === id);
    if (index !== -1) {
      mockManga[index] = { ...mockManga[index], ...updates, updatedAt: new Date() };
      return true;
    }
    return false;
  }

  async deleteManga(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockManga.findIndex(manga => manga.id === id);
    if (index !== -1) {
      mockManga.splice(index, 1);
      return true;
    }
    return false;
  }

  async createChapter(chapter: Omit<Chapter, 'createdAt' | 'updatedAt'>): Promise<Chapter> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const now = new Date();
    const newChapter: Chapter = {
      ...chapter,
      createdAt: now,
      updatedAt: now
    };
    mockChapters.push(newChapter);
    return newChapter;
  }

  async updateChapter(id: string, updates: Partial<Chapter>): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockChapters.findIndex(chapter => chapter.id === id);
    if (index !== -1) {
      mockChapters[index] = { ...mockChapters[index], ...updates, updatedAt: new Date() };
      return true;
    }
    return false;
  }

  async deleteChapter(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockChapters.findIndex(chapter => chapter.id === id);
    if (index !== -1) {
      mockChapters.splice(index, 1);
      return true;
    }
    return false;
  }

  async deleteComment(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockComments.findIndex(comment => comment.id === id);
    if (index !== -1) {
      mockComments.splice(index, 1);
      return true;
    }
    return false;
  }
}