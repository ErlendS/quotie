import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";

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
    console.log("ACTIVATE!");
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
  onSetFrequency = frequency => {
    this.setState({
      frequency
    });
  };
  // Set TouchableOpacity and onPress functionality
  // figure out how to display checkmark on selected frequency.

  render() {
    return this.state.screen === "home" ? (
      <Home setReminder={this.goToSetReminder} />
    ) : (
      <SetReminder />
    );
  }
}

const TimePeriod = ({ title, time }) => (
  <View style={styles.selectors}>
    <Text style={styles.baseText}>{title}</Text>
    <Text style={styles.baseText}>{time}</Text>
  </View>
);
const Cycle = ({ period, selected }) => (
  <View style={styles.selectors}>
    <Text style={styles.baseText}>Every {period}</Text>
    {selected ? (
      <Icon name="check" type="feather" color="#444444" size={15} />
    ) : null}
  </View>
);
export class SetReminder extends React.Component {
  cycleOptions = ["30 min", "hour", "2 hrs", "4hrs", "6hrs"];
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
        <View styles={styles.selectorsContainer}>
          {this.cycleOptions.map((cycleOption, key) => {
            return <Cycle key={key} period={cycleOption} selected={true} />;
          })}
          <View
            style={{
              height: 100,
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              borderBottomWidth: 1,
              borderBottomColor: "#C4C4C4"
            }}
          >
            <Text style={styles.subTitle}> From</Text>
          </View>
          <TimePeriod title="Start" time="09:00" />
          <TimePeriod title="End" time="22:00" />
        </View>
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
  wrapper: {
    flex: 1,
    backgroundColor: "#F6F6F6",
    fontFamily: "Cochin"
  }
});
