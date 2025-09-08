// controllers/dashboardController.js
import { db } from '../config/firebaseAdmin.js';

export const getUserCount = async (req, res) => {
  try {
    const snapshot = await db.collection('users').get(); 
    const userCount = snapshot.size;

    res.status(200).json({
      success: true,
      count: userCount,
    });
  } catch (error) {
    console.error('Error fetching user count:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getSongCount = async (req, res) => {
  try {
    const snapshot = await db.collection('songs').get();
    const songCount = snapshot.size; // number of documents in the 'songs' collection

    res.status(200).json({
      success: true,
      count: songCount,
    });
  } catch (error) {
    console.error('Error fetching song count:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getSongComplete = async (req, res) => {
  try {
    const snapshot1 = await db.collection('songs').get();
    const snapshot = await db.collection('songs').where('status', '==', 'complete').get();
    const songCount = snapshot1.size;
    const complete = snapshot.size;
    res.status(200).json({
      success: true,
      count: `${complete}/${songCount}`,
    });
  } catch (error) {
    console.error('Error fetching song count:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getUpcomingEventCount = async (req, res) => {
  try {
    const now = new Date();

    const snapshot = await db.collection('events')
      .where('eventDateTime', '>=', now)
      .get();

    const count = snapshot.size;

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error('Error counting upcoming events:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};