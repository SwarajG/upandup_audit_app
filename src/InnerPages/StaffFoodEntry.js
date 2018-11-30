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
import AddUpdateStaffFoodEntryModal from '../Popups/AddUpdateStaffFoodEntryModal';
import request from '../helper/request';

const currentDate = new Date();
const keys = ['firstName', 'lastName', 'itemName', 'mealType', 'foodTime'];
const tableHead = ['First Name', 'Last Name', 'Meal Type', 'Time', '', ''];
const widthArr = [100, 100, 150, 80, 80, 80];

type Props = {};
export default class StaffFoodEntry extends Component<Props> {
  state = {
    staffFoodEntries: [],
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

  updateData = (outlet, staffFoodEntries) => this.setState({
    outlet,
    staffFoodEntries
  });

  updateModalVisibility = status => () => {
    const editing = !status;
    this.setState({ isVisibleModal: status, editing });
  }

  updateDate = date => this.setState({ date }, this.refetchList);

  editRow = (rowIndex) => {
    const { staffFoodEntries } = this.state;
    const currentRowData = staffFoodEntries[rowIndex];
    const editingData = {
      userEmail: currentRowData.email,
      foodTime: currentRowData.foodTime,
      mealType: currentRowData.mealType,
      itemName: currentRowData.itemName,
      _id: currentRowData._id
    };
    this.setState({
      isVisibleModal: true,
      editing: true,
      editingData
    });
  }

  deleteRow = async (rowIndex) => {
    const { staffFoodEntries } = this.state;
    const entryId = staffFoodEntries[rowIndex]._id;
    try {
      await request.deleteStaffFoodEntry(entryId);
      this.refetchList(); 
    } catch (error) {
      alert('Error while deleting the entry...', error);
    }
  }

  refetchList = async () => {
    const { date } = this.state;
    const outletObject = await AsyncStorage.getItem('outlet');

      const outlet = JSON.parse(outletObject);
      const staffEntryfilters = {
        outletId: outlet._id,
        date: moment(date).format('DD/MM/YYYY')
      };
      request.getAllstaffFoodEntriesForOutlet(staffEntryfilters)
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
        data={this.state.staffFoodEntries}
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
      <AddUpdateStaffFoodEntryModal
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
