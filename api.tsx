import quotes from "./quotes";
import db from "./firebase";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
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

const SET_SUBSCRIPTION_ENDPOINT =
  "https://europe-west1-quotie-quotie.cloudfunctions.net/setSubscription";

const SEND_NOTIFICATION_ENDPOINT =
  "https://europe-west1-quotie-quotie.cloudfunctions.net/sendNotificationToSubscribedMembers";

const GET_USER_SETTINGS_ENDPOINT =
  "https://europe-west1-quotie-quotie.cloudfunctions.net/getUserNotificationSettings";

async function sendNotifications() {
  await fetch(SEND_NOTIFICATION_ENDPOINT, {
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
    console.log("token: ", token);

    const res = await fetch(GET_USER_SETTINGS_ENDPOINT, {
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
    console.warn("something went horribly wrong, so, so many are dead");

    console.error(error);
  }
}
interface RegisterForPushNotificationsAsyncProps {
  userNotificationRequest: UserDataT;
  onSuccess?: () => void;
}
async function registerForPushNotificationsAsync(
  props: RegisterForPushNotificationsAsyncProps
) {
  console.log("everything is fine");

  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  console.log("status", status);

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    return;
  }
  let token = await Notifications.getExpoPushTokenAsync();

  const response = await fetch(SET_SUBSCRIPTION_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      token,
      data: props.userNotificationRequest
    })
  });
  console.log("respone is:", response.ok);
  if (response.ok) {
    return props.onSuccess();
  } else return;
}

export {
  getUserNotificationSettings,
  registerForPushNotificationsAsync,
  sendNotifications
};
