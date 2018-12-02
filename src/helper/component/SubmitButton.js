import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';

type Props = {};
export default class SubmitButton extends Component<Props> {
  render() {
    const { onPress } = this.props;
    return (
      <TouchableOpacity
        onPress={onPress}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 25,
    paddingRight: 25,
    borderRadius: 3,
    backgroundColor: '#2196F3',
    marginBottom: 40,
  },
  buttonText: {
    color: '#FFF'
  }
});