import React, { Component } from 'react';
import { StyleSheet, View, Button, TextInput } from 'react-native';
import { StackNavigator } from 'react-navigation';

const App = StackNavigator({
  Home: { screen: HomeScreen },
  Profile: { screen: ProfileScreen },
});

type Props = {};
export default class Profile extends Component<Props> {
  // componentDidMount() {
  //   fetch(`http://localhost:5000/outlets`, {
  //     method: 'POST',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       name: 'Gandhinagar',
  //       address: 'Testing outlet...',
  //     })
  //   })
  //     .then(response => response.json())
  //     .then(response => console.log(response));
  // }

  render() {
    const { username, password } = this.state;
    return (
      <View style={styles.container}>
        Hello world
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  input: {
    height: 30,
    borderColor: 'black',
    borderWidth: 0,
    width: '80%',
    borderBottomWidth: 1,
    marginBottom: 20
  },
  button: {
    height: 40,
    width: '40%',
    backgroundColor: '#2196F3'
  }
});
