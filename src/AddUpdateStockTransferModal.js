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
export default class AddUpdateStockTransferModal extends Component<Props> {
  constructor(props) {
    super(props);
    const isEditing = props.editing;
    const { editingData } = props;
    const quantity = isEditing ? editingData.quantity : 0;
    const item = isEditing ? editingData.item : '';
    const unit = isEditing ? editingData.unit : enums.UNITS.KG;
    const outlet = isEditing ? editingData.outlet : '';
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

  componentWillReceiveProps(nextProps) {
    const { outlet } = nextProps;
    const newOutlet = outlet ? outlet : nextProps.outlets[0]._id;
    this.setState({ outlet: newOutlet });
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
        quantity,
        unit,
        entryDate: moment(date).format('DD/MM/YYYY')
      };
      if (isEditing) {
        const responseObject = await request.updateStockTransferEntry(_id, stockTransferEntry);
        const response = await responseObject.json();
      } else {
        const responseObject = await request.createStockTransferEntry(stockTransferEntry);
        const response = await responseObject.json();
      }
      refetchList();
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

  renderStockMaterials = (itemList, item) => (
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
    >
      {this.renderOutlet(outlets)}
    </Picker>
  )

  render() {
    const { updateModalVisibility, outlets, outletId } = this.props;
    const { quantity, item, unit, itemList, outlet } = this.state;
    const filteredOutlets = outlets.filter(o => o._id !== outletId);
    return (
      <Modal
        isVisible={true}
        onBackdropPress={updateModalVisibility(false)}
        onBackButtonPress={updateModalVisibility(false)}
      >
        <View style={styles.modalWrapper}>
          {this.renderStockMaterials(itemList, item)}
          {this.renderUnit(unit)}
          {this.renderOutlets(filteredOutlets, outlet)}
          <TextInput
            maxLength={10}
            placeholder="quantity"
            value={quantity}
            onChangeText={this.onChangedNumberInput('quantity')}
            style={styles.input}
          />
          <TouchableOpacity
            onPress={this.createStockTransferEntry}
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
