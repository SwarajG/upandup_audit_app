import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  AsyncStorage,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import moment from 'moment';
import { Table, Row } from 'react-native-table-component';
import DateTimePicker from 'react-native-modal-datetime-picker';
import AddInventoryCountingModal from './AddInventoryCountingModal';
import request from './helper/request';

const currentDate = new Date();

type Props = {};
export default class StockCounting extends Component<Props> {
  state = {
    stockCounting: [],
    tableHead: ['Name', 'Unit', 'Quantity'],
    widthArr: [160, 50, 80],
    itemList: [],
    isVisibleModal: false,
    outlet: {},
    date: currentDate,
    isDateTimePickerVisible: false
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

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
 
  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
 
  _handleDatePicked = (date) => {
    this.setState({ date }, this.refetchList);
    this._hideDateTimePicker();
  };

  refetchList = async () => {
    const { date } = this.state;
    const outletObject = await AsyncStorage.getItem('outlet');
      const itemListObject = await request.getAlltheStockItems();
      const itemList = await itemListObject.json();

      const outlet = JSON.parse(outletObject);
      const selectedDate = moment(date).format('DD/MM/YYYY');
      request.getAllstockCountingsForOutlet(outlet._id, selectedDate)
        .then(response => response.json())
        .then(response => this.updateData(itemList, outlet, response));
  }

  renderLoader = () => (
    <View style={[styles.container, styles.loaderWrapper]}>
      <ActivityIndicator size="small" color="#2196F3" />
    </View>
  )

  renderAddEntryButton = () => {
    return (
      <TouchableOpacity
        onPress={this.updateModalVisibility(true)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Add Entry</Text>
      </TouchableOpacity>
    );
  }

  renderTable = () => {
    const { stockCounting, tableHead, widthArr } = this.state;
    if (stockCounting.length === 0) {
      return (
        <View style={{ flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
          {this.renderAddEntryButton()}
          <Text>No Entries for this date...</Text>
        </View>
      )
    }
    const tableData = stockCounting.map(entry => [
      entry.itemName, entry.unit, entry.quantity, entry.price
    ]);
    return (
      <View style={[styles.container, styles.containerWrapper]}>
        {this.renderAddEntryButton()}
        <ScrollView horizontal={true}>
          <View>
            <Table borderStyle={{ borderColor: '#C1C0B9' }}>
              <Row
                data={tableHead}
                widthArr={widthArr}
                style={styles.row}
                textStyle={styles.text}
              />
            </Table>
            <ScrollView style={styles.dataWrapper}>
              <Table borderStyle={{ borderColor: '#C1C0B9' }}>
                {
                  tableData.map((rowData, index) => (
                    <Row
                      key={index}
                      data={rowData}
                      widthArr={widthArr}
                      style={[styles.row, index%2 && { backgroundColor: '#F7F6E7' }]}
                      textStyle={styles.text}
                    />
                  ))
                }
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    );
  }

  renderModal = () => {
    const { isVisibleModal, itemList, outlet, date } = this.state;
    const outletId = outlet._id;
    return (
      <AddInventoryCountingModal
        isVisibleModal={isVisibleModal}
        itemList={itemList}
        updateModalVisibility={this.updateModalVisibility}
        outletId={outletId}
        date={date}
        refetchList={this.refetchList}
      />
    );
  }

  renderDatePicker = () => {
    const { isDateTimePickerVisible, date } = this.state;
    const currentDateInFormat = moment(date).format('DD/MM/YYYY');
    return (
      <View>
        <View>
          <Text>Date: {currentDateInFormat}</Text>
          <TouchableOpacity onPress={this._showDateTimePicker}>
            <Text>Choose date</Text>
          </TouchableOpacity>
        </View>
        <DateTimePicker
          isVisible={isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
          date={date}
        />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {/* {this.renderLoader()} */}
        {this.renderDatePicker()}
        {this.renderTable()}
        {this.renderModal()}
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
  },
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
