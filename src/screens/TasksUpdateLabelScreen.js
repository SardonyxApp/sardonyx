import React from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import { fonts, styles, colors } from '../styles';

import ColorPicker from '../components/ColorPicker';

export default class TasksUpdateLabelScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state={
      focused: null,
      name: '',
      color: '',
      managebac: '',
      nameError: false,
      managebacError: false,
      type: ''
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
        type: this.props.navigation.getParam('type'),
        color: "#000000".replace(/0/g, () => Math.floor(Math.random() * 16).toString(16)) // Generate random color
      })
    }
  }

  _handlePress() {
    const payload = {
      name: this.state.name,
      color: this.state.color.toLowerCase()
    };
    let errors = {
      nameError: false,
      managebacError: false
    };

    if (!payload.name) errors.nameError = true;
    if (this.state.type === 'subjects') payload.managebac = this.state.managebac;
    if (payload.managebac && payload.managebac.substr(-1) === '/') payload.managebac = payload.managebac.slice(0, -1);
    if (payload.managebac && !payload.managebac.match(/^https:\/\/kokusaiib\.managebac\.com\/student/)) errors.managebacError = true;

    this.setState({
      ...errors
    });
    if (Object.values(errors).includes(true)) return;

    if (this.props.navigation.getParam('label')) payload.id = this.props.navigation.getParam('label').id;

    this.props.navigation.state.params.onUpdate(this.state.type, payload);
  }

  render() {
    return (
      <ScrollView contentContainerStyle={updateStyles.primaryContainer}>
        <ScrollView contentContainerStyle={updateStyles.secondaryContainer}>
          <View>
            <Text style={updateStyles.heading}>Name</Text>
            <TextInput 
              style={[updateStyles.input, { borderBottomColor: this.state.focused === 'name' ? colors.blue : this.state.nameError ? colors.error : colors.gray1 }]}
              maxLength={255}
              multiline={false}
              autoFocus={true}
              value={this.state.name}
              onChangeText={text => this.setState({ name: text })}
              onFocus={() => this.setState({ focused: 'name' })}
              onBlur={() => this.setState({ focused: null })}
            />
          </View>
          <View style={updateStyles.inline}>
            <Text style={updateStyles.heading}>Color</Text>
            <View style={[updateStyles.dot, { backgroundColor: this.state.color }]}></View>
          </View>
          <Text style={updateStyles.description}>Choose a color or type your own</Text>
          <ColorPicker onChangeColor={color => this.setState({ color })} color={this.state.color} />
          {
            this.state.type === 'subjects' ? (
              <View>
                <Text style={updateStyles.heading}>Managebac URL (optional)</Text>
                <Text style={updateStyles.description}>This field is for syncing the tasklist with Managebac.</Text>
                <TextInput 
                  style={[updateStyles.input, { borderBottomColor: this.state.focused === 'managebac' ? colors.blue : this.state.managebacError ? colors.error : colors.gray1 }]}
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
            title={this.props.navigation.getParam('label') ? 'Update task' : 'Create task'}
            type="solid"
            buttonStyle={{ backgroundColor: colors.primary }}
            containerStyle={styles.padding10}
            titleStyle={fonts.jost300}
            onPress={this._handlePress}
          />
          <KeyboardSpacer />
        </ScrollView>
      </ScrollView>
    );
  }
}

const updateStyles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
    backgroundColor: colors.lightBackground
  },
  secondaryContainer: {
    padding: 8
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
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dot: {
    borderRadius: 10,
    width: 20,
    height: 20,
    margin: 4
  }
})