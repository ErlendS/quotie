import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as dateFns from "date-fns";

import { UserDataT, SetScreenFn } from "../types";
import {
  TopNavigation,
  BottomNavigation,
  Tab,
  BackgroundImage
} from "../components";
import { colors, spacing } from "../theme";

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.blue100,
    flex: 1,
    alignItems: "flex-start",
    paddingBottom: spacing[6],
    paddingTop: spacing[5]
  },
  timePickerWrapper: {
    marginBottom: spacing[7],
    borderBottomWidth: 1,
    borderBottomColor: colors.blue400,
    borderTopWidth: 1,
    borderTopColor: colors.blue400
  },
  scrollView: {
    backgroundColor: "transparent",
    width: "100%"
  },
  contentContainerStyle: {
    flex: 1,
    justifyContent: "flex-end"
  }
});

const BetweenScreen = (props: {
  setScreen: SetScreenFn;
  setStartTime: (newTime: Date) => void;
  setEndTime: (newTime: Date) => void;
  userData: UserDataT;
}) => {
  const [toggleTimePicker, settoggleTimePicker] = useState<"start" | "end">(
    "start"
  );

  return (
    <View style={styles.container}>
      <TopNavigation textSize="small" centerText="Between" />
      <BackgroundImage
        placement="oneThird"
        opacity={0.5}
        percentageOfScreenWidth={0.6}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainerStyle}
      >
        <View style={styles.timePickerWrapper}>
          {toggleTimePicker === "start" && (
            <React.Fragment>
              <DateTimePicker
                value={props.userData.startTime}
                onChange={() => props.setStartTime}
                mode="time"
                minuteInterval={10}
              />
            </React.Fragment>
          )}
          {toggleTimePicker === "end" && (
            <React.Fragment>
              <DateTimePicker
                value={props.userData.endTime}
                onChange={() => props.setEndTime}
                mode="time"
                minuteInterval={10}
              />
            </React.Fragment>
          )}
          <View style={{ flexDirection: "row" }}>
            <Tab
              topText="Start"
              bottomText={dateFns.format(props.userData.startTime, "HH:mm")}
              variant={toggleTimePicker === "start" ? "focused" : "default"}
              onPress={() => {
                settoggleTimePicker("start");
              }}
            />
            <View style={{ width: 1, backgroundColor: colors.blue200 }} />
            <Tab
              topText="End"
              bottomText={dateFns.format(props.userData.endTime, "HH:mm")}
              variant={toggleTimePicker === "end" ? "focused" : "default"}
              onPress={() => {
                settoggleTimePicker("end");
              }}
            />
          </View>
        </View>
      </ScrollView>
      <BottomNavigation
        text="Save"
        onPress={() => props.setScreen("setReminder")}
      />
    </View>
  );
};

export default BetweenScreen;
