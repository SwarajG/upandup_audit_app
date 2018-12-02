import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View
} from 'react-native';

type Props = {};
export default class PopupHeader extends Component<Props> {
  render() {
    const { updateModalVisibility, text } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.headerTextWrapper}>
          <Text style={styles.headerText}>{text}</Text>
        </View>
        <View style={styles.closeButtonWraper}>
          <TouchableOpacity
            onPress={updateModalVisibility(false)}
          >
            <Text style={styles.buttonText}>X</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 40
  },
  headerText: {
    fontSize: 24,
  },
  headerTextWrapper: {
    flex: 9
  },
  closeButtonWraper: {
    flex: 1,
    alignItems: 'flex-end',
    padding: 10
  },
  buttonText: {
    color: '#000'
  }
});