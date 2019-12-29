import React from "react";
import * as dateFns from "date-fns";
// import Tabs from '@material-ui/core/Tabs';
// import Tab from '@material-ui/core/Tab';

import { UserDataT, ScreensT } from "./types";
import FrequencySelector from "./ReminderScreen";
import Home from "./Home";

const setInitalTime = () => {
  const currentTime = dateFns.startOfHour(new Date());
  const offsetTime = dateFns.getHours(dateFns.subHours(currentTime, 9));
  const initalTime = dateFns.subHours(currentTime, offsetTime);
  return initalTime;
};

const frequencyOptions = [
  {
    label: "Every hour",
    value: 60
  },
  {
    label: "Every 2 hrs",
    value: 120
  },
  {
    label: "Every 4 hrs",
    value: 240
  },
  {
    label: "Every 6 hrs",
    value: 360
  }
];

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
    return (
      <FrequencySelector
        setScreen={setScreen}
        setStartTime={setStartTime}
        setEndTime={setEndTime}
        setFrequency={setFrequency}
        frequencyOptions={frequencyOptions}
        userData={userData}
      />
    );
  } else {
    return <Home setScreen={setScreen} userData={userData} />;
  }
};

export default App;
