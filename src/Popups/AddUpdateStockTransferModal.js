import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Picker
} from 'react-native';
import FloatingLabel from 'react-native-floating-labels';
import moment from 'moment';
import Modal from 'react-native-modal';
import PopupHeader from '../helper/component/PopupHeader';
import SubmitButton from '../helper/component/SubmitButton';
import { commonStyles } from '../helper/styles';
import enums from '../helper/enums';
import request from '../helper/request';

type Props = {
  isVisibleModal: Boolean
};
export default class AddUpdateStockTransferModal extends Component<Props> {
  constructor(props) {
    super(props);
    const isEditing = props.editing;
    const { editingData, outlets } = props;
    const quantity = isEditing ? editingData.quantity : 0;
    const item = isEditing ? editingData.item : '';
    const unit = isEditing ? editingData.unit : enums.UNITS.KG;
    const outlet = isEditing ? editingData.outlet : outlets[0]._id;
    this.state = {
      quantity,
      item,
      outlet,
      unit,
      itemList: []
    };
  }

  async componentDidMount() {
    const { item } = this.state;
    try {
      const itemListObject = await request.getAlltheStockItems();
      const itemList = await itemListObject.json();
      const newItem = item ? item : itemList[0]._id;
      this.updateData(itemList, newItem);
    } catch (error) {
      alert('Failed to fetch outlet object...');
    }
  }

  updateData = (itemList, item) => this.setState({ itemList, item });

  createStockTransferEntry = async () => {
    const { updateModalVisibility, outletId, date, refetchList, editing } = this.props;
    const { item, unit, quantity, itemList, outlet } = this.state;
    const selectedItemObject = itemList.find(i => i._id === item);
    const { _id, name } = selectedItemObject;
    const isEditing = editing;
    try {
      const stockTransferEntry = {
        itemId: _id,
        itemName: name,
        fromOutletId: outletId,
        toOutletId: outlet,
        quantity: parseFloat(quantity, 10),
        unit,
        entryDate: moment(date).format('DD/MM/YYYY')
      };
      if (isEditing) {
        const { editingData } = this.props;
        await request.updateStockTransferEntry(editingData._id, {  ...stockTransferEntry,
          _id: editingData._id
        });
      } else {
        console.log(stockTransferEntry);
        await request.createStockTransferEntry(stockTransferEntry);
      }
      refetchList();
      updateModalVisibility(false)();
    } catch (error) {
      alert('Error while creating purchase entry...');
    }
  }

  onValueChange = key => value => this.setState({ [key]: value });

  onChangedNumberInput = key => (text) => {
    const decimalRegex = /^[0-9]+\.[0-9]+$/;
    if (text.match(decimalRegex)) {
      this.setState({ [key]: text });
    } else {
      this.setState({ [key]: text.replace(/[^0-9]/g, '') });
    }
  };

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

  renderStockMaterials = (itemList, item) => (
    <Picker
      selectedValue={item}
      onValueChange={this.onValueChange('item')}
      style={styles.pickerStyle}
    >
      {this.renderItems(itemList)}
    </Picker>
  )

  renderUnit = unit => (
    <Picker
      selectedValue={unit}
      onValueChange={this.onValueChange('unit')}
      style={styles.pickerStyle}
    >
      {this.renderUnits()}
    </Picker>
  )

  renderOutlet = outlets => outlets.map(o => (
    <Picker.Item
      key={o._id}
      label={o.name}
      value={o._id}
    />
  ))

  renderOutlets = (outlets, outlet) => (
    <Picker
      selectedValue={outlet}
      onValueChange={this.onValueChange('outlet')}
      style={styles.pickerStyle}
    >
      {this.renderOutlet(outlets)}
    </Picker>
  )

  renderQuantity = quantity => (
    <FloatingLabel
      style={styles.input}
      value={quantity.toString()}
      onChangeText={this.onChangedNumberInput('quantity')}
    >
      Quantity
    </FloatingLabel>
  )

  renderSubmitButton = () => <SubmitButton  onPress={this.createStockTransferEntry} />

  render() {
    const { updateModalVisibility, outlets, outletId, isEditing } = this.props;
    const { quantity, item, unit, itemList, outlet } = this.state;
    const filteredOutlets = outlets.filter(o => o._id !== outletId);
    const text = isEditing ? 'Update Stock Transfer Entry' : 'Add Stock Transfer Entry';
    return (
      <Modal
        isVisible={true}
        onBackButtonPress={updateModalVisibility(false)}
        style={styles.modalWrapper}
      >
        <View style={{ flex: 2 }}>
          <PopupHeader text={text} updateModalVisibility={updateModalVisibility} />
        </View>
        <View style={{ flex: 9, alignItems: 'center' }}>
          {this.renderStockMaterials(itemList, item)}
          {this.renderUnit(unit)}
          {this.renderOutlets(filteredOutlets, outlet)}
          {this.renderQuantity(quantity)}
          {this.renderSubmitButton()}
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  ...commonStyles
});
