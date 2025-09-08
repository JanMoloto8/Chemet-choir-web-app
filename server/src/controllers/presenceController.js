import {db} from '../config/firebaseAdmin.js';
import { Timestamp } from 'firebase-admin/firestore';
// Function to get users by part
export const getUsersByPart = async (req, res) => {
  try {
    const { voicePart } = req.query; // Get 'part' from query parameters
    
    if (!voicePart) {
      return res.status(400).json({ message: 'Part parameter is required' });
    }

    const usersSnapshot = await db.collection('users')
      .where('voicePart', '==', voicePart)
      .get();

    if (usersSnapshot.empty) {
      return res.status(404).json({ message: 'No users found' });
    }


    const users = usersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        uid: doc.id,
        username: data.username
        
      };
    });

    return res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Register presence for a specific voicePart
export const registerPresence = async (req, res) => {
  try {
    const { voicePart, present, absent } = req.body;

    if (!voicePart) {
      return res.status(400).json({ message: "voicePart is required" });
    }

    // Default to empty arrays if not provided
    const presenceData = {
      voicePart,
      present: present || [],
      absent: absent || [],
      createdAt: new Date().toISOString(),
    };

    const newDoc = await db.collection("presence").add(presenceData);

    return res.status(201).json({
      message: "Presence record created successfully",
      id: newDoc.id,
      data: presenceData,
    });
  } catch (error) {
    console.error("Error registering presence:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getPresenceByVoicePart = async (req, res) => {
  try {
    const { voicePart } = req.query;

    if (!voicePart) {
      return res.status(400).json({ message: "voicePart parameter is required" });
    }

    // Get today's date string (YYYY-MM-DD)
    const today = new Date().toISOString().split("T")[0];

    // Query Firestore by voicePart only
    const presenceSnapshot = await db.collection("presence")
      .where("voicePart", "==", voicePart)
      .get();

    if (presenceSnapshot.empty) {
      return res.status(404).json({ message: "No presence records found for this voicePart" });
    }

    // Filter by date only (ignore hours/minutes)
    const records = presenceSnapshot.docs
      .map(doc => {
        const data = doc.data();
        const createdAt =  data.createdAt;
        const createdAtDate = createdAt ? createdAt.split("T")[0] : null;
       
        return {
          voicePart: data.voicePart,
          present: data.present || [],
          absent: data.absent || [],
          createdAt: createdAt,
          createdAtDate: createdAtDate
        };
      })
      .filter(record => record.createdAtDate === today);

    if (records.length === 0) {
      return res.status(404).json({ message: "No records for today" });
    }

    return res.status(200).json({ records });
  } catch (error) {
    console.error("Error fetching presence summary:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
