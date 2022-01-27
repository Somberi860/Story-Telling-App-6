import React, { Component } from "react";
import { StyleSheet, Text, View, SafeAreaView, Platform, StatusBar, Image, Switch } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import firebase from "firebase";


import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      isEnabled: false,
      light_theme: true,
      profile_image: '',
      name: ""
    }
  }
  toggleSwitch() {
    const previous_state = this.state.isEnabled;
    const theme = !this.state.isEnabled ? 'dark' : 'light';
    var updates = {};
    updates[
      '/users/' + firebase.auth().currentUser.uid + '/current_theme'
    ] = theme;
    firebase
      .database()
      .ref()
      .update(updates);
    this.setState({ inEnabled: !previous_state, light_theme: previous_state })
  }
  async_loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }
  componentDidMount() {
    this.async_loadFontsAsync();
    this.fetchUser();
  }

  async fetchUser() {
    let theme, name, image;
    await firebase
      .database()
      .ref('/users/' + firebase.auth().currentUser.uid)
      .on('value', function (snapshot) {
        theme = snapshot.val().current_theme;
        name = '${snapshot.val().first_name}${snapshot.val().last_name}';
        image = snapshot.val().profile_picture;
      })
    this.setState({
      light_theme: theme === 'light' ? true : false,
      isEnable: theme === 'light' ? false : true,
      name: name, profile_image: image
    })
  }


  render() {
    return (
      <View style={styles.container}>
        <Text>Profile</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
