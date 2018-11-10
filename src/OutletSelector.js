import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Picker,
  AsyncStorage
} from 'react-native';
import request from './helper/request';

type Props = {};
export default class OutletSelector extends Component<Props> {
  static navigationOptions = {
    title: 'Select Outlet',
  };

  state = {
    outlet: '',
    outletsList: []
  };

  componentDidMount() {
    request.getAllOutlets()
      .then(response => response.json())
      .then(this.updateOutletsList);
  }

  onValueChange = (itemValue) => {
    this.setState({
      outlet: itemValue
    })
  }

  onPressEnter = () => {
    const { navigate } = this.props.navigation;
    const { outlet, outletsList } = this.state;
    const selectedOutlet = outletsList.find(o => o._id === outlet);
    AsyncStorage.setItem('outlet', JSON.stringify(selectedOutlet));
    navigate('EntryOptions');
  }

  updateOutletsList = (outletsList) => this.setState({ outletsList, outlet: outletsList[0]._id })

  renderItems = outletsList => outletsList.map(outlet => (
    <Picker.Item
      key={outlet._id}
      label={outlet.name}
      value={outlet._id}
    />
  ))

  render() {
    const { outletsList, outlet } = this.state;
    if (outletsList.length === 0) {
      return null;
    }
    return (
      <View style={styles.container}>
        <Picker
          selectedValue={outlet}
          style={{ width: '60%' }}
          onValueChange={this.onValueChange}
        >
          {this.renderItems(outletsList)}
        </Picker>
        <TouchableOpacity
          onPress={this.onPressEnter}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Enter</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 25,
    paddingRight: 25,
    borderRadius: 3,
    width: '40%',
    backgroundColor: '#2196F3',
    display: 'flex',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF'
  }
});
