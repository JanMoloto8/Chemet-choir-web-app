import { db } from '../config/firebaseAdmin.js';

export const addEvent = async (req, res) => {
  try {
    const {
      title,
      date,
      time,
      location,
      type,
      description
    } = req.body;

    if (!title || !date || !time || !location || !type) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be filled',
      });
    }

    // Combine date and time into one Date object
    const eventDateTime = new Date(`${date} ${time}`);

    const newEvent = {
      title,
      location,
      type,
      description: description || '',
      eventDateTime,
      createdAt: new Date(),
    };

    const docRef = await db.collection('events').add(newEvent);

    res.status(201).json({
      success: true,
      message: 'Event added successfully',
      id: docRef.id,
    });

  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getUpcomingEvents = async (req, res) => {
  try {
    const now = new Date();

    const snapshot = await db.collection('events')
      .where('eventDateTime', '>=', now)
      .orderBy('eventDateTime', 'asc')
      .get();

    const events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const snapshot = await db.collection('events')
      .orderBy('eventDateTime', 'desc') // Sort by date, newest first
      .get();

    const events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error('Error fetching all events:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const deleteEvent = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Event ID is required',
    });
  }

  try {
    const eventRef = db.collection('events').doc(id);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    await eventRef.delete();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getNextUpcomingEvent = async (req, res) => {
  try {
    const now = new Date();

    const snapshot = await db.collection('events')
      .where('eventDateTime', '>=', now)
      .orderBy('eventDateTime', 'asc')
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({
        success: false,
        message: 'No upcoming events found',
      });
    }

    const eventDoc = snapshot.docs[0];
    const event = { id: eventDoc.id, ...eventDoc.data() };

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error('Error fetching next upcoming event:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};