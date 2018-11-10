import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  AsyncStorage,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ScrollView,
  Picker
} from 'react-native';
import { Table, Row } from 'react-native-table-component';
import AddPurchaseEntryModal from './AddPurchaseEntryModal';
import request from './helper/request';


type Props = {};
export default class PurchaseEntry extends Component<Props> {
  state = {
    purchaseEntries: [],
    tableHead: ['Name', 'Unit', 'Quantity', 'Price'],
    widthArr: [160, 50, 80, 80],
    itemList: [],
    isVisibleModal: false,
    outlet: {},
    date: new Date().toISOString()
  };

  async componentDidMount() {
    try {
      const outletObject = await AsyncStorage.getItem('outlet');
      const itemListObject = await request.getAlltheItems();
      const itemList = await itemListObject.json();

      const outlet = JSON.parse(outletObject);
      const currentDate = new Date().toISOString();
      request.getAllpurchaseEntriesForOutlet(outlet._id, currentDate)
        .then(response => response.json())
        .then(response => this.updateData(itemList, outlet, response));
    } catch (error) {
      alert('Failed to fetch outlet object...');
    }
  }

  updateData = (itemList, outlet, purchaseEntries) => this.setState({
    itemList,
    outlet,
    purchaseEntries
  });

  updateModalVisibility = status => () => this.setState({ isVisibleModal: status });

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
    const { purchaseEntries, tableHead, widthArr } = this.state;
    const tableData = purchaseEntries.map(entry => [
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
      <AddPurchaseEntryModal
        isVisibleModal={isVisibleModal}
        itemList={itemList}
        updateModalVisibility={this.updateModalVisibility}
        outletId={outletId}
        date={date}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {/* {this.renderLoader()} */}
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
