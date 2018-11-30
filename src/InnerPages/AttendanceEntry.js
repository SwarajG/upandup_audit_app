import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  AsyncStorage,
} from 'react-native';
import moment from 'moment';
import AddEntryButton from '../helper/component/AddEntryButton';
import CustomTable from '../helper/component/CustomTable';
import DatePicker from '../helper/component/DatePicker';
import AddUpdateAttendanceEntryModal from '../Popups/AddUpdateAttendanceEntryModal';
import request from '../helper/request';

const currentDate = new Date();
const keys = ['firstName', 'lastName', 'startTime', 'endTime'];
const tableHead = ['First Name', 'Last Name', 'Start Time', 'End Time', '', ''];
const widthArr = [100, 100, 50, 80, 80, 80];

type Props = {};
export default class AttendanceEntry extends Component<Props> {
  state = {
    attendanceEntries: [],
    isVisibleModal: false,
    outlet: {},
    date: currentDate,
    editing: false,
    editingData: {}
  };

  async componentDidMount() {
    try {
      this.refetchList();
    } catch (error) {
      alert('Failed to fetch outlet object...');
    }
  }

  updateData = (outlet, attendanceEntries) => this.setState({
    outlet,
    attendanceEntries
  });

  updateModalVisibility = status => () => {
    const editing = !status;
    this.setState({ isVisibleModal: status, editing });
  }

  updateDate = date => this.setState({ date }, this.refetchList);

  editRow = (rowIndex) => {
    const { attendanceEntries } = this.state;
    const currentRowData = attendanceEntries[rowIndex];
    const editingData = {
      userEmail: currentRowData.email,
      startTime: currentRowData.startTime,
      endTime: currentRowData.endTime,
      _id: currentRowData._id
    };
    this.setState({
      isVisibleModal: true,
      editing: true,
      editingData
    });
  }

  deleteRow = async (rowIndex) => {
    const { attendanceEntries } = this.state;
    const entryId = attendanceEntries[rowIndex]._id;
    const responseObject = await request.deleteAttendanceEntry(entryId);
    const response = await responseObject.json();
    this.refetchList();
  }

  refetchList = async () => {
    const { date } = this.state;
    const outletObject = await AsyncStorage.getItem('outlet');

      const outlet = JSON.parse(outletObject);
      const attendanceEntryfilters = {
        outletId: outlet._id,
        date: moment(date).format('DD/MM/YYYY')
      };
      request.getAllattendanceEntriesForOutlet(attendanceEntryfilters)
        .then(response => response.json())
        .then(response => this.updateData(outlet, response));
  }

  renderAddEntryButton = () => (
    <AddEntryButton
      updateModalVisibility={this.updateModalVisibility}
    />
  )

  renderTable = () => (
    <View style={{ flex: 9 }}>
      <CustomTable
        data={this.state.attendanceEntries}
        keys={keys}
        tableHead={tableHead}
        widthArr={widthArr}
        updateModalVisibility={this.updateModalVisibility}
        editRow={this.editRow}
        deleteRow={this.deleteRow}
      />
    </View>
  )

  renderModal = () => {
    const { outlet, date, editing, editingData } = this.state;
    const outletId = outlet._id;
    return (
      <AddUpdateAttendanceEntryModal
        updateModalVisibility={this.updateModalVisibility}
        outletId={outletId}
        date={date}
        refetchList={this.refetchList}
        editing={editing}
        editingData={editingData}
      />
    );
  }

  renderDatePicker = () => (
    <View style={{ marginTop: 10, flex: 1 }}>
      <DatePicker
        updateDate={this.updateDate}
        date={this.state.date}
      />
    </View>
  )

  render() {
    const { isVisibleModal } = this.state;
    return (
      <View style={styles.container}>
        {this.renderDatePicker()}
        {this.renderTable()}
        {isVisibleModal && this.renderModal()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
