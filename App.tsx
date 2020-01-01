import React from "react";
import * as dateFns from "date-fns";

import { UserDataT, ScreensT } from "./types";
import SetReminderScreen from "./Screens/SetReminderScreen";
import Home from "./Screens/Home";
import SetFrequency from "./Screens/SetFrequency";
import SetBetween from "./Screens/SetBetweenScreen";

const setInitalTime = () => {
  const currentTime = dateFns.startOfHour(new Date());
  const offsetTime = dateFns.getHours(dateFns.subHours(currentTime, 9));
  const initalTime = dateFns.subHours(currentTime, offsetTime);
  return initalTime;
};

const App = () => {
  const [screen, setScreen] = React.useState<ScreensT>("home");
  const [frequency, setFrequency] = React.useState(60);
  const [startTime, setStartTime] = React.useState(setInitalTime());
  const [endTime, setEndTime] = React.useState(
    dateFns.addHours(setInitalTime(), 12)
  );

  // React.useEffect(() => {
  //   getUserNotificationSettings()
  //     .then(userData => {
  //       if (userData) {
  //         setStartTime(userData.startTime);
  //         setEndTime(userData.endTime);
  //         setFrequency(userData.frequency);
  //       }
  //     })
  //     .catch(error => console.error(error));
  // }, []);

  const userData: UserDataT = {
    frequency,
    startTime,
    endTime
  };

  if (screen === "setReminder") {
    return <SetReminderScreen setScreen={setScreen} userData={userData} />;
  }
  if (screen === "setBetween") {
    return (
      <SetBetween
        setEndTime={setEndTime}
        setStartTime={setStartTime}
        setScreen={setScreen}
        userData={userData}
      />
    );
  }
  if (screen === "setFrequency") {
    return (
      <SetFrequency
        setScreen={setScreen}
        userData={userData}
        frequency={frequency}
        setFrequency={setFrequency}
      />
    );
  } else {
    return <Home setScreen={setScreen} userData={userData} />;
  }
};

export default App;
