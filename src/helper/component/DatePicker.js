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
        <View>
          <Text>Date: {currentDateInFormat}</Text>
          <TouchableOpacity onPress={this.showDateTimePicker}>
            <Text>Choose date</Text>
          </TouchableOpacity>
        </View>
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
