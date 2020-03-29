import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import * as dateFns from "date-fns";

import { UserDataT, SetScreenFn } from "../types";
import { colors, spacing } from "../theme";
import { Button, TopNavigation, AppText, BackgroundImage } from "../components";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blue100,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: spacing[5]
  },
  center: {
    justifyContent: "center",
    alignItems: "center"
  },
  textWrapper: {
    marginHorizontal: 24,
    marginBottom: 32,
    textAlign: "center",
    fontSize: 18,
    color: colors.blue800
  },
  textHeader: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.blue800,
    marginBottom: 12
  }
});

function stringifyFrequency(frequency) {
  if (frequency === 60) return "hour";
  if (frequency === 120) return "2 hrs";
  if (frequency === 240) return "4 hrs";
  if (frequency === 360) return "6 hrs";
}

const ReminderText = (props: { userData: UserDataT }) => (
  <AppText style={styles.textWrapper}>
    <AppText>A quote will be sent every</AppText>
    <AppText
      fontWeight="SemiBold"
      children={` ${stringifyFrequency(props.userData.frequency)} `}
    />
    <AppText>from</AppText>
    <AppText
      fontWeight="SemiBold"
      children={` ${dateFns.format(props.userData.startTime, "HH:mm")} `}
    />
    <AppText>to</AppText>
    <AppText
      fontWeight="SemiBold"
      children={` ${dateFns.format(props.userData.endTime, "HH:mm")} `}
    />
  </AppText>
);

const ShowReminder = (props: {
  userData: UserDataT;
  setScreen: SetScreenFn;
}) => (
  <>
    <AppText
      fontWeight="SemiBold"
      children="Reminder set"
      style={styles.textHeader}
    />
    <ReminderText userData={props.userData} />
  </>
);

const Home = (props: {
  userData: UserDataT;
  setScreen: SetScreenFn;
  cancelReminder: () => void;
}) => {
  return (
    <View style={styles.container}>
      <TopNavigation centerText="Stoic Reminders" />
      <BackgroundImage placement="oneThird" />
      <View
        style={{ flex: 1, justifyContent: "flex-end", alignItems: "center" }}
      >
        {props.userData.subscriptionIsOn && (
          <ShowReminder userData={props.userData} setScreen={props.setScreen} />
        )}

        {!props.userData.subscriptionIsOn && (
          <AppText
            style={{ color: colors.blue800, fontSize: 24, marginBottom: 48 }}
            fontWeight="SemiBold"
            children="No Reminder Set"
          />
        )}
      </View>
      <View style={[styles.center, { marginBottom: 48 }]}>
        <Button
          text={props.userData.subscriptionIsOn ? "Edit" : "Set Reminder"}
          onPress={() => props.setScreen("setReminder")}
        />
        {props.userData.subscriptionIsOn && (
          <Button
            variant="secondary"
            text="Cancel Reminder"
            onPress={() =>
              Alert.alert("Cancel Reminder?", "", [
                { text: "No", onPress: () => null, style: "cancel" },
                { text: "Yes", onPress: props.cancelReminder }
              ])
            }
          />
        )}
      </View>
    </View>
  );
};

export default Home;
