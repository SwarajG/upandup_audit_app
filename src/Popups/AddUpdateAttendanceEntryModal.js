import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Picker
} from 'react-native';
import DatePicker from '../helper/component/DatePicker';
import moment from 'moment';
import Modal from 'react-native-modal';
import request from '../helper/request';

type Props = {
  isVisibleModal: Boolean
};
export default class AddUpdateAttendanceEntryModal extends Component<Props> {
  constructor(props) {
    super(props);
    const isEditing = props.editing;
    const { editingData } = props;
    const userEmail = isEditing ? editingData.userEmail : '';
    const startTime = isEditing ? editingData.startTime : '00:00';
    const endTime = isEditing ? editingData.endTime : '00:00';
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

  onChangedNumberInput = key => text => this.setState({ [key]: text.replace(/[^0-9]/g, '') });

  renderUsers = userList => userList.map(user => (
    <Picker.Item
      key={user._id}
      label={user.email}
      value={user.email}
    />
  ))

  renderUsersList = (userList, userEmail) => (
    <Picker
      selectedValue={userEmail}
      onValueChange={this.onValueChange('userEmail')}
    >
      {this.renderUsers(userList)}
    </Picker>
  )

  renderTimePicker = (type, time, title) => (
    <View style={{ marginTop: 10, flex: 4 }}>
      <Text style={styles.inputTitle}>{title}</Text>
      <DatePicker
        updateDate={this.updateDate(type)}
        mode="time"
        time={time}
      />
    </View>
  )

  render() {
    const { updateModalVisibility } = this.props;
    const { startTime, endTime, userEmail, userList } = this.state;
    return (
      <Modal
        isVisible={true}
        onBackdropPress={updateModalVisibility(false)}
        onBackButtonPress={updateModalVisibility(false)}
      >
        <View style={styles.modalWrapper}>
          <Text style={{ fontSize: 24, marginBottom: 40, flex: 1 }}>Add Attendance</Text>
          {this.renderUsersList(userList, userEmail)}
          {this.renderTimePicker('startTime', startTime)}
          {this.renderTimePicker('endTime', endTime)}
          <TouchableOpacity
            onPress={this.createAttendanceEntry}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
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
  modalWrapper: {
    marginTop: 50,
    marginBottom: 50,
    padding: 20,
    flex: 10,
    zIndex: 100,
    backgroundColor: '#FFF',
    alignContent: 'flex-start',
    justifyContent: 'center',
    borderRadius: 3,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    marginBottom: 20
  },
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 25,
    paddingRight: 25,
    borderRadius: 3,
    backgroundColor: '#2196F3',
    marginBottom: 40,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonWrapper: {
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFF'
  }
});
