import quotes from "./quotes";
import db from "./firebase";
import { Permissions, Notifications } from "expo";
import { UserDataT } from "./types";

function importQuotes() {
  quotes.map(quoteObj =>
    db
      .collection("quotes")
      .add(quoteObj)
      .then(docRef => console.log("Document written with ID:", docRef.id))
      .catch(err => console.error("Error adding document: ", err))
  );
}

const PUSH_ENDPOINT =
  "https://europe-west1-quotie-quotie.cloudfunctions.net/setSubscription";

const PUSH_ENDPOINT2 =
  "https://europe-west1-quotie-quotie.cloudfunctions.net/sendNotificationToSubscribedMembers";

const PUSH_POINT_USER_DATA =
  "https://europe-west1-quotie-quotie.cloudfunctions.net/getUserNotificationSettings";

async function testFn() {
  await fetch(PUSH_ENDPOINT2, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
}

async function getUserNotificationSettings() {
  try {
    let token = await Notifications.getExpoPushTokenAsync();
    const res = await fetch(PUSH_POINT_USER_DATA, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token })
    });
    if (res.status === 200) {
      return res.json().then(data => data as UserDataT);
    }
  } catch (error) {
    console.error(error);
  }
}

async function registerForPushNotificationsAsync(
  userNotificationRequest,
  onSuccess
) {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    return;
  }
  let token = await Notifications.getExpoPushTokenAsync();

  const response = await fetch(PUSH_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      token,
      data: userNotificationRequest
    })
  });
  console.log("respone is:", response.ok);
  if (response.ok) {
    return onSuccess();
  } else return;
}

const GetUserNotificationSettings = (props: {
  startTime: string;
  endTime: string;
  frequency: string;
  subscriptionIsOn: boolean;
}) => ({
  startTime: props.startTime,
  endTime: props.endTime,
  frequency: props.frequency,
  subscriptionIsOn: props.subscriptionIsOn
});
