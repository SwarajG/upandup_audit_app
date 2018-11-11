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
import AddUpdateInventoryCountingModal from './AddUpdateInventoryCountingModal';
import request from './helper/request';

const currentDate = new Date();
const tableHead = ['Name', 'Unit', 'Quantity', '', ''];
const keys = ['itemName', 'unit', 'quantity'];
const widthArr = [160, 50, 80, 80, 80];

type Props = {};
export default class StockCounting extends Component<Props> {
  state = {
    stockCounting: [],
    itemList: [],
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

  updateData = (itemList, outlet, stockCounting) => this.setState({
    itemList,
    outlet,
    stockCounting
  });

  updateModalVisibility = status => () => this.setState({ isVisibleModal: status });

  updateDate = date => this.setState({ date });

  refetchList = async () => {
    const { date } = this.state;
    const outletObject = await AsyncStorage.getItem('outlet');
      const itemListObject = await request.getAlltheStockItems();
      const itemList = await itemListObject.json();

      const outlet = JSON.parse(outletObject);
      const stockCountingFilters = {
        outletId: outlet._id,
        date: moment(date).format('DD/MM/YYYY')
      };
      request.getAllstockCountingsForOutlet(stockCountingFilters)
        .then(response => response.json())
        .then(response => this.updateData(itemList, outlet, response));
  }

  editRow = (rowIndex) => {
    const { stockCounting } = this.state;
    const currentRowData = stockCounting[rowIndex];
    const editingData = {
      quantity: currentRowData.quantity,
      item: currentRowData.itemId,
      unit: currentRowData.unit,
    };
    this.setState({
      isVisibleModal: true,
      editing: true,
      editingData
    });
  }

  deleteRow = async (rowIndex) => {
    const { stockCounting } = this.state;
    const entryId = stockCounting[rowIndex]._id;
    const responseObject = await request.deleteStockItemEntry(entryId);
    const response = await responseObject.json();
    this.refetchList();
  }

  renderAddEntryButton = () => (
    <AddEntryButton
      updateModalVisibility={this.updateModalVisibility}
    />
  )

  renderTable = () => (
    <CustomTable
      data={this.state.stockCounting}
      keys={keys}
      tableHead={tableHead}
      widthArr={widthArr}
      updateModalVisibility={this.updateModalVisibility}
      editRow={this.editRow}
      deleteRow={this.deleteRow}
    />
  )

  renderModal = () => {
    const { itemList, outlet, date, editing, editingData } = this.state;
    const outletId = outlet._id;
    return (
      <AddUpdateInventoryCountingModal
        itemList={itemList}
        updateModalVisibility={this.updateModalVisibility}
        outletId={outletId}
        date={date}
        refetchList={this.refetchList}
        editing={editing}
        editingData={editingData}
      />
    );
  }

  renderDatePicker = () => <DatePicker updateDate={this.updateDate} />;

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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderWrapper: {
    marginTop: 100
  },
  containerWrapper: {
    marginTop: 50,
    marginLeft: 15,
    marginRight: 15
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  }
});
