import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Picker
} from 'react-native';
import FloatingLabel from 'react-native-floating-labels';
import moment from 'moment';
import Modal from 'react-native-modal';
import enums from '../helper/enums';
import request from '../helper/request';

type Props = {
  isVisibleModal: Boolean
};
export default class AddInventoryCountingModal extends Component<Props> {
  constructor(props) {
    super(props);
    const isEditing = props.editing;
    const { editingData } = props;
    const quantity = isEditing ? editingData.quantity : 0;
    const item = isEditing ? editingData.item : '';
    const unit = isEditing ? editingData.unit : enums.UNITS.KG;
    this.state = {
      quantity,
      item,
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

  createStockItemEntry = async () => {
    const { updateModalVisibility, outletId, date, refetchList, editing } = this.props;
    const { item, unit, quantity, itemList } = this.state;
    const selectedItemObject = itemList.find(i => i._id === item);
    const { _id, name } = selectedItemObject;
    const isEditing = editing;
    try {
      const stockItemEntry = {
        outletId,
        itemId: _id,
        itemName: name,
        unit,
        quantity: parseInt(quantity, 10),
        entryDate: moment(date).format('DD/MM/YYYY')
      };
      if (isEditing) {
        const { editingData } = this.props;
        await request.updateStockItemEntry(editingData._id, { ...stockItemEntry,
          _id: editingData._id
        });
      } else {
        await request.createStockItemEntry(stockItemEntry);
      }
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

  render() {
    const { updateModalVisibility } = this.props;
    const { quantity, item, unit, itemList } = this.state;
    return (
      <Modal
        isVisible={true}
        onBackdropPress={updateModalVisibility(false)}
        onBackButtonPress={updateModalVisibility(false)}
      >
        <View style={styles.modalWrapper}>
          {this.renderStockMaterials(itemList, item)}
          {this.renderUnit(unit)}
          <FloatingLabel
            placeholder="quantity"
            defaultValue={quantity.toString()}
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
    marginTop: 50,
    marginBottom: 50,
    padding: 20,
    flex: 1,
    zIndex: 100,
    backgroundColor: '#FFF',
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    marginBottom: 20
  },
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 25,
    paddingRight: 25,
    borderRadius: 3,
    backgroundColor: '#2196F3',
    marginBottom: 40,
  },
  buttonWrapper: {
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFF'
  }
});
