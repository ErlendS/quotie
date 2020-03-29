const functions = require("firebase-functions");
const admin = require("firebase-admin");
const dateFns = require("date-fns");
const { Expo } = require("expo-server-sdk");

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

async function getActiveUserTokens(dateObj) {
  return admin
    .firestore()
    .collection("users")
    .where("subscriptionIsOn", "==", true)
    .get()
    .then(querySnapshot => {
      const userTokens = [];
      querySnapshot.forEach(doc => {
        const { startTime, endTime, frequency } = doc.data();

        let whenToNotify = [];
        let currentTime = startTime;
        while (
          dateFns.isBefore(currentTime, endTime) ||
          dateFns.isEqual(currentTime, endTime)
        ) {
          whenToNotify.push(currentTime);
          currentTime = dateFns.addMinutes(currentTime, frequency);
        }
        const shouldBeNotified = whenToNotify.find(date => {
          console.log("when to notify", whenToNotify);
          console.log("the time is ", date, "the dateObj is", dateObj);
          return (
            dateFns.format(date, "HH:mm") === dateFns.format(dateObj, "HH:mm")
          );
        });
        shouldBeNotified ? userTokens.push(doc.id) : null;
      });
      console.log("useerTokens", userTokens);
      return userTokens;
    })
    .catch(error => {
      console.log("Error getting documents: ", error);
    });
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

async function getRandomQuote() {
  return admin
    .firestore()
    .collection("quotes")
    .get()
    .then(querySnapshot => {
      const int = getRandomInt(querySnapshot.size);
      const randomQuote = querySnapshot.docs[int].data();
      return randomQuote;
    })
    .catch(error => {
      console.error(error);
    });
}

async function getQuoteAndUsersToNotify() {
  const dateObj = dateFns.startOfMinute(new Date());
  return Promise.all([getRandomQuote(), getActiveUserTokens(dateObj)])
    .then(data => {
      return data;
    })
    .catch(err => err);
}

exports.getUserNotificationSettings = functions
  .region("europe-west1")
  .https.onRequest((req, res) => {
    const payload = req.body;
    return admin
      .firestore()
      .collection("users")
      .doc(payload.token)
      .get()
      .then(doc => {
        if (doc) {
          return res.status(200).json(doc.data());
        } else {
          console.log("No such document!");
          return res.status(404).send("Sorry we did not find the document");
        }
      })
      .catch(err => console.error(err));
  });

exports.scheduledPushNotifications = functions
  .region("europe-west1")
  .pubsub.schedule(`every 1 hours synchronized`)
  .onRun(async context => {
    try {
      const [quoteObj, userTokens] = await getQuoteAndUsersToNotify();
      let messages = [];
      for (let pushToken of userTokens) {
        if (!Expo.isExpoPushToken(pushToken)) {
          console.error(
            `Push token ${pushToken} is not a valid Expo push token`
          );
          continue;
        }
        messages.push({
          to: pushToken,
          sound: "default",
          title: quoteObj.author,
          body: quoteObj.text
        });
      }
      console.log("messages is: ", messages);
      if (messages.length === 0) {
        console.log("no scheduled notifications");
        return;
      }
      let chunks = expo.chunkPushNotifications(messages);
      let tickets = [];
      for (let chunk of chunks) {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          console.log("ticketchunk is ", ticketChunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  });

// ----------------------------Handle push notifications receipts ----------------------------
// let receiptIds = [];
// for (let ticket of tickets) {
//   // NOTE: Not all tickets have IDs; for example, tickets for notifications
//   // that could not be enqueued will have error information and no receipt ID.
//   if (ticket.id) {
//     receiptIds.push(ticket.id);
//   }
// }

// let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
// (async () => {
//   // Like sending notifications, there are different strategies you could use
//   // to retrieve batches of receipts from the Expo service.
//   for (let chunk of receiptIdChunks) {
//     try {
//       let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
//       console.log(receipts);

//       // The receipts specify whether Apple or Google successfully received the
//       // notification and information about an error, if one occurred.
//       for (const receiptId in receipts) {
//         const { status, message, details } = receipts[receiptId];
//         if (status === "ok") {
//           continue;
//         } else if (status === "error") {
//           console.error(
//             `There was an error sending a notification: ${message}`
//           );
//           if (details && details.error) {
//             // The error codes are listed in the Expo documentation:
//             // https://docs.expo.io/versions/latest/guides/push-notifications/#individual-errors
//             // You must handle the errors appropriately.
//             console.error(`The error code is ${details.error}`);
//           }
//         }
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   }
// })
