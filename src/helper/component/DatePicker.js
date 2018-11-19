import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';

const currentDate = new Date();

type Props = {};
export default class StockCounting extends Component<Props> {
  state = {
    isDateTimePickerVisible: false
  };

  showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
 
  hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
 
  handleDatePicked = (date) => {
    this.props.updateDate(date);
    this.hideDateTimePicker();
  };

  render() {
    const { date } = this.props;
    const { isDateTimePickerVisible } = this.state;
    const currentDateInFormat = moment(date).format('DD/MM/YYYY');
    return (
      <View>
        <Text style={{ justifyContent: 'center', marginBottom: 5 }}>Date: {currentDateInFormat}</Text>
        <TouchableOpacity
          onPress={this.showDateTimePicker}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Choose date</Text>
        </TouchableOpacity>
        <DateTimePicker
          isVisible={isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
          date={date}
        />
      </View>
    );
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
  },
  buttonText: {
    color: '#FFF'
  }
});
