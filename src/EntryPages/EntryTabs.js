import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import PurchaseEntry from '../InnerPages/PurchaseEntry';
import StockCounting from '../InnerPages/StockCounting';
import StockTransfer from '../InnerPages/StockTransfer';

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
