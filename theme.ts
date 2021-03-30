import * as React from "react";
import * as Font from "expo-font";
import * as dateFns from "date-fns";
import * as lodash from "lodash";

import { UserSettingsT } from "./types";

export const colors = {
  blue900: "#27414E",
  blue800: "#46626F",
  blue700: "#617C89",
  blue600: "#839BA6",
  blue500: "#A3BDCA",
  blue400: "#B8CFD6",
  blue300: "#C5D5DD",
  blue200: "#DEE7EB",
  blue100: "#E8EEF1",
  white: "#FFFFFF",
  black: "#444444",
  focused: "#2D9CDB"
};

export const newColors = {
  background: '#353B44',
  white: "#FFFFFF",
  buttonDark: '#2D323A',
  text: '#CAC7FF',
  favurite: '#FFB82D',
  alert: '#E2CD96',
  warning: '#F18A8A'
  
}
export const gradients = {
  primary: ['#7F6AFF', '#799FFF'], 
  secondary: ['#7E74FF', '#7694F6']}

export const spacing = [
  0, // 0
  4, // 1
  8, // 2
  16, // 3
  24, // 4
  28, // 5
  32, // 6
  52, // 7
  64, // 8
  96, // 9
  142 // 10
];

export const fontSize = [12, 16, 24, 28, 32, 36];

export const useLoadFonts = () => {
  const [fontLoaded, setFontLoaded] = React.useState(false);
  async function loadFonts() {
    await Font.loadAsync({
      "Montserrat-Regular": require("./assets/fonts/Montserrat-Regular.ttf"),
      "Montserrat-SemiBold": require("./assets/fonts/Montserrat-SemiBold.ttf"),
      "Montserrat-Medium": require("./assets/fonts/Montserrat-Medium.ttf"),
      "Montserrat-Bold": require("./assets/fonts/Montserrat-Bold.ttf")
    });
  }

  React.useEffect(() => {
    loadFonts()
      .then(() => setFontLoaded(true))
      .catch(() => {
        // FLAGGED - Add toastbar here -- consider Material UI
        console.warn("So sorry, something went wrong loading the fonts");
      });
  }, []);

  return fontLoaded;
};

export const setInitalTime = () => {
  const currentTime = dateFns.startOfHour(new Date());
  const offsetTime = dateFns.getHours(dateFns.subHours(currentTime, 9));
  const initalTime = dateFns.subHours(currentTime, offsetTime);
  return initalTime;
};
export const getDefaultUserSettings = (): UserSettingsT => ({
  frequency: 60,
  startTime: setInitalTime(),
  endTime: dateFns.addHours(setInitalTime(), 12),
  subscriptionIsOn: false
});

interface SetUserStateFnT {
  (updatedValues: Partial<UserSettingsT>): void; // this is the function signature
  // the following are properties on this function.
  setSubscriptionIsOn: (subscriptionIsOn: boolean) => void;
  setStartTime: (startTime: Date) => void;
  setEndTime: (endTime: Date) => void;
  setFrequency: (frequency: number) => void;
}
export const useUserSettingForm = (
  currentValue: UserSettingsT
): [UserSettingsT, SetUserStateFnT] => {
  const [userState, _setUserState] = React.useState<UserSettingsT>(
    currentValue
  );
  React.useEffect(() => {
    _setUserState(currentValue);
  }, [currentValue]);

  const setUserState = React.useMemo((): SetUserStateFnT => {
    const setUserForm = function(updatedValues: Partial<UserSettingsT>) {
      _setUserState(prevValues =>
        lodash.defaults({ ...updatedValues }, prevValues)
      );
    } as SetUserStateFnT;
    setUserForm.setSubscriptionIsOn = subscriptionIsOn =>
      setUserForm({ subscriptionIsOn });
    setUserForm.setStartTime = startTime => setUserForm({ startTime });
    setUserForm.setEndTime = endTime => setUserForm({ endTime });
    setUserForm.setFrequency = frequency => setUserForm({ frequency });
    return setUserForm;
  }, []);
  return [userState, setUserState];
};
