import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Picker
} from 'react-native';
import DatePicker from '../helper/component/DatePicker';
import PopupHeader from '../helper/component/PopupHeader';
import SubmitButton from '../helper/component/SubmitButton';
import moment from 'moment';
import Modal from 'react-native-modal';
import request from '../helper/request';
import { commonStyles } from '../helper/styles';

type Props = {
  isVisibleModal: Boolean
};
export default class AddUpdateAttendanceEntryModal extends Component<Props> {
  constructor(props) {
    super(props);
    const isEditing = props.editing;
    const { editingData } = props;
    const currentTime = moment(new Date()).format('HH:mm');
    const userEmail = isEditing ? editingData.userEmail : '';
    const startTime = isEditing ? editingData.startTime : currentTime;
    const endTime = isEditing ? editingData.endTime : currentTime;
    this.state = {
      startTime,
      endTime,
      userEmail,
      userList: []
    };
  }

  async componentDidMount() {
    const { userEmail } = this.state;
    try {
      const userListObject = await request.getAllUsers();
      const userList = await userListObject.json();
      const newUser = userEmail ? userEmail : userList[0].email;
      this.updateData(userList, newUser);
    } catch (error) {
      alert('Failed to fetch outlet object...');
    }
  }

  updateData = (userList, userEmail) => this.setState({ userList, userEmail });

  updateDate = type => (date) => {
    const timeInHours = moment(date).format('HH:mm')
    this.setState({
      [type]: timeInHours
    });
  }

  createAttendanceEntry = async () => {
    const { updateModalVisibility, outletId, date, refetchList, editing } = this.props;
    const { userEmail, startTime, endTime, userList } = this.state;
    const selectedUserObject = userList.find(i => i.email === userEmail);
    const { email, _id } = selectedUserObject;
    const isEditing = editing;
    try {
      const attendanceEntry = {
        outletId,
        userId: _id,
        email,
        startTime,
        endTime,
        entryDate: moment(date).format('DD/MM/YYYY')
      };
      if (isEditing) {
        const { editingData } = this.props;
        await request.updateAttendanceEntry(editingData._id, { ...attendanceEntry,
          _id: editingData._id
        });
      } else {
        await request.createAttendanceEntry(attendanceEntry);
      }
      refetchList();
      updateModalVisibility(false)();
    } catch (error) {
      alert('Error while creating attendance entry...');
    }
  }

  onValueChange = key => value => this.setState({ [key]: value });

  renderUsers = userList => userList.map(user => (
    <Picker.Item
      key={user._id}
      label={`${user.firstName} ${user.lastName}`}
      value={user.email}
    />
  ))

  renderUsersList = (userList, userEmail) => (
    <Picker
      selectedValue={userEmail}
      onValueChange={this.onValueChange('userEmail')}
      style={styles.pickerStyle}
    >
      {this.renderUsers(userList)}
    </Picker>
  )

  renderTimePicker = (type, time, title) => (
    <DatePicker
      updateDate={this.updateDate(type)}
      mode="time"
      time={time}
      dateTitle={title}
    />
  )

  renderSubmitButton = () => <SubmitButton  onPress={this.createAttendanceEntry} />

  render() {
    const { updateModalVisibility, isEditing } = this.props;
    const { startTime, endTime, userEmail, userList } = this.state;
    const text = isEditing ? 'Update Attendance Entry' : 'Add Attendance Entry';
    return (
      <Modal
        isVisible={true}
        onBackButtonPress={updateModalVisibility(false)}
        style={styles.modalWrapper}
      >
        <View style={{ flex: 2 }}>
          <PopupHeader text={text} updateModalVisibility={updateModalVisibility} />
        </View>
        <View style={{ flex: 9, alignItems: 'center' }}>
          {this.renderUsersList(userList, userEmail)}
          {this.renderTimePicker('startTime', startTime)}
          {this.renderTimePicker('endTime', endTime)}
          {this.renderSubmitButton()}
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  inputTitle: {
    marginBottom: 10,
    fontSize: 14,
  },
  ...commonStyles
});
