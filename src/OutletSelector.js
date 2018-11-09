import React, { Component } from 'react';
import { StyleSheet, View, Button, Picker } from 'react-native';
import request from './helper/request';

type Props = {};
export default class OutletSelector extends Component<Props> {
  state = {
    outlet: '',
    outlets: []
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
    const { outlet } = this.state;
    alert(outlet);
  }

  updateOutletsList = (outlets) => {
    this.setState({ outlets });
  }

  renderItems = (outlets) => outlets.map(outlet => (
    <Picker.Item
      key={outlet._id}
      label={outlet.name}
      value={outlet._id}
    />
  ))

  render() {
    const { outlets, outlet } = this.state;
    if (outlets.length === 0) {
      return null;
    }
    return (
      <View style={styles.container}>
        <Picker
          selectedValue={outlet}
          style={{ width: '60%' }}
          onValueChange={this.onValueChange}
        >
          {this.renderItems(outlets)}
        </Picker>
        <Button
          onPress={this.onPressEnter}
          title="Enter"
          color="#841584"
          style={styles.button}
          accessibilityLabel="Enter after selecting an outlet"
        />
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
    height: 40,
    width: '40%',
    backgroundColor: '#2196F3',
  }
});
