import React from 'react';
import { ScrollView, Text, Alert } from 'react-native';
import { fonts } from '../styles';
import Label from '../components/TasksLabel';

export default class TasksManageLabelsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      labels: []
    }

    this._handleUpdate = this._handleUpdate.bind(this);
    this._handleRemove = this._handleRemove.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Labels'
    };
  };

  componentDidMount() {
    this.setState({
      labels: this.props.navigation.getParam('labels')
    })
  }

  _handleUpdate(type, obj) {
    this.setState(prevState => {
      prevState.labels = prevState.labels.map(l => l.id === obj.id ? {...l, ...obj} : l);
      return prevState;
    });

    this.props.navigation.state.params.onUpdateLabel(type, obj);
  }

  _handleRemove(id) {
    Alert.alert(
      'Deletion Warning',
      'Once deleted, the label cannot be restored. Are you sure?',
      [
        {
          text: 'Cancel'
        },
        {
          text: 'OK',
          onPress: () => {
            this.setState(prevState => {
              prevState.labels = prevState.labels.filter(l => l.id !== id);
              return prevState;
            });
            this.props.navigation.state.params.onDeleteLabel(this.props.navigation.getParam('type'), id);
          }
        }
      ]
    );
  }

  render() {
    const labels = this.state.labels.map(label => {
      return (
        <Label 
          label={label}
          style={{
            margin: 4,
            paddingHorizontal: 12,
            paddingVertical: 12
          }}
          updatable={true} 
          onUpdate={() => this.props.navigation.navigate('UpdateLabel', { onUpdate: this.props.navigation.state.params.onUpdateTask, label, type: this.props.navigation.getParam('type') })}
          removable={true}
          onRemove={this._handleRemove}
          key={label.name}
        />
      );
    });

    if (!labels.length) labels.push(<Text key="no labels" style={{ ...fonts.jost400, fontSize: 18 }}>NO LABELS FOUND</Text>)
    
    return (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 8 }}>
        {labels}
      </ScrollView>
    );
  }
}