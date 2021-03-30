import * as React from "react";
import firebase from "firebase";

import { UserSettingsT, ScreensT } from "./types";
import Home from "./Screens/Home";
import {
  useLoadFonts,
  getDefaultUserSettings,
  useUserSettingForm
} from "./theme";
import {
  registerForPushNotificationsAsync,
  getUserNotificationSettings
} from "./api";

import ReminderScreen from "./Screens/ReminderScreen";
import FrequencyScreen from "./Screens/FrequencyScreen";
import BetweenScreen from "./Screens/BetweenScreen";

const App = (props: {
  userSettings: UserSettingsT;
  refetchUserSettings: () => void;
}) => {
  const [screen, setScreen] = React.useState<ScreensT>("home");

  const [userForm, setUserForm] = useUserSettingForm(props.userSettings);

  const handleUpdateUserSettings = () => {
    firebase.auth().signInAnonymously().then(() => {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          // recreate puh token for user everytime they set a new subscription
          // only create account if they want to save a quopte.
          const isAnonymous = user.isAnonymous;
          const uid = user.uid;
          // payload.token should be uid.
          // add expo pushtoken in users state (?)

          setUserForm.setSubscriptionIsOn(true);
          registerForPushNotificationsAsync({
            userNotificationRequest: {
              ...userForm,
              subscriptionIsOn: true
            },
          onSuccess: () => {
            setScreen("home");
            props.refetchUserSettings();
          }
      });
        } else {
        console.warn('Noo user hombrero');
        
        }
      });
  })
  .catch(function(error) {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    console.warn(errorMessage);
    
    // ...
  })

  //-------------------------------------------------
    //optimistc update, remember to handle errors.
    setUserForm.setSubscriptionIsOn(true);
    registerForPushNotificationsAsync({
      userNotificationRequest: {
        ...userForm,
        subscriptionIsOn: true
      },
      onSuccess: () => {
        setScreen("home");
        props.refetchUserSettings();
      }
    });
  };
  if (screen === "setReminder") {
    return (
      <ReminderScreen
        setScreen={setScreen}
        userData={userForm}
        onSubmit={handleUpdateUserSettings}
      />
    );
  }
  if (screen === "setBetween") {
    return (
      <BetweenScreen
        setEndTime={setUserForm.setEndTime}
        setStartTime={setUserForm.setStartTime}
        setScreen={setScreen}
        userData={userForm}
      />
    );
  }
  if (screen === "setFrequency") {
    return (
      <FrequencyScreen
        setScreen={setScreen}
        userData={userForm}
        setFrequency={setUserForm.setFrequency}
      />
    );
  } else {
    return (
      <Home
        setScreen={setScreen}
        userData={userForm}
        cancelReminder={() =>
          registerForPushNotificationsAsync({
            userNotificationRequest: {
              ...userForm,
              subscriptionIsOn: false
            },
            onSuccess: () => setUserForm.setSubscriptionIsOn(false)
          })
        }
      />
    );
  }
};

export default function Root() {
  const fontLoaded = useLoadFonts();
  const [userSettings, setUserSettings] = React.useState<
    UserSettingsT | undefined
  >(undefined);

  //TODO set firebase subscription instead of fetchUserSettings

  // firebase.auth().onAuthStateChanged(function(user) {
  //   if (user) {
  //     console.warn('WTF?');
  //     // User is signed in.
  //     const isAnonymous = user.isAnonymous;
  //     const uid = user.uid;

  //   } else {
  //    console.warn('Noo user hombrero');
     
  //   }
  // });
  
  const fetchUserSettings = React.useCallback(() => {
    getUserNotificationSettings()
      .then(userSettings => {
        if (userSettings) {
          setUserSettings(userSettings);
        } else {
          setUserSettings(getDefaultUserSettings());
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  React.useEffect(() => {
    fetchUserSettings();
  }, [fetchUserSettings]);

  return fontLoaded && userSettings ? (
    <App userSettings={userSettings} refetchUserSettings={fetchUserSettings} />
  ) : null;
}
