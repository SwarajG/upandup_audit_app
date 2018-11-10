import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  // AsyncStorage,
  Text,
  TouchableOpacity
} from 'react-native';

type Props = {};
export default class EntryOptionSelector extends Component<Props> {
  static navigationOptions = {
    title: 'Select entry option',
  };

  // async componentDidMount() {
  //   try {
  //     const outletObject = await AsyncStorage.getItem('outlet');
  //     const outlet = JSON.parse(outletObject);
  //   } catch (error) {
  //     alert('Failed to fetch outlet object...');
  //   }
  // }

  onPressEditEntry = () => {
    const { navigate } = this.props.navigation;
    navigate('EntryTabs');
  }

  onPressView = () => {

  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.onPressEditEntry}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Stock & Purchase related entry/edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.onPressView}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Stock & Purchase view</Text>
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
