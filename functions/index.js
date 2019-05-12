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
          dateFns.isBefore(
            currentTime,
            endTime || dateFns.isEqual(currentTime, endTime)
          )
        ) {
          whenToNotify.push(currentTime);
          currentTime = dateFns.addMinutes(currentTime, frequency);
        }
        const shouldBeNotified = whenToNotify.find(date => {
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
      console.log("returning random quote!");
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

exports.scheduledPushNotifications = functions
  .region("europe-west1")
  .pubsub.schedule(`every 10 minutes synchronized`)
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
