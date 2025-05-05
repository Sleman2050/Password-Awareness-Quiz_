
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp();
const db = admin.firestore();

exports.submitQuiz = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    try {
      const data = req.body;
      data.timestamp = new Date();
      await db.collection("responses").add(data);
      return res.status(200).send("✅ Response saved successfully.");
    } catch (error) {
      console.error("❌ Error saving response:", error);
      return res.status(500).send("Internal Server Error");
    }
  });
});

exports.fetchResponses = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
      try {
        const snapshot = await db.collection("responses").get();
        const results = snapshot.docs.map(doc => doc.data());
        res.set("Access-Control-Allow-Origin", "*");
        return res.status(200).json(results);
      } catch (error) {
        console.error("❌ Error fetching responses:", error);
        return res.status(500).send("Internal Server Error");
      }
    });
  });
  
