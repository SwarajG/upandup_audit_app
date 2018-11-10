import React, { Component } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import PurchaseEntry from './PurchaseEntry';
import StockCounting from './StockCounting';
import StockTransfer from './StockTransfer';

const FirstRoute = () => <PurchaseEntry />;
const SecondRoute = () => <StockCounting />;
const ThirdRoute = () => <StockTransfer />;

type Props = {};
export default class EntryTabs extends Component<Props> {
  state = {
    index: 0,
    routes: [
      { key: 'first', title: 'Purchase' },
      { key: 'second', title: 'Stock Counting' },
      { key: 'third', title: 'Stock Transfer' }
    ],
  };

  render() {
    return (
      <TabView
        navigationState={this.state}
        renderScene={SceneMap({
          first: FirstRoute,
          second: SecondRoute,
          third: ThirdRoute
        })}
        onIndexChange={index => this.setState({ index })}
        initialLayout={{ width: Dimensions.get('window').width }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
