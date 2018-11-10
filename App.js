import React, { Component } from 'react';
import {
  AsyncStorage,
  ActivityIndicator,
  StyleSheet,
  View
} from 'react-native';
import Navigator from './src/Navigator';
import enums from './src/helper/enums';
import LoginPage from './src/LoginPage';

type Props = {};
export default class App extends Component<Props> {
  state = {
    loggedInUser: null
  };

  async componentDidMount() {
    try {
      const userObject = await AsyncStorage.getItem('loggedInUser');
      const loggedInUser = JSON.parse(userObject);
      if (user.id) {
        this.setState({ loggedInUser });
      } else {
        this.setState({ loggedInUser: enums.USER_NOT_FOUND });
      }
    } catch (error) {
      this.setState({ loggedInUser: enums.USER_NOT_FOUND });
    }
  }

  render() {
    const { loggedInUser } = this.state;
    if (loggedInUser === null) {
      return (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="small" color="#2196F3" />
        </View>
      )
    } else if (loggedInUser === enums.USER_NOT_FOUND) {
      return <LoginPage />;
    }
    return <Navigator user={loggedInUser} />;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  }
})
