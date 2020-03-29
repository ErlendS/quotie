import React from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import * as dateFns from "date-fns";

import { UserDataT, SetScreenFn } from "../types";
import {
  TopNavigation,
  TextContainer,
  Button,
  BackgroundImage
} from "../components";
import { colors, spacing } from "../theme";
import { stringifyFrequency } from "../variables";
import { registerForPushNotificationsAsync } from "../api";

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.blue100,
    flex: 1,
    paddingTop: spacing[5]
  },
  scrollViewContainer: {
    backgroundColor: "transparent",
    paddingBottom: spacing[7]
  },
  scrollViewContentContainerStyle: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  actionsWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: colors.blue400,
    width: "100%",
    marginBottom: spacing[7]
  }
});

const ReminderScreen = (props: {
  userData: UserDataT;
  setScreen: SetScreenFn;
  setSubscriptionIsOn: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <View style={styles.container}>
      <TopNavigation textSize="small" centerText="Set Reminder" />
      <BackgroundImage placement="oneThird" />

      <ScrollView
        style={styles.scrollViewContainer}
        contentContainerStyle={styles.scrollViewContentContainerStyle}
      >
        <View style={styles.actionsWrapper}>
          <TextContainer
            leftText="Repeat"
            rightText={`Every ${stringifyFrequency(props.userData.frequency)}`}
            onPress={() => props.setScreen("setFrequency")}
          />
          <TextContainer
            leftText="Between"
            rightText={`${dateFns.format(
              props.userData.startTime,
              "HH:mm"
            )} and ${dateFns.format(props.userData.endTime, "HH:mm")}`}
            onPress={() => props.setScreen("setBetween")}
          />
        </View>
        <Button
          text="Set Reminder"
          onPress={() => {
            const { startTime, endTime, frequency } = props.userData;
            registerForPushNotificationsAsync({
              userNotificationRequest: {
                startTime,
                endTime,
                frequency,
                subscriptionIsOn: true
              },
              onSuccess: () => {
                props.setSubscriptionIsOn(true);
                props.setScreen("home");
              }
            });
          }}
        />
      </ScrollView>
    </View>
  );
};

export default ReminderScreen;
