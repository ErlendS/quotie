const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.setSubscription = functions
  .region("europe-west1")
  .https.onRequest((req, res) => {
    const payload = req.body;
    console.log("body is", payload);

    const snapshot = admin
      .firestore()
      .collection("users")
      .doc(payload.token)
      .set(payload.data, { merge: true })
      .then(value => {
        console.log("firebase value");
        console.log(value);
        return res.status(200).send();
      })
      .catch(err => {
        console.error(err);
        return res.status(500).send();
      });
  });
