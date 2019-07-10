import React from 'react';
import { ScrollView, Text } from 'react-native';
import { Button } from 'react-native-elements';

import { fonts, styles, colors } from '../styles';

export default class TasksCreateScreen extends React.Component {
  constructor(props) {
    super(props);

    this._handleUpdate = this._handleUpdate.bind(this);
    this._handleDelete = this._handleDelete.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Manage TaskList'
    };
  };
  
  // These methods are necessary to update the navigation params accordingly
  _handleUpdate(type, obj) {
    this.props.navigation.setParams({
      [type]: this.props.navigation.getParam(type).map(l => l.id === obj.id ? {...l, ...obj} : l)
    });

    this.props.navigation.state.params.onUpdateLabel(type, obj);
  }

  _handleDelete(type, id) {
    this.props.navigation.setParams({
      [type]: this.props.navigation.getParam(type).filter(l => l.id !== id)
    });

    this.props.navigation.state.params.onDeleteLabel(type, id);
  }
  
  render() {
    const navigation = this.props.navigation;
    return (
      <ScrollView style={createStyles.container}>
        <Text
          style={createStyles.heading}
        >
          CREATE
        </Text>
        <Button 
          title="Add subject label"
          type="solid"
          buttonStyle={{ backgroundColor: colors.primary }}
          containerStyle={styles.padding10}
          titleStyle={fonts.jost300}
          onPress={() => navigation.navigate('UpdateLabel', { onUpdate: navigation.state.params.onCreateLabel, type: 'subjects' })}
        />
        <Button 
          title="Add category label"
          type="solid"
          buttonStyle={{ backgroundColor: colors.primary }}
          containerStyle={styles.padding10}
          titleStyle={fonts.jost300}
          onPress={() => navigation.navigate('UpdateLabel', { onUpdate: navigation.state.params.onCreateLabel, type: 'categories' })}
        />

        <Text
          style={createStyles.heading}
        >
          MANAGE
        </Text>
        <Button 
          title="Manage subject labels"
          type="solid"
          buttonStyle={{ backgroundColor: colors.blue }}
          containerStyle={styles.padding10}
          titleStyle={fonts.jost300}
          onPress={() => navigation.navigate('ManageLabels', { onUpdate: this._handleUpdate, onDelete: this._handleDelete, labels: navigation.state.params.subjects, type: 'subjects' })}
        />
        <Button 
          title="Manage category labels"
          type="solid"
          buttonStyle={{ backgroundColor: colors.blue }}
          containerStyle={styles.padding10}
          titleStyle={fonts.jost300}
          onPress={() => navigation.navigate('ManageLabels', { onUpdate: this._handleUpdate, onDelete: this._handleDelete, labels: navigation.state.params.categories, type: 'categories' })}
        />
      </ScrollView>
    );
  }
};

const createStyles = {
  container: {
    padding: 8,
    backgroundColor: colors.lightBackground
  },
  heading: {
    ...fonts.jost400,
    fontSize: 18,
    marginTop: 4
  }
}