import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  AsyncStorage
} from 'react-native';
import Navigator from './Navigator';

type Props = {};
export default class LoginPage extends Component<Props> {
  state = {
    username: '',
    password: '',
    userLoggedIn: false,
    user: {}
  };

  onPressLogin = () => {
    const { username, password } = this.state;
    if (username === 'swaraj' && password === '1234') {
      const user = {
        id: 'test1234',
        username
      };
      this.setUserCredentials(user);
    }
    // Delete after testing...
    else {
      const user = {
        id: 'test1234',
        username: 'swaraj'
      };
      this.setUserCredentials(user);
    }
  }

  setUserCredentials = (user) => {
    const loggedInUser = JSON.stringify(user);
    AsyncStorage.setItem('loggedInUser', loggedInUser);
    this.setState({
      userLoggedIn: true,
      user
    });
  }

  updateUserName = username => this.setState({ username })

  updatePassword = password => this.setState({ password })

  render() {
    const { username, password, userLoggedIn, user } = this.state;
    if (userLoggedIn) {
      return <Navigator user={user} />
    }
    return (
      <View style={styles.container}>
        <TextInput
          autoCapitalize={'none'}
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
        <TouchableOpacity
          onPress={this.onPressLogin}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
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
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 25,
    paddingRight: 25,
    borderRadius: 3,
    width: '40%',
    backgroundColor: '#2196F3',
    display: 'flex',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF'
  }
});
