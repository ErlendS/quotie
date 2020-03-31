import * as React from "react";

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
