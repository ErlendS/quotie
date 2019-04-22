const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Expo = require("expo-server-sdk");

let expo = new Expo();

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

// exports.sendPushNotification = functions
// .region("europe-west1")
// .https.onRequest((req, res) => {
//   const payload = req.body;
//   console.log("body is", payload);

//   const tokens = admin
//     .firestore()
//     .collection("users")
// retrive toekns
// check subscription
// check if they are suppose to be notified
// if yes, then notfiy
// if no, then don't
// });
//
