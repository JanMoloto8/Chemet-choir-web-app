import { db } from "../config/firebaseAdmin.js"; // your Firestore config

// Submit Absence Document
export const submitAbsence = async (req, res) => {
  try {
    const { uid, title, date, event, status, reason, proof } = req.body;

    // Validate input
    if (!uid || !title || !date || !event || !status || !reason) {
      return res.status(400).json({ error: "All required fields must be provided." });
    }

    // Save to Firestore
    const docRef = await db.collection("absences").add({
      uid,
      title,
      date,
      event,
      status,
      reason,
      proof,
      createdAt: new Date(),
    });
    console.log(req.body);
    res.status(201).json({ message: "Absence submitted successfully", docId: docRef.uid });
  } catch (error) {
    console.error("Error submitting absence:", error);
    res.status(500).json({ error: "Failed to submit absence" });
  }
};



export const updateAbsenceStatus = async (req, res) => {
  try {
    const { uid, status } = req.body;

    if (!uid || !status) {
      return res.status(400).json({ error: "uid and status are required." });
    }

    // Query by the custom "id" field
  
    const snapshot = await db.collection("absences").where("uid", "==", uid).get();
    if (snapshot.empty) {
      return res.status(404).json({ error: "Absence not found" });
    }

    const docRef = snapshot.docs[0].ref;
    await docRef.update({ status });

    res.json({ message: "Absence status updated successfully" });
  } catch (error) {
    console.error("Error updating absence status:", error);
    res.status(500).json({ error: "Failed to update absence status" });
  }
};

export const getMyAbsences = async (req, res) => {
  try {
  const uid =req.query.uid;

    if (!uid) {
      return res.status(400).json({ error: "uid is required." });
    }

    const snapshot = await db.collection("absences").where("uid", "==", uid).get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "No absences found.",uid:uid });
    }

    const absences = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json({ absences });
  } catch (error) {
    console.error("Error retrieving absences:", error);
    res.status(500).json({ error: "Failed to retrieve absences" });
  }
};

export const getAbsences = async (req, res) => {
  try {


    const snapshot = await db.collection("absences").get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "No absences found." });
    }

    const absences = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json({ absences });
  } catch (error) {
    console.error("Error retrieving absences:", error);
    res.status(500).json({ error: "Failed to retrieve absences" });
  }
};




