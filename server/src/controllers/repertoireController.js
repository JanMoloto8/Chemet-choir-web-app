// controllers/repertoireController.js
import { db } from '../config/firebaseAdmin.js'; // named import for Firestore

export const addSong = async (req, res) => {
      console.log('Add song endpoint hit'); // ADD THIS LINE FOR DEBUGGINGb
  try {
    const {
      title,
      songwriter,
      tempo,
      key,
      category,
      link,
      status
    } = req.body;

    if (!title || !songwriter || !tempo || !key || !category || !link || !status) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    const newSong = {
      title,
      songwriter,
      tempo,
      key,
      category, // should be an array
      link,     // object with youtube/tiktok links
      status,
      createdAt: new Date(),
    };

    const docRef = await db.collection('songs').add(newSong);

    res.status(201).json({
      success: true,
      message: 'Song added successfully',
      id: docRef.id,
    });

  } catch (error) {
    console.error('Error adding song:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getSongs = async (req, res) => {
  try {
    const snapshot = await db.collection('songs').get();

    const songs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json({
      success: true,
      songs,
    });
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};