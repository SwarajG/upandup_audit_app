import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Table, Row, TableWrapper, Cell } from 'react-native-table-component';
import AddEntryButton from './AddEntryButton';

type Props = {};
export default class CustomTable extends Component<Props> {
  renderAddEntryButton = () => (
    <AddEntryButton
      updateModalVisibility={this.props.updateModalVisibility}
    />
  )

  renderEmptyTableText = () => (
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
      {this.renderAddEntryButton()}
      <Text>No Entries for this date...</Text>
    </View>
  )

  renderElement = (action, cellIndex) => {
    if (action === 'Edit') {
      return (
        <TouchableOpacity onPress={() => this.props.editRow(cellIndex)}>
          <Text>Edit</Text>
        </TouchableOpacity>
      );
    } else if (action === 'Delete') {
      return (
        <TouchableOpacity onPress={() => this.props.deleteRow(cellIndex)}>
          <Text>Delete</Text>
        </TouchableOpacity>
      );
    }
    return null;
  }

  renderSingleRowData = (rowData, rowIndex) => rowData.map((cellData, cellIndex) => (
    <Cell
      key={cellIndex}
      data={cellData === 'Edit' || cellData === 'Delete' ? this.renderElement(cellData, rowIndex) : cellData}
      style={{ width: this.props.widthArr[cellIndex] }}
    />
  ))

  renderRowData = (tableData) => tableData.map((rowData, index) => (
      <TableWrapper key={index} style={styles.row}>
        {this.renderSingleRowData(rowData, index)}
      </TableWrapper>
    ))

  render() {
    const { data, keys, tableHead, widthArr } = this.props;
    const tableData = data.map(entry => keys.map(key => entry[key]).concat(['Edit', 'Delete']));
    if (data.length === 0) {
      return this.renderEmptyTableText();
    }
    return (
      <View style={[styles.container, styles.containerWrapper]}>
        {this.renderAddEntryButton()}
        <ScrollView horizontal={true}>
          <View>
            <ScrollView style={styles.dataWrapper}>
              <Table borderStyle={{ borderColor: '#C1C0B9' }}>
                <Row data={tableHead} style={styles.head} widthArr={widthArr} />
                {this.renderRowData(tableData, widthArr)}
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
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
  containerWrapper: {
    marginTop: 50,
    marginLeft: 15,
    marginRight: 15
  },
  row: { flexDirection: 'row', width: '100%' },
});
