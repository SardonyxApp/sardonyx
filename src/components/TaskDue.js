import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';

import { styles, fonts } from '../styles';

export default class TaskDue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: props.due === null ? null : new Date(props.due)
    }

    this._handleDateChange = this._handleDateChange.bind(this);
  }

  _handleDateChange(date) {
    this.setState({ date });
    this.props.onUpdateTask({ id: this.props.id, due: date })
  }

  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 8
        }}
      >
        <Icon 
          name="schedule"
          type="material"
          iconStyles={styles.icon}
        />
        <DatePicker 
          date={this.state.date}
          mode="datetime"
          placeholder="No due date set"
          format="MMMM D, YYYY h:mm A"
          confirmBtnText="Select"
          cancelBtnText="Cancel"
          showIcon={false}
          allowFontScaling={false}
          style={{
            paddingHorizontal: 8,
            flex: 1,
            // borderWidth: 0 // somehow the border keeps showing...
          }}
          customStyles={{
            dateText: {
              ...fonts.jost300,
              fontSize: 16
            }
          }}
          onDateChange={this._handleDateChange}
        />
        <Icon 
          name="clear"
          type="material"
          iconStyles={styles.icon}
          onPress={() => this._handleDateChange(null)}
        />
      </View>
    );
  }
};