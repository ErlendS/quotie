import * as React from "react";
import * as Font from "expo-font";

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
  96 // 9
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
