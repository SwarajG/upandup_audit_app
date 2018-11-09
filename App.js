import React, { Component } from 'react';
import { StyleSheet, View, Button, TextInput } from 'react-native';

type Props = {};
export default class App extends Component<Props> {
  state = {
    username: '',
    password: ''
  };
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

  onPressLogin = () => {
    const { username, password } = this.state;
    // const { navigate } = this.props.navigation;
    if (username.toLowerCase() === 'swaraj' && password === '1234') {
      // navigate('Profile')
    }
  }

  updateUserName = (username) => {
    this.setState({ username });
  }

  updatePassword = (password) => {
    this.setState({ password });
  }

  render() {
    const { username, password } = this.state;
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          onChangeText={this.updateUserName}
          value={username}
          placeholder="User Name"
        />
        <TextInput
          style={styles.input}
          onChangeText={this.updatePassword}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
        />
        <Button
          onPress={this.onPressLogin}
          title="Login"
          color="#841584"
          style={styles.button}
          accessibilityLabel="Login to enter up&up audit"
        />
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
    borderWidth: 1,
    width: '80%',
    marginBottom: 20,
    paddingLeft: 10
  },
  button: {
    height: 40,
    width: '40%',
    backgroundColor: '#2196F3'
  }
});
