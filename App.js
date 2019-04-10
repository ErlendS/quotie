import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  DatePickerIOS
} from "react-native";
import { Icon } from "react-native-elements";
import * as dateFns from "date-fns";

export default class App extends React.Component {
  state = {
    screen: "home",
    cycle: {
      start: "09:00",
      end: "22:00"
    },
    frequency: 1
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

  onSetCycle = (start, end) => {
    this.setState({
      cycle: {
        start,
        end
      }
    });
  };
  onSetFrequency = value => {
    this.setState({
      frequency: value
    });
  };

  render() {
    return this.state.screen === "home" ? (
      <Home setReminder={this.goToSetReminder} />
    ) : (
      <FrequencySelector
        setFrequency={this.onSetFrequency}
        frequency={this.state.frequency}
      />
    );
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

export class FrequencySelector extends React.Component {
  state = {
    startTime: this.props.initalStartTime || setInitalTime(),
    endTime: this.props.initalEndTime || dateFns.addHours(setInitalTime(), 12),
    toggleTimer: {
      start: false,
      end: false
    }
  };

  toggleWatcher = (value = "start" | "end") => {
    if (value === "start") {
      this.setState({ toggleTimer: { start: !this.state.toggleTimer.start } });
    }
    if (value === "end") {
      this.setState({ toggleTimer: { end: !this.state.toggleTimer.end } });
    }
  };
  setStartTime = newTime => this.setState({ startTime: newTime });
  setEndTime = newTime => this.setState({ endTime: newTime });
  options = [
    {
      label: "Every 30 min",
      value: 0
    },
    {
      label: "Every hour",
      value: 1
    },
    {
      label: "Every 2 hrs",
      value: 2
    },
    {
      label: "Every 4 hrs",
      value: 3
    },
    {
      label: "Every 6 hrs",
      value: 4
    }
  ];
  render() {
    return (
      <View style={styles.wrapper}>
        <View
          style={{
            height: 100,
            marginTop: 44,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            borderBottomWidth: 1,
            borderBottomColor: "#C4C4C4"
          }}
        >
          <Text style={styles.title}> Remind Me</Text>
        </View>
        <View>
          {this.options.map((option, key) => {
            return (
              <FrequencyOption
                key={key}
                label={option.label}
                value={option.value}
                onPress={() => {
                  this.props.setFrequency(option.value);
                }}
                selected={this.props.frequency === option.value}
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
        <TimePeriod
          title="Start"
          time={dateFns.format(this.state.startTime, "HH:mm")}
          onPress={() => {
            this.toggleWatcher("start");
          }}
        />
        {this.state.toggleTimer.start && (
          <DatePickerIOS
            date={this.state.startTime}
            onDateChange={this.setStartTime}
            mode="time"
            minuteInterval="10"
          />
        )}
        <TimePeriod
          title="End"
          time={dateFns.format(this.state.endTime, "HH:mm")}
          onPress={() => {
            this.toggleWatcher("end");
          }}
        />
        {this.state.toggleTimer.end && (
          <DatePickerIOS
            date={this.state.endTime}
            onDateChange={this.setEndTime}
            mode="time"
            minuteInterval="10"
          />
        )}
      </View>
    );
  }
}
export class Home extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            height: 100,
            marginTop: 44,
            width: "100%",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Text style={styles.title}> Daily Stoic</Text>
        </View>
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
        <View
          style={{
            height: "15%",
            width: "100%",
            alignItems: "center"
          }}
        >
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={this.props.setReminder}
            activeOpacity={0.4}
          >
            <View
              style={{
                width: 30
              }}
            />
            <Text style={{ textAlign: "center", flexGrow: 1 }}>
              Set Reminder
            </Text>
            <Icon
              name="chevron-right"
              type="feather"
              color="#444444"
              size={30}
            />
          </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: "#C4C4C4"
  }
});
