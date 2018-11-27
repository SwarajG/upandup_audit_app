import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Picker
} from 'react-native';
import FloatingLabel from 'react-native-floating-labels';
import moment from 'moment';
import Modal from 'react-native-modal';
import enums from './helper/enums';
import request from './helper/request';

type Props = {
  isVisibleModal: Boolean
};
export default class AddAttendanceEntryModal extends Component<Props> {
  constructor(props) {
    super(props);
    const isEditing = props.editing;
    const { editingData } = props;
    const start_time = isEditing ? editingData.start_time : '00:00';
    const end_time = isEditing ? editingData.end_time : '00:00';
    this.state = {
      start_time,
      end_time,
      userEmail: '',
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

  createAttendanceEntry = async () => {
    const { updateModalVisibility, outletId, date, refetchList, editing } = this.props;
    const { userEmail, start_time, end_time, userList } = this.state;
    const selectedUserObject = userList.find(i => i.email === userEmail);
    const { email, _id } = selectedUserObject;
    const isEditing = editing;
    try {
      const attendanceEntry = {
        outletId,
        userId: _id,
        email,
        start_time,
        end_time,
        entryDate: moment(date).format('DD/MM/YYYY')
      };
      if (isEditing) {
        const { editingData } = this.props;
        const responseObject = await request.updateAttendanceEntry(editingData._id, { ...attendanceEntry,
          _id: editingData._id
        });
        const response = await responseObject.json();
      } else {
        const responseObject = await request.createAttendanceEntry(attendanceEntry);
        const response = await responseObject.json();
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
      value={user._id}
    />
  ))

  renderStockMaterials = (userList, item) => (
    <Picker
      selectedValue={item}
      onValueChange={this.onValueChange('item')}
    >
      {this.renderUsers(userList)}
    </Picker>
  )

  render() {
    const { updateModalVisibility } = this.props;
    const { start_time, end_time, item, unit, userList } = this.state;
    return (
      <Modal
        isVisible={true}
        onBackdropPress={updateModalVisibility(false)}
        onBackButtonPress={updateModalVisibility(false)}
      >
        <View style={styles.modalWrapper}>
          {/* {this.renderStockMaterials(userList, item)}
          {this.renderUnit(unit)} */}
          {/* <FloatingLabel
            placeholder="quantity"
            defaultValue={quantity.toString()}
            onChangeText={this.onChangedNumberInput('quantity')}
            style={styles.input}
          /> */}
          <TouchableOpacity
            onPress={this.createStockItemEntry}
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
  modalWrapper: {
    marginTop: 50,
    marginBottom: 50,
    padding: 20,
    flex: 1,
    zIndex: 100,
    backgroundColor: '#FFF',
    alignContent: 'center',
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
  },
  buttonWrapper: {
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFF'
  }
});
