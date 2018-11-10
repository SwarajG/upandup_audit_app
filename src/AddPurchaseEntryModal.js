import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  AsyncStorage,
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  Picker
} from 'react-native';
import Modal from 'react-native-modal';
import enums from './helper/enums';
import request from './helper/request';

type Props = {
  isVisibleModal: Boolean
};
export default class AddPurchaseEntryModal extends Component<Props> {
  state = {
    quantity: 0,
    price: 0,
    item: '',
    unit: enums.UNITS.KG,
    itemList: []
  };

  async componentDidMount() {
    try {
      const itemListObject = await request.getAlltheItems();
      const itemList = await itemListObject.json();
      this.updateData(itemList);
    } catch (error) {
      alert('Failed to fetch outlet object...');
    }
  }

  updateData = itemList => this.setState({ itemList });

  createPurchaseEntry = async () => {
    const { updateModalVisibility, outletId, date } = this.props;
    const { item, unit, quantity, price, itemList } = this.state;
    const selectedItemObject = itemList.find(i => i._id === item);
    const { _id, name } = selectedItemObject;
    try {
      const purchaseEntry = {
        outletId,
        itemId: _id,
        itemName: name,
        unit,
        quantity,
        price,
        createAt: date
      };
      console.log(purchaseEntry);
      await request.createPurchaseEntry(purchaseEntry);
      await responseObject.json();
      updateModalVisibility(false)();
    } catch (error) {
      alert('Error while creating purchase entry...');
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
            placeholder="price"
            value={price}
            onChangeText={this.onChangedNumberInput('price')}
            style={styles.input}
          />
          <TextInput
            autoCapitalize={'none'}
            maxLength={10}
            placeholder="quantity"
            value={quantity}
            onChangeText={this.onChangedNumberInput('quantity')}
            style={styles.input}
          />
          <TouchableOpacity
            onPress={this.createPurchaseEntry}
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
