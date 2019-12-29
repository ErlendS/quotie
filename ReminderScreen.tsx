import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  DatePickerIOS,
  ScrollView
} from "react-native";
import { Icon } from "react-native-elements";
import { UserDataT, SetScreenFn } from "./types";
import * as dateFns from "date-fns";
import { PrimaryButton, TopNavigation } from "./components";
import { colors } from "./theme";

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
  selectors: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 16,
    backgroundColor: colors.white,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: colors.blue400,
    paddingHorizontal: 16
  },
  timeSelectors: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 16,
    backgroundColor: colors.white,
    height: 50,
    borderTopWidth: 1,
    borderTopColor: colors.blue400,
    paddingHorizontal: 16
  },
  timePickerWrapper: {
    marginBottom: 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.blue400
  },
  wrapper: {
    flex: 1,
    backgroundColor: colors.blue100,
    fontFamily: "Cochin",
    paddingBottom: 50
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
  }
});

const FrequencySelector = (props: {
  setScreen: SetScreenFn;
  setStartTime: (newTime: Date) => void;
  setEndTime: (newTime: Date) => void;
  setFrequency: (value: number) => void;
  frequencyOptions: Array<{
    label: string;
    value: number;
  }>;
  userData: UserDataT;
}) => {
  const [toggleTimePicker, settoggleTimePicker] = useState<
    "start" | "end" | "none"
  >("none");
  return (
    <ScrollView style={styles.wrapper}>
      <TopNavigation
        leftIcon={
          <TouchableOpacity onPress={() => props.setScreen("home")}>
            <Icon
              name="chevron-left"
              type="feather"
              color={colors.blue900}
              size={30}
            />
          </TouchableOpacity>
        }
        centerText="Remind Me"
      />
      <View style={{ borderTopWidth: 1, borderTopColor: colors.blue400 }}>
        {props.frequencyOptions.map((option, key) => {
          return (
            <FrequencyOption
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
      <View style={styles.subTitleWrapper}>
        <Text style={styles.subTitle}> From</Text>
      </View>
      <View style={styles.timePickerWrapper}>
        <TimePeriod
          title="Start"
          time={dateFns.format(props.userData.startTime, "HH:mm")}
          onPress={() => {
            settoggleTimePicker("start");
          }}
        />
        {toggleTimePicker === "start" && (
          <React.Fragment>
            <DatePickerIOS
              style={styles.datePickerStyle}
              date={props.userData.startTime}
              onDateChange={props.setStartTime}
              mode="time"
              minuteInterval={10}
            />
            <TouchableOpacity
              style={styles.datePickerButton}
              activeOpacity={0.8}
              onPress={() => {
                settoggleTimePicker("none");
              }}
            >
              <Text style={styles.datePickerButtonText}> Confirm </Text>
            </TouchableOpacity>
          </React.Fragment>
        )}
        <TimePeriod
          title="End"
          time={dateFns.format(props.userData.endTime, "HH:mm")}
          onPress={() => {
            settoggleTimePicker("end");
          }}
        />
        {toggleTimePicker === "end" && (
          <React.Fragment>
            <DatePickerIOS
              style={styles.datePickerStyle}
              date={props.userData.endTime}
              onDateChange={props.setEndTime}
              mode="time"
              minuteInterval={10}
            />
            <TouchableOpacity
              style={styles.datePickerButton}
              activeOpacity={0.8}
              onPress={() => {
                settoggleTimePicker("none");
              }}
            >
              <Text style={styles.datePickerButtonText}> Confirm </Text>
            </TouchableOpacity>
          </React.Fragment>
        )}
      </View>
      <PrimaryButton
        text={"Set Reminder"}
        onPress={() => {
          // registerForPushNotificationsAsync(
          //   this.getUserNotificationSettings(),
          //   this.props.backToHome
          // )
          props.setScreen("home");
        }}
      />
    </ScrollView>
  );
};

const TimePeriod = ({ title, time, onPress }) => (
  <TouchableOpacity
    onPress={() => onPress()}
    style={styles.timeSelectors}
    activeOpacity={1}
  >
    <Text style={styles.baseText}>{title}</Text>
    <Text style={styles.baseText}>{time}</Text>
  </TouchableOpacity>
);
const FrequencyOption = ({ label, value, selected, onPress }) => (
  <TouchableOpacity style={styles.selectors} onPress={() => onPress(value)}>
    <Text style={styles.baseText}>{label}</Text>
    {selected ? (
      <Icon name="check" type="feather" color={colors.black} size={15} />
    ) : null}
  </TouchableOpacity>
);

export default FrequencySelector;
