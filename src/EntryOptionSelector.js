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

  onPressEditEntry = () => {
    const { navigate } = this.props.navigation;
    navigate('EntryTabs');
  }

  onPressStaffAttendance = () => {
    const { navigate } = this.props.navigation;
    alert('Hello World');
    navigate('StaffAttendance');
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.onPressEditEntry}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Stock & Purchase related entry / edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.onPressStaffAttendance}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Staff Attendance</Text>
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
