import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  // AsyncStorage,
  Text,
  TouchableOpacity
} from 'react-native';

type Props = {};
export default class StockTransfer extends Component<Props> {
  // async componentDidMount() {
  //   try {
  //     const outletObject = await AsyncStorage.getItem('outlet');
  //     const outlet = JSON.parse(outletObject);
  //   } catch (error) {
  //     alert('Failed to fetch outlet object...');
  //   }
  // }

  render() {
    return (
      <View style={styles.container}>
        <Text>Hello World 3</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 25,
    paddingRight: 25,
    borderRadius: 3,
    width: '80%',
    backgroundColor: '#2196F3',
    display: 'flex',
    alignItems: 'center',
    marginBottom: 40
  },
  buttonText: {
    color: '#FFF'
  }
});
