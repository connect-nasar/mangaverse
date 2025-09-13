const express = require('express');
const cors = require('cors');
const { connectToDatabase, getDatabase } = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/manga', async (req, res) => {
  try {
    const db = getDatabase();
    const manga = await db.collection('manga').find({}).toArray();
    res.json(manga);
  } catch (error) {
    console.error('Error fetching manga:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/manga/:id', async (req, res) => {
  try {
    const db = getDatabase();
    const manga = await db.collection('manga').findOne({ id: req.params.id });
    if (!manga) {
      return res.status(404).json({ error: 'Manga not found' });
    }
    res.json(manga);
  } catch (error) {
    console.error('Error fetching manga:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/manga/:id/chapters', async (req, res) => {
  try {
    const db = getDatabase();
    const chapters = await db.collection('chapters').find({ mangaId: req.params.id }).toArray();
    res.json(chapters);
  } catch (error) {
    console.error('Error fetching chapters:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/chapters/:id', async (req, res) => {
  try {
    const db = getDatabase();
    const chapter = await db.collection('chapters').findOne({ id: req.params.id });
    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    res.json(chapter);
  } catch (error) {
    console.error('Error fetching chapter:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST routes
app.post('/api/manga/:id/views', async (req, res) => {
  try {
    const db = getDatabase();
    await db.collection('manga').updateOne(
      { id: req.params.id },
      { $inc: { views: 1 } }
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error incrementing views:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/manga/:id/comments', async (req, res) => {
  try {
    const db = getDatabase();
    const comments = await db.collection('comments').find({ mangaId: req.params.id }).toArray();
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/comments', async (req, res) => {
  try {
    const db = getDatabase();
    const comment = {
      ...req.body,
      createdAt: new Date()
    };
    await db.collection('comments').insertOne(comment);
    res.json({ success: true });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/comments/:id', async (req, res) => {
  try {
    const db = getDatabase();
    await db.collection('comments').deleteOne({ id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/manga', async (req, res) => {
  try {
    const db = getDatabase();
    const manga = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await db.collection('manga').insertOne(manga);
    const createdManga = await db.collection('manga').findOne({ _id: result.insertedId });
    res.json(createdManga);
  } catch (error) {
    console.error('Error creating manga:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/manga/:id', async (req, res) => {
  try {
    const db = getDatabase();
    console.log('PUT /api/manga/:id called');
    console.log('ID:', req.params.id);
    console.log('Body:', req.body);
    // Remove _id from update payload
    const { _id, ...updateData } = req.body;
    const result = await db.collection('manga').updateOne(
      { id: req.params.id },
      { 
        $set: { 
          ...updateData,
          updatedAt: new Date()
        }
      }
    );
    console.log('MongoDB update result:', result);
    if (result.matchedCount === 0) {
      console.error('No manga found with id:', req.params.id);
      return res.status(404).json({ error: 'No manga found to update.' });
    }
    if (result.modifiedCount === 0) {
      console.error('Manga found but not modified:', req.params.id);
      return res.status(400).json({ error: 'Manga not modified.' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating manga:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/manga/:id', async (req, res) => {
  try {
    const db = getDatabase();
    await db.collection('manga').deleteOne({ id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting manga:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/chapters', async (req, res) => {
  try {
    const db = getDatabase();
    const chapter = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await db.collection('chapters').insertOne(chapter);
    const createdChapter = await db.collection('chapters').findOne({ _id: result.insertedId });
    res.json(createdChapter);
  } catch (error) {
    console.error('Error creating chapter:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/chapters/:id', async (req, res) => {
  try {
    const db = getDatabase();
    await db.collection('chapters').updateOne(
      { id: req.params.id },
      { 
        $set: { 
          ...req.body,
          updatedAt: new Date()
        }
      }
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating chapter:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/chapters/:id', async (req, res) => {
  try {
    const db = getDatabase();
    await db.collection('chapters').deleteOne({ id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting chapter:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
async function startServer() {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
