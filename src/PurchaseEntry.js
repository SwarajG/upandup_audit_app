import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  AsyncStorage,
} from 'react-native';
import moment from 'moment';
import AddEntryButton from './helper/component/AddEntryButton';
import CustomTable from './helper/component/CustomTable';
import DatePicker from './helper/component/DatePicker';
import AddPurchaseEntryModal from './AddUpdatePurchaseEntryModal';
import request from './helper/request';

const currentDate = new Date();
const keys = ['itemName', 'unit', 'quantity', 'price'];
const tableHead = ['Name', 'Unit', 'Quantity', 'Price', '', ''];
const widthArr = [160, 50, 80, 80, 80, 80];

type Props = {};
export default class PurchaseEntry extends Component<Props> {
  state = {
    purchaseEntries: [],
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

  updateData = (outlet, purchaseEntries) => this.setState({
    outlet,
    purchaseEntries
  });

  updateModalVisibility = status => () => {
    const editing = !status;
    this.setState({ isVisibleModal: status, editing });
  }

  updateDate = date => this.setState({ date }, this.refetchList);

  editRow = (rowIndex) => {
    const { purchaseEntries } = this.state;
    const currentRowData = purchaseEntries[rowIndex];
    const editingData = {
      quantity: currentRowData.quantity,
      item: currentRowData.itemId,
      unit: currentRowData.unit,
      price: currentRowData.price,
      _id: currentRowData._id
    };
    this.setState({
      isVisibleModal: true,
      editing: true,
      editingData
    });
  }

  deleteRow = async (rowIndex) => {
    const { purchaseEntries } = this.state;
    const entryId = purchaseEntries[rowIndex]._id;
    const responseObject = await request.deletePurchaseEntry(entryId);
    const response = await responseObject.json();
    this.refetchList();
  }

  refetchList = async () => {
    const { date } = this.state;
    const outletObject = await AsyncStorage.getItem('outlet');

      const outlet = JSON.parse(outletObject);
      const purchaseEntryfilters = {
        outletId: outlet._id,
        date: moment(date).format('DD/MM/YYYY')
      };
      request.getAllpurchaseEntriesForOutlet(purchaseEntryfilters)
        .then(response => response.json())
        .then(response => {
          console.log('purchaseEntries: ', response);
          this.updateData(outlet, response);
        });
  }

  renderAddEntryButton = () => (
    <AddEntryButton
      updateModalVisibility={this.updateModalVisibility}
    />
  )

  renderTable = () => (
    <View style={{ flex: 9 }}>
      <CustomTable
        data={this.state.purchaseEntries}
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
      <AddPurchaseEntryModal
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
