import React from 'react';
import { ScrollView, Text } from 'react-native';
import { Button } from 'react-native-elements';

import { fonts, styles, colors } from '../styles';

export default class TasksCreateScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Manage tasklist'
    };
  };

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
          title="Add task"
          type="solid"
          buttonStyle={{ backgroundColor: colors.primary }}
          containerStyle={styles.padding10}
          titleStyle={fonts.jost300}
          onPress={() => navigation.navigate('AddTask', { onCreateTask: navigation.state.params.onCreateTask })}
        />
        <Button 
          title="Add subject label"
          type="solid"
          buttonStyle={{ backgroundColor: colors.primary }}
          containerStyle={styles.padding10}
          titleStyle={fonts.jost300}
        />
        <Button 
          title="Add category label"
          type="solid"
          buttonStyle={{ backgroundColor: colors.primary }}
          containerStyle={styles.padding10}
          titleStyle={fonts.jost300}
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
          onPress={() => navigation.navigate('ManageLabels', { onUpdateLabel: navigation.state.params.onUpdateLabel, onDeleteLabel: navigation.state.params.onDeleteLabel, labels: navigation.state.params.subjects, type: 'subjects' })}
        />
        <Button 
          title="Manage category labels"
          type="solid"
          buttonStyle={{ backgroundColor: colors.blue }}
          containerStyle={styles.padding10}
          titleStyle={fonts.jost300}
          onPress={() => navigation.navigate('ManageLabels', { onUpdateLabel: navigation.state.params.onUpdateLabel, onDeleteLabel: navigation.state.params.onDeleteLabel, labels: navigation.state.params.categories, type: 'categories' })}
        />
      </ScrollView>
    );
  }
};

const createStyles = {
  container: {
    padding: 8
  },
  heading: {
    ...fonts.jost400,
    fontSize: 18,
    marginTop: 4
  }
}