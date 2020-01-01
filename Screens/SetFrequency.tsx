import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { UserDataT, SetScreenFn } from "../types";
import {
  TopNavigation,
  SelectableContainerText,
  BottomNavigation
} from "../components";

import { colors } from "../theme";

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.blue100,
    fontFamily: "Cochin",
    paddingBottom: 50
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

const SetFrequency = (props: {
  setScreen: SetScreenFn;
  frequency: number;
  setFrequency: (value: number) => void;
  userData: UserDataT;
}) => {
  return (
    <ScrollView style={styles.wrapper}>
      <TopNavigation textSize="small" centerText="Repeat" />
      <View style={{ borderTopWidth: 1, borderTopColor: colors.blue400 }}>
        {frequencyOptions.map((option, key) => {
          return (
            <SelectableContainerText
              key={key}
              label={option.label}
              value={option.value}
              onPress={() => {
                props.setFrequency(option.value);
              }}
              selected={props.userData.frequency === option.value}
            />
          );
        })}
      </View>
      <BottomNavigation
        text="Save"
        onPress={() => props.setScreen("setReminder")}
      />
    </ScrollView>
  );
};

export default SetFrequency;
