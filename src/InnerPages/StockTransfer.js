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
import AddUpdateStockTransferModal from '../Popups/AddUpdateStockTransferModal';
import request from '../helper/request';

const currentDate = new Date();
const tableHead = ['Name', 'Unit', 'Quantity', 'Transfered to', '', ''];
const keys = ['itemName', 'unit', 'quantity', 'transferedTo'];
const widthArr = [160, 50, 80, 200, 80, 80];

type Props = {};
export default class StockTransfer extends Component<Props> {
  state = {
    stockTransfers: [],
    itemList: [],
    isVisibleModal: false,
    outlet: {},
    outlets: [],
    date: currentDate,
    editing: false,
    editingData: {}
  };

  async componentDidMount() {
    this.fetchOutlets();
  }

  findOutletNameFromId = (outlets, outletId) => outlets.find(o => o._id === outletId).name;

  fetchOutlets = async () => {
    try {
      const outletListObject = await request.getAllOutlets();
      const outlets = await outletListObject.json();
      this.setState({ outlets }, this.refetchList);
    } catch (error) {
      alert('Failed to fetch outlets object...');
    }
  }

  updateData = (itemList, outlet, stockTransfers) => {
    const { outlets } = this.state;
    stockTransfers.forEach((item) => {
      item.transferedTo = this.findOutletNameFromId(outlets, item.toOutletId);
    });
    this.setState({
      itemList,
      outlet,
      stockTransfers
    });
  }

  updateModalVisibility = status => () => {
    const editing = !status;
    this.setState({ isVisibleModal: status, editing });
  }

  updateDate = date => this.setState({ date }, this.refetchList);

  editRow = (rowIndex) => {
    const { stockTransfers } = this.state;
    const currentRowData = stockTransfers[rowIndex];
    const editingData = {
      quantity: currentRowData.quantity,
      item: currentRowData.itemId,
      unit: currentRowData.unit,
      outlet: currentRowData.toOutletId,
      _id: currentRowData._id
    };
    this.setState({
      isVisibleModal: true,
      editing: true,
      editingData
    });
  }

  deleteRow = async (rowIndex) => {
    const { stockTransfers } = this.state;
    const entryId = stockTransfers[rowIndex]._id;
    await request.deleteStockTransferEntry(entryId);
    this.refetchList();
  }

  refetchList = async () => {
    try {
      const { date } = this.state;
      const outletObject = await AsyncStorage.getItem('outlet');
      const itemListObject = await request.getAlltheStockItems();
      const itemList = await itemListObject.json();

      const outlet = JSON.parse(outletObject);
      const stockTransferFilters = {
        fromOutletId: outlet._id,
        date: moment(date).format('DD/MM/YYYY')
      };
      request.getAllstockTransferForOutlet(stockTransferFilters)
        .then(response => response.json())
        .then(response => this.updateData(itemList, outlet, response));
    } catch (error) {
      alert('Error while fetching stock transfer data...');
    }
  }

  renderAddEntryButton = () => (
    <AddEntryButton
      updateModalVisibility={this.updateModalVisibility}
    />
  )

  renderTable = () => (
    <View style={{ flex: 9 }}>
      <CustomTable
        data={this.state.stockTransfers}
        outlets={this.state.outlets}
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
    const { itemList, outlet, outlets, date, editing, editingData } = this.state;
    const outletId = outlet._id;
    return (
      <AddUpdateStockTransferModal
        itemList={itemList}
        updateModalVisibility={this.updateModalVisibility}
        outletId={outletId}
        date={date}
        outlets={outlets}
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
