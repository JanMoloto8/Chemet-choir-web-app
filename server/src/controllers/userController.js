// controllers/userController.js
import { db } from '../config/firebaseAdmin.js';

export const getUsers = async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').get();

    if (usersSnapshot.empty) {
      return res.status(404).json({ message: 'No users found' });
    }

    const users = usersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        uid: doc.id,
        username: data.username,
        role:data.role,
        Part:data.voicePart
        // Add other fields you want to include, like email, role, etc.
      };
    });

    return res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
