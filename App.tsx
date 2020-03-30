import React, { useEffect } from "react";
import * as dateFns from "date-fns";

import { UserDataT, ScreensT } from "./types";
import ReminderScreen from "./Screens/ReminderScreen";
import Home from "./Screens/Home";
import FrequencyScreen from "./Screens/FrequencyScreen";
import BetweenScreen from "./Screens/BetweenScreen";
import { useLoadFonts, useGetUserNotificationSettings } from "./theme";
import { registerForPushNotificationsAsync } from "./api";

const App = () => {
  const [screen, setScreen] = React.useState<ScreensT>("home");
  const fontLoaded = useLoadFonts();
  const userCurrentSettings = useGetUserNotificationSettings();

  const [frequency, setFrequency] = React.useState(
    userCurrentSettings.frequency
  );
  const [startTime, setStartTime] = React.useState(
    userCurrentSettings.startTime
  );
  const [endTime, setEndTime] = React.useState(userCurrentSettings.endTime);
  const [subscriptionIsOn, setSubscriptionIsOn] = React.useState(
    userCurrentSettings.subscriptionIsOn
  );
  const userNewSettings: UserDataT = {
    frequency,
    startTime,
    endTime,
    subscriptionIsOn
  };
  React.useEffect(() => {
    setEndTime(userCurrentSettings.endTime);
    setFrequency(userCurrentSettings.frequency);
    setStartTime(userCurrentSettings.startTime);
    setSubscriptionIsOn(userCurrentSettings.subscriptionIsOn);
  }, [userCurrentSettings, endTime, frequency, startTime]);

  if (screen === "setReminder") {
    return (
      <ReminderScreen
        setScreen={setScreen}
        userData={userNewSettings}
        setSubscriptionIsOn={setSubscriptionIsOn}
      />
    );
  }
  if (screen === "setBetween") {
    return (
      <BetweenScreen
        setEndTime={setEndTime}
        setStartTime={setStartTime}
        setScreen={setScreen}
        userData={userNewSettings}
      />
    );
  }
  if (screen === "setFrequency") {
    return (
      <FrequencyScreen
        setScreen={setScreen}
        userData={userNewSettings}
        frequency={frequency}
        setFrequency={setFrequency}
      />
    );
  } else {
    return fontLoaded ? (
      <Home
        setScreen={setScreen}
        userData={userNewSettings}
        cancelReminder={() =>
          registerForPushNotificationsAsync({
            userNotificationRequest: {
              startTime,
              endTime,
              frequency,
              subscriptionIsOn: false
            },
            onSuccess: () => setSubscriptionIsOn(false)
          })
        }
      />
    ) : null;
  }
};

export default App;
