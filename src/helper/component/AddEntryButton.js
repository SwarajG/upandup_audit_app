import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';

type Props = {};
export default class AddEntryButton extends Component<Props> {
  render() {
    const { updateModalVisibility } = this.props;
    return (
      <TouchableOpacity
        onPress={updateModalVisibility(true)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Add Entry</Text>
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
    display: 'flex',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF'
  }
});