import React, { useState } from "react";
import {
  View,
  StyleSheet,
  DatePickerIOS,
  ScrollView,
  Image
} from "react-native";
import * as dateFns from "date-fns";

import { UserDataT, SetScreenFn } from "../types";
import { TopNavigation, BottomNavigation, Tab } from "../components";
import { colors } from "../theme";

const styles = StyleSheet.create({
  baseText: {
    color: colors.black
  },
  subTitle: {
    color: colors.blue900,
    fontSize: 28,
    fontWeight: "500"
  },
  subTitleWrapper: {
    height: 100,
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  timePickerWrapper: {
    marginBottom: 50,
    borderBottomWidth: 1,
    borderBottomColor: colors.blue400
  },
  wrapper: {
    flex: 1,
    backgroundColor: colors.blue100,
    fontFamily: "Cochin"
  },
  datePickerButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 51,
    borderTopWidth: 1,
    borderTopColor: colors.blue400,
    borderBottomWidth: 1,
    borderBottomColor: colors.blue400
  },
  datePickerButtonText: {
    fontWeight: "600",
    color: colors.black
  },
  datePickerStyle: {
    borderTopWidth: 1,
    borderTopColor: colors.blue400
  },
  contentContainerStyle: {
    flex: 1,
    justifyContent: "space-between"
  },
  center: {
    justifyContent: "center",
    alignItems: "center"
  }
});

const SetBetween = (props: {
  setScreen: SetScreenFn;
  setStartTime: (newTime: Date) => void;
  setEndTime: (newTime: Date) => void;
  userData: UserDataT;
}) => {
  const [toggleTimePicker, settoggleTimePicker] = useState<"start" | "end">(
    "start"
  );
  return (
    <ScrollView
      style={styles.wrapper}
      contentContainerStyle={styles.contentContainerStyle}
    >
      <TopNavigation textSize="small" centerText="Between" />
      <View>
        <View style={styles.center}>
          <Image
            source={require("../assets/statue_head.png")}
            style={{ width: 200, height: 300, opacity: 0.5 }}
          />
        </View>
        <View style={styles.timePickerWrapper}>
          {toggleTimePicker === "start" && (
            <React.Fragment>
              <DatePickerIOS
                style={styles.datePickerStyle}
                date={props.userData.startTime}
                onDateChange={props.setStartTime}
                mode="time"
                minuteInterval={10}
              />
            </React.Fragment>
          )}
          {toggleTimePicker === "end" && (
            <React.Fragment>
              <DatePickerIOS
                style={styles.datePickerStyle}
                date={props.userData.endTime}
                onDateChange={props.setEndTime}
                mode="time"
                minuteInterval={10}
              />
            </React.Fragment>
          )}
          <View style={{ flexDirection: "row" }}>
            <Tab
              topText="Start"
              bottomText={dateFns.format(props.userData.startTime, "HH:mm")}
              active={toggleTimePicker === "start"}
              onPress={() => {
                settoggleTimePicker("start");
              }}
            />
            <Tab
              topText="End"
              bottomText={dateFns.format(props.userData.endTime, "HH:mm")}
              active={toggleTimePicker === "end"}
              onPress={() => {
                settoggleTimePicker("end");
              }}
            />
          </View>
        </View>
        <BottomNavigation
          text="Save"
          onPress={() => props.setScreen("setReminder")}
        />
      </View>
    </ScrollView>
  );
};

export default SetBetween;
