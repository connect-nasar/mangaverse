import { MongoClient, Db, Collection } from 'mongodb';

const uri = 'mongodb+srv://hackerboyhun:Vkh7pSb0oBOKflxB@cluster0.6hucowd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'mangaverse';

let client: MongoClient;
let db: Db;

export async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
  }
  return { client, db };
}

export interface Manga {
  _id?: string;
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
  _id?: string;
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
  _id?: string;
  id: string;
  mangaId: string;
  name: string;
  message: string;
  createdAt: Date;
}

export class MangaService {
  private mangaCollection: Collection<Manga>;
  private chapterCollection: Collection<Chapter>;
  private commentCollection: Collection<Comment>;

  constructor(db: Db) {
    this.mangaCollection = db.collection<Manga>('manga');
    this.chapterCollection = db.collection<Chapter>('chapters');
    this.commentCollection = db.collection<Comment>('comments');
  }

  // Manga methods
  async getAllManga(): Promise<Manga[]> {
    return await this.mangaCollection.find({}).sort({ updatedAt: -1 }).toArray();
  }

  async getMangaById(id: string): Promise<Manga | null> {
    return await this.mangaCollection.findOne({ id });
  }

  async createManga(manga: Omit<Manga, '_id' | 'createdAt' | 'updatedAt'>): Promise<Manga> {
    const now = new Date();
    const newManga = {
      ...manga,
      createdAt: now,
      updatedAt: now
    };
    const result = await this.mangaCollection.insertOne(newManga);
    return { ...newManga, _id: result.insertedId.toString() };
  }

  async updateManga(id: string, updates: Partial<Manga>): Promise<boolean> {
    const result = await this.mangaCollection.updateOne(
      { id },
      { $set: { ...updates, updatedAt: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  async deleteManga(id: string): Promise<boolean> {
    const result = await this.mangaCollection.deleteOne({ id });
    return result.deletedCount > 0;
  }

  async incrementViews(id: string): Promise<void> {
    await this.mangaCollection.updateOne(
      { id },
      { $inc: { views: 1 } }
    );
  }

  // Chapter methods
  async getChaptersByMangaId(mangaId: string): Promise<Chapter[]> {
    return await this.chapterCollection.find({ mangaId }).sort({ number: 1 }).toArray();
  }

  async getChapterById(id: string): Promise<Chapter | null> {
    return await this.chapterCollection.findOne({ id });
  }

  async createChapter(chapter: Omit<Chapter, '_id' | 'createdAt' | 'updatedAt'>): Promise<Chapter> {
    const now = new Date();
    const newChapter = {
      ...chapter,
      createdAt: now,
      updatedAt: now
    };
    const result = await this.chapterCollection.insertOne(newChapter);
    
    // Update manga's lastUpdated
    await this.mangaCollection.updateOne(
      { id: chapter.mangaId },
      { $set: { updatedAt: now } }
    );
    
    return { ...newChapter, _id: result.insertedId.toString() };
  }

  async updateChapter(id: string, updates: Partial<Chapter>): Promise<boolean> {
    const result = await this.chapterCollection.updateOne(
      { id },
      { $set: { ...updates, updatedAt: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  async deleteChapter(id: string): Promise<boolean> {
    const result = await this.chapterCollection.deleteOne({ id });
    return result.deletedCount > 0;
  }

  // Comment methods
  async getCommentsByMangaId(mangaId: string): Promise<Comment[]> {
    return await this.commentCollection.find({ mangaId }).sort({ createdAt: -1 }).toArray();
  }

  async createComment(comment: Omit<Comment, '_id' | 'createdAt'>): Promise<Comment> {
    const newComment = {
      ...comment,
      createdAt: new Date()
    };
    const result = await this.commentCollection.insertOne(newComment);
    return { ...newComment, _id: result.insertedId.toString() };
  }

  async deleteComment(id: string): Promise<boolean> {
    const result = await this.commentCollection.deleteOne({ id });
    return result.deletedCount > 0;
  }
}