import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  AsyncStorage,
  Image
} from 'react-native';
import Modal from 'react-native-modal';
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
        {/* <Modal
          isVisible={true}
          style={{ zIndex: 100, backgroundColor: '#FFF' }}
        >
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={{ flex: 2 }}>
              <Text>Hello World</Text>
            </View>
            <View style={{ flex: 8 }}>
              <Text>Bye world</Text>
            </View>
          </View>
        </Modal> */}
        <View style={{ flex: 4, justifyContent: 'flex-end', alignItems: 'center' }}>
          <Image
            style={{ width: 100, height: 100, marginBottom: 50 }}
            source={{ uri: "https://s3-ap-southeast-1.amazonaws.com/upandup-resources/yupp_food_logo_opt.png" }}
          />
        </View>
        <View style={{ flex: 6, justifyContent: 'flex-start', alignItems: 'center' }}>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  input: {
    borderColor: 'black',
    borderWidth: 1,
    width: '75%',
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
