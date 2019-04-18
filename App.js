import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  DatePickerIOS,
  ScrollView
} from "react-native";
import { Permissions, Notifications } from "expo";
// import Expo from "expo-server-sdk";
import { Icon } from "react-native-elements";
import firebase from "firebase";
import firestore from "firebase/firestore";
import * as dateFns from "date-fns";

import quotes from "./quotes";
import db from "./firebase";

function importQuotes() {
  quotes.map(quoteObj =>
    db
      .collection("quotes")
      .add(quoteObj)
      .then(docRef => console.log("Document written with ID:", docRef.id))
      .catch(err => console.error("Error adding document: ", err))
  );
}

const PUSH_ENDPOINT = "https://your-server.com/users/push-token";

async function registerForPushNotificationsAsync(
  userNotificationRequest,
  onSuccess
) {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    return;
  }
  let token = await Notifications.getExpoPushTokenAsync();

  // POST the token to your backend server from where you can retrieve it to send push notifications.
  // return fetch(PUSH_ENDPOINT, {
  //   method: "POST",
  //   headers: {
  //     Accept: "application/json",
  //     "Content-Type": "application/json"
  //   },
  //   body: JSON.stringify({
  //     token: {
  //       value: token
  //     },
  //     value: {
  //       setUserNotificationRequest
  //     }
  //   })
  // });

  db.collection("users")
    .doc(token)
    .set({ userNotificationRequest }, { merge: true })
    .then(() => onSuccess())
    .catch(err => console.error("Error adding document: ", err));
}

export default class App extends React.Component {
  state = {
    screen: "home",
    payload: {
      startTime: this.props.initalStartTime || setInitalTime(),
      endTime:
        this.props.initalEndTime || dateFns.addHours(setInitalTime(), 12),
      frequency: 60
    },
    frequencyOptions: [
      {
        label: "Every 30 min",
        value: 30
      },
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
      }
      // {
      //   label: "Every 6 hrs",
      //   value: 360
      // }
    ]
  };
  setStartTime = newTime =>
    this.setState({ payload: { ...this.state.payload, startTime: newTime } });
  setEndTime = newTime =>
    this.setState({ payload: { ...this.state.payload, endTime: newTime } });

  setFrequency = value => {
    this.setState({
      payload: { ...this.state.payload, frequency: value }
    });
  };

  goToSetReminder = () => {
    this.setState({
      screen: "setReminder"
    });
  };
  onBackToHome = () => {
    this.setState({
      screen: "home"
    });
  };
  goToSuccessScreen = () => {
    this.setState({
      screen: "successScreen"
    });
  };

  render() {
    if (this.state.screen === "home") {
      return <Home setReminder={this.goToSetReminder} />;
    }
    if (this.state.screen === "setReminder") {
      return (
        <FrequencySelector
          backToHome={this.onBackToHome}
          goToSuccessScreen={this.goToSuccessScreen}
          setStartTime={this.setStartTime}
          setEndTime={this.setEndTime}
          setFrequency={this.setFrequency}
          frequencyOptions={this.state.frequencyOptions}
          payload={this.state.payload}
        />
      );
    }
    if (this.state.screen === "successScreen") {
      return (
        <SuccessScreen
          goToSetReminder={this.goToSetReminder}
          frequencyOptions={this.state.frequencyOptions}
          payload={this.state.payload}
        />
      );
    } else {
      return <Home setReminder={this.goToSetReminder} />;
    }
  }
}

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
      <Icon name="check" type="feather" color="#444444" size={15} />
    ) : null}
  </TouchableOpacity>
);

const PrimaryButton = ({ text, icon, onPress }) => (
  <View
    style={{
      height: "15%",
      width: "100%",
      alignItems: "center"
    }}
  >
    <TouchableOpacity
      style={styles.buttonStyle}
      onPress={onPress}
      activeOpacity={0.4}
    >
      {icon ? (
        <View
          style={{
            width: 30
          }}
        />
      ) : null}
      <Text style={{ textAlign: "center", flexGrow: 1 }}>{text}</Text>
      {icon}
    </TouchableOpacity>
  </View>
);

const TopNav = ({ leftIcon, centerText, rightIcon }) => {
  const placeholder = (
    <View
      style={{
        width: 30
      }}
    />
  );
  return (
    <View
      style={{
        marginTop: 44,
        height: 100,
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-around"
      }}
    >
      {leftIcon ? leftIcon : placeholder}
      <Text style={styles.title}> {centerText}</Text>
      {rightIcon ? rightIcon : placeholder}
    </View>
  );
};

const setInitalTime = () => {
  const currentTime = dateFns.startOfHour(new Date());
  const offsetTime = dateFns.getHours(dateFns.subHours(currentTime, 9));
  const initalTime = dateFns.subHours(currentTime, offsetTime);
  return initalTime;
};
//-------------------------------------------------------------------------------------------------------------------------------------------
export class FrequencySelector extends React.Component {
  state = {
    toggleTimer: {
      start: false,
      end: false
    }
  };

  getPayload = () => ({
    startTime: this.props.payload.startTime,
    endTime: this.props.payload.endTime,
    frequency: this.props.payload.frequency,
    subscriptionIsOn: true
  });

  toggleWatcher = (value = "start" | "end") => {
    if (value === "start") {
      this.setState({
        toggleTimer: { start: !this.state.toggleTimer.start, end: false }
      });
    }
    if (value === "end") {
      this.setState({
        toggleTimer: { end: !this.state.toggleTimer.end, start: false }
      });
    }
  };

  render() {
    return (
      <ScrollView style={styles.wrapper}>
        <TopNav
          leftIcon={
            <TouchableOpacity onPress={this.props.backToHome}>
              <Icon
                name="chevron-left"
                type="feather"
                color="#444444"
                size={30}
              />
            </TouchableOpacity>
          }
          centerText="Remind Me"
        />
        <View style={{ borderTopWidth: 1, borderTopColor: "#C4C4C4" }}>
          {this.props.frequencyOptions.map((option, key) => {
            return (
              <FrequencyOption
                key={key}
                label={option.label}
                value={option.value}
                onPress={() => {
                  this.props.setFrequency(option.value);
                }}
                selected={this.props.payload.frequency === option.value}
              />
            );
          })}
        </View>
        <View
          style={{
            height: 100,
            width: "100%",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Text style={styles.subTitle}> From</Text>
        </View>
        <View
          style={{
            marginBottom: 60,
            borderBottomWidth: 1,
            borderBottomColor: "#C4C4C4"
          }}
        >
          <TimePeriod
            title="Start"
            time={dateFns.format(this.props.payload.startTime, "HH:mm")}
            onPress={() => {
              this.toggleWatcher("start");
            }}
          />
          {this.state.toggleTimer.start && (
            <React.Fragment>
              <DatePickerIOS
                style={styles.datePickerStyle}
                date={this.props.payload.startTime}
                onDateChange={this.props.setStartTime}
                mode="time"
                minuteInterval="10"
              />
              <TouchableOpacity
                style={styles.datePickerButton}
                activeOpacity={0.8}
                onPress={() => {
                  this.toggleWatcher("start");
                }}
              >
                <Text style={styles.datePickerButtonText}> Confirm </Text>
              </TouchableOpacity>
            </React.Fragment>
          )}
          <TimePeriod
            title="End"
            time={dateFns.format(this.props.payload.endTime, "HH:mm")}
            onPress={() => {
              this.toggleWatcher("end");
            }}
          />
          {this.state.toggleTimer.end && (
            <React.Fragment>
              <DatePickerIOS
                style={styles.datePickerStyle}
                date={this.props.payload.endTime}
                onDateChange={this.props.setEndTime}
                mode="time"
                minuteInterval="10"
              />
              <TouchableOpacity
                style={styles.datePickerButton}
                activeOpacity={0.8}
                onPress={() => {
                  this.toggleWatcher("end");
                }}
              >
                <Text style={styles.datePickerButtonText}> Confirm </Text>
              </TouchableOpacity>
            </React.Fragment>
          )}
        </View>
        <PrimaryButton
          text={"Set Reminder"}
          onPress={() =>
            registerForPushNotificationsAsync(
              this.getPayload(),
              this.props.goToSuccessScreen
            )
          }
        />
      </ScrollView>
    );
  }
}
export class Home extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <TopNav centerText="Daily Stoic" />
        <View
          style={{
            flexGrow: 2,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Image
            source={require("./assets/statue_head.png")}
            style={{ width: 279, height: 420 }}
          />
        </View>
        <PrimaryButton
          text="Set Reminder"
          icon={
            <Icon
              name="chevron-right"
              type="feather"
              color="#444444"
              size={30}
            />
          }
          onPress={this.props.setReminder}
        />
      </View>
    );
  }
}
export class SuccessScreen extends React.Component {
  stringifyFrequency = frequency => {
    if (frequency === 30) return "30 minutes";
    if (frequency === 60) return "hour";
    if (frequency === 120) return "2 hrs";
    if (frequency === 240) return "4 hrs";
  };
  render() {
    console.log(this.props.payload.startTime);
    return (
      <View style={styles.container}>
        <TopNav centerText="Daily Stoic" />
        <View
          style={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Image
            source={require("./assets/statue_head.png")}
            style={{ width: 279, height: 420 }}
          />
        </View>
        <View style={{ flexGrow: 1 }}>
          <Text
            style={{
              marginBottom: 30,
              textAlign: "center",
              fontSize: 16,
              color: "#444444"
            }}
            children={
              "Reminder set every " +
              this.stringifyFrequency(this.props.payload.frequency) +
              " from " +
              dateFns.format(this.props.payload.startTime, "HH:mm") +
              " to " +
              dateFns.format(this.props.payload.endTime, "HH:mm")
            }
          />
          <Text
            style={{
              textDecorationLine: "underline",
              textAlign: "center",
              fontSize: 18,
              color: "#444444"
            }}
            onPress={this.props.goToSetReminder}
          >
            Edit
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    fontFamily: "Cochin"
  },
  baseText: {
    color: "#555555"
  },
  title: {
    color: "#202020",
    fontSize: 37,
    fontWeight: "600"
  },
  subTitle: {
    color: "#202020",
    fontSize: 28,
    fontWeight: "500"
  },
  buttonStyle: {
    backgroundColor: "#FFFFFF",
    height: 51,
    width: "70%",
    borderStyle: "solid",
    borderColor: "#444444",
    borderWidth: 1,
    color: "#444444",
    borderRadius: 3,
    alignItems: "center",
    fontSize: 16,
    justifyContent: "space-between",
    flexDirection: "row"
  },
  selectors: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#C4C4C4",
    paddingHorizontal: 16
  },
  timeSelectors: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    height: 50,
    borderTopWidth: 1,
    borderTopColor: "#C4C4C4",
    paddingHorizontal: 16
  },
  wrapper: {
    flex: 1,
    backgroundColor: "#F6F6F6",
    fontFamily: "Cochin",
    paddingBottom: 50
  },
  datePickerButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 51,
    borderTopWidth: 1,
    borderTopColor: "#C4C4C4",
    borderBottomWidth: 1,
    borderBottomColor: "#C4C4C4"
  },
  datePickerButtonText: {
    fontWeight: "600",
    color: "#444444"
  },
  datePickerStyle: {
    borderTopWidth: 1,
    borderTopColor: "#C4C4C4"
  }
});
