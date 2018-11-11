import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Picker
} from 'react-native';
import moment from 'moment';
import Modal from 'react-native-modal';
import enums from './helper/enums';
import request from './helper/request';

type Props = {
  isVisibleModal: Boolean
};
export default class AddInventoryCountingModal extends Component<Props> {
  state = {
    quantity: 0,
    item: '',
    unit: enums.UNITS.KG,
    itemList: []
  };

  async componentDidMount() {
    try {
      const itemListObject = await request.getAlltheStockItems();
      const itemList = await itemListObject.json();
      const item = itemList[0]._id;
      this.updateData(itemList, item);
    } catch (error) {
      alert('Failed to fetch outlet object...');
    }
  }

  updateData = (itemList, item) => this.setState({ itemList, item });

  createStockItemEntry = async () => {
    const { updateModalVisibility, outletId, date, refetchList } = this.props;
    const { item, unit, quantity, itemList } = this.state;
    const selectedItemObject = itemList.find(i => i._id === item);
    const { _id, name } = selectedItemObject;
    try {
      const stockItemEntry = {
        outletId,
        itemId: _id,
        itemName: name,
        unit,
        quantity,
        entryDate: moment(date).format('DD/MM/YYYY')
      };
      const responseObject = await request.createStockItemEntry(stockItemEntry);
      const response = await responseObject.json();
      refetchList();
      updateModalVisibility(false)();
      
    } catch (error) {
      alert('Error while creating stock entry...');
    }
  }

  onValueChange = key => value => this.setState({ [key]: value });

  onChangedNumberInput = key => text => this.setState({ [key]: text.replace(/[^0-9]/g, '') });

  renderItems = itemList => itemList.map(item => (
    <Picker.Item
      key={item._id}
      label={item.name}
      value={item._id}
    />
  ))

  renderUnits = () => {
    const unitsList = [];
    Object.values(enums.UNITS).forEach(unit => {
      unitsList.push(
        <Picker.Item
          key={unit}
          label={unit}
          value={unit}
        />
      );
    });
    return unitsList;
  }

  renderRowMaterials = (itemList, item) => (
    <Picker
      selectedValue={item}
      onValueChange={this.onValueChange('item')}
    >
      {this.renderItems(itemList)}
    </Picker>
  )

  renderUnit = unit => (
    <Picker
      selectedValue={unit}
      onValueChange={this.onValueChange('unit')}
    >
      {this.renderUnits()}
    </Picker>
  )

  render() {
    const { isVisibleModal, updateModalVisibility } = this.props;
    const { quantity, price, item, unit, itemList } = this.state;
    return (
      <Modal
        isVisible={isVisibleModal}
        onBackdropPress={updateModalVisibility(false)}
        onBackButtonPress={updateModalVisibility(false)}
      >
        <View style={styles.modalWrapper}>
          {this.renderRowMaterials(itemList, item)}
          {this.renderUnit(unit)}
          <TextInput
            autoCapitalize={'none'}
            maxLength={10}
            placeholder="quantity"
            value={quantity}
            onChangeText={this.onChangedNumberInput('quantity')}
            style={styles.input}
          />
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
    flex: 1,
    zIndex: 100,
    backgroundColor: '#FFF',
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
  input: {
    width: '50%',
    justifyContent: 'center'
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
    justifyContent: 'center',
    marginBottom: 40
  },
  buttonText: {
    color: '#FFF'
  }
});
