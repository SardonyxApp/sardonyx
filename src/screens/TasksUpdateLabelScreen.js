import React from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { fonts, styles, colors } from '../styles';

export default class TasksUpdateLabelScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state={
      focused: null,
      name: '',
      color: '',
      managebac: ''
    }

    this._handlePress = this._handlePress.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('label') ? 'Update ' + navigation.getParam('label').name : 'Create new label'
    };
  };

  componentDidMount() {
    const label = this.props.navigation.getParam('label');
    if (label) {
      this.setState({
        name: label.name,
        color: label.color,
        managebac: label.managebac,
        type: this.props.navigation.getParam('type')
      });
    } else {
      this.setState({
        type: this.props.navgation.getParam('type'),
        color: "#000000".replace(/0/g, () => Math.floor(Math.random() * 16).toString(16)) // Generate random color
      })
    }
  }

  _handlePress() {

  }

  render() {
    return (
      <ScrollView style={updateStyles.container} >
        <View>
          <Text style={updateStyles.heading}>Name</Text>
          <TextInput 
            style={[updateStyles.input, { borderBottomColor: this.state.focused === 'name' ? colors.blue : colors.gray1 }]}
            maxLength={255}
            multiline={false}
            autoFocus={true}
            value={this.state.name}
            onChangeText={text => this.setState({ name: text })}
            onFocus={() => this.setState({ focused: 'name' })}
            onBlur={() => this.setState({ focused: null })}
            returnKeyType="next"
          />
        </View>
        {
          this.state.type === 'subjects' ? (
            <View>
              <Text style={updateStyles.heading}>Managebac URL (optional)</Text>
              <Text style={updateStyles.description}>This field is for syncing the tasklist with Managebac.</Text>
              <TextInput 
                style={[updateStyles.input, { borderBottomColor: this.state.focused === 'managebac' ? colors.blue : colors.gray1 }]}
                maxLength={255}
                multiline={false}
                value={this.state.managebac}
                onChangeText={text => this.setState({ managebac: text })}
                onFocus={() => this.setState({ focused: 'managebac' })}
                onBlur={() => this.setState({ focused: null })}
                onSubmitEditing={this._handlePress}
                returnKeyType="go"
              />
            </View>
          ) : null
        }
        <Button 
          title={this.props.navigation.getParam('label') ? 'Update task' : '"Create task'}
          type="solid"
          buttonStyle={{ backgroundColor: colors.primary }}
          containerStyle={styles.padding10}
          titleStyle={fonts.jost300}
          onPress={this._handlePress}
        />
      </ScrollView>
    );
  }
}

const updateStyles = StyleSheet.create({
  container: {
    padding: 8,
  },
  heading: {
    ...fonts.jost400,
    fontSize: 18,
    marginVertical: 8
  },
  description: {
    ...fonts.jost300,
    fontSize: 14,
    marginBottom: 4
  },
  input: {
    ...fonts.jost300,
    fontSize: 18,
    borderBottomWidth: 2,
    marginBottom: 8,
    ...styles.padding5
  }
})