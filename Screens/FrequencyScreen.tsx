import React from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import { UserSettingsT, SetScreenFn } from "../types";
import {
  TopNavigation,
  SelectableContainerText,
  BottomNavigation,
  BackgroundImage
} from "../components";

import { colors, spacing } from "../theme";

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.blue100,
    flex: 1,
    alignItems: "flex-start",
    paddingTop: spacing[5],
    paddingBottom: spacing[6]
  },
  scrollView: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent"
  },
  contentContainerStyle: {
    flex: 1,
    justifyContent: "space-between"
  },
  selectorWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: colors.blue400,
    marginBottom: spacing[7],
    flex: 1,
    justifyContent: "flex-end"
  }
});

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

const FrequencyScreen = (props: {
  setScreen: SetScreenFn;
  setFrequency: (value: number) => void;
  userData: UserSettingsT;
}) => {
  return (
    <View style={styles.container}>
      <TopNavigation textSize="small" centerText="Repeat" />
      <BackgroundImage
        placement="oneThird"
        opacity={0.5}
        percentageOfScreenWidth={0.6}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainerStyle}
      >
        <View style={styles.selectorWrapper}>
          {frequencyOptions.map((option, key) => {
            return (
              <SelectableContainerText
                key={key}
                label={option.label}
                onPress={() => props.setFrequency(option.value)}
                selected={props.userData.frequency === option.value}
              />
            );
          })}
        </View>
      </ScrollView>
      <BottomNavigation
        text="Save"
        onPress={() => props.setScreen("setReminder")}
      />
    </View>
  );
};

export default FrequencyScreen;
