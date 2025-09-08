import { Router } from "express";
import admin from "../config/firebaseAdmin.js";

const router = Router();

// ----------------------------
// Login route
// ----------------------------
router.post("/login", async (req, res) => {
  const { email, password, } = req.body;

  try {
    // Call Firebase REST API for email + password login
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    const uid = data.localId;

    const userDoc = await admin.firestore().collection("users").doc(uid).get();
    
    if(!userDoc.exists){
        return res.json({error: "User does not exist in Firestore"});
    }
    
    const userData = userDoc.data();
    res.json({
      message: "Login successful",
      token: data.idToken, // or sessionCookie if using sessions
      user: { uid, email: data.email, ...userData },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ----------------------------
// Optional: Register route
// ----------------------------
router.post("/register", async (req, res) => {
  const { email, password,username,phoneNumber,part,codeOfConductSigned,gender,instrumentalSkills,voicePart } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    const uid = userRecord.uid;
    // 2️⃣ Add user to Firestore
    await admin.firestore().collection("users").doc(uid).set({
      email,
      username,       // default empty, you can update later
      phoneNumber,
      profile: {},        // default empty object 
     codeOfConductSigned: Boolean(codeOfConductSigned),
      gender,
      instrumentalSkills:instrumentalSkills,
      role:"member",
      voicePart,  
      createdAt: admin.firestore.FieldValue.serverTimestamp(),


    });

    res.json({
      message: "User registered successfully",
      user: { email: userRecord.email, uid: userRecord.uid,username:username },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(400).json({ error: error.message });
  }
});

router.put("/update", async (req, res) => {
  try {
    const { uid, updates } = req.body;

    if (!uid || !updates || typeof updates !== "object") {
      return res.status(400).json({ error: "uid and updates object required" });
    }

    // ✅ Clean undefined values so Firestore won't throw errors
    const cleanedUpdates = {};
    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) {
        cleanedUpdates[key] = updates[key];
      }
    });

    // ✅ Update Firestore user document
    await admin.firestore().collection("users").doc(uid).update(cleanedUpdates);

    return res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({ error: error.message });
  }
});

export default router;
