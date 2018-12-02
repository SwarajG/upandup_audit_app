import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Picker
} from 'react-native';
import FloatingLabel from 'react-native-floating-labels';
import Modal from 'react-native-modal';
import DatePicker from '../helper/component/DatePicker';
import PopupHeader from '../helper/component/PopupHeader';
import SubmitButton from '../helper/component/SubmitButton';
import moment from 'moment';
import enums from '../helper/enums';
import request from '../helper/request';
import { commonStyles } from '../helper/styles';

type Props = {
  isVisibleModal: Boolean
};
export default class AddUpdateStaffFoodEntryModal extends Component<Props> {
  constructor(props) {
    super(props);
    const isEditing = props.editing;
    const { editingData } = props;
    const currentTime = moment(new Date()).format('HH:mm');
    const userEmail = isEditing ? editingData.userEmail : '';
    const mealType = isEditing ? editingData.mealType : enums.FOOD_TIME.LUNCH;
    const foodTime = isEditing ? editingData.foodTime : currentTime;
    const itemName = isEditing ? editingData.itemName : '';
    const foodTimeType = isEditing ? editingData.foodTimeType : enums.FOOD_TIME.LUNCH;
    this.state = {
      foodTime,
      itemName,
      mealType,
      userEmail,
      userList: [],
      foodTimeType
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
    const timeInHours = moment(date).format('HH:mm');
    this.setState({
      [type]: timeInHours
    });
  }

  createStaffFoodEntry = async () => {
    const { updateModalVisibility, outletId, date, refetchList, editing } = this.props;
    const { userEmail, foodTime, userList, foodTimeType, itemName } = this.state;
    const selectedUserObject = userList.find(i => i.email === userEmail);
    const { email, _id } = selectedUserObject;
    const isEditing = editing;
    try {
      const attendanceEntry = {
        outletId,
        mealType: foodTimeType,
        userId: _id,
        email,
        foodTime,
        itemName,
        entryDate: moment(date).format('DD/MM/YYYY')
      };
      if (isEditing) {
        const { editingData } = this.props;
        await request.updateStaffFoodEntry(editingData._id, { ...attendanceEntry,
          _id: editingData._id
        });
      } else {
        await request.createStaffFoodEntry(attendanceEntry);
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

  renderEatingTime = () => (
    <Picker
      selectedValue={this.state.foodTimeType}
      onValueChange={this.onValueChange('foodTimeType')}
      style={styles.pickerStyle}
    >
      <Picker.Item
        key={enums.FOOD_TIME.LUNCH}
        label={enums.FOOD_TIME.LUNCH}
        value={enums.FOOD_TIME.LUNCH}
      />
      <Picker.Item
        key={enums.FOOD_TIME.DINNER}
        label={enums.FOOD_TIME.DINNER}
        value={enums.FOOD_TIME.DINNER}
      />
    </Picker>
  )

  renderItemName = itemName => (
    <FloatingLabel
      style={styles.input}
      value={itemName}
      onChangeText={this.onValueChange('itemName')}
    >
      Item Name
    </FloatingLabel>
  )

  renderSubmitButton = () => <SubmitButton  onPress={this.createStaffFoodEntry} />

  render() {
    const { updateModalVisibility, isEditing } = this.props;
    const { foodTime, userEmail, userList, itemName } = this.state;
    const text = isEditing ? 'Update Staff Food Entry' : 'Add Staff Food Entry';
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
          {this.renderEatingTime()}
          {this.renderItemName(itemName)}
          {this.renderTimePicker('foodTime', foodTime, 'Eating Time')}
          {this.renderSubmitButton()}
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  ...commonStyles,
});
