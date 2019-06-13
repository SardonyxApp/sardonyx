import React from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
import { colors } from '../styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setUserLabels, setLabels } from '../actions';

import io from 'socket.io-client';
import { Storage } from '../helpers';
import { BASE_URL } from '../../env';

import HeaderIcon from '../components/HeaderIcon';
import TasksFilter from '../components/TasksFilter';
import TasksContainer from '../components/TasksContainer';

const socket = io.connect(BASE_URL);

class TasksScreen extends React.Component {
  constructor(props) {
    super(props);

// Set initial state with empty values to not cause any rendering errors 
    this.state = { 
      // Data state 
      user: { 
        teacher: false,
        name: '', 
        email: '',
        tasklist_id: ''
      },
      tasklist: { // Store information about current tasklist 
        id: null,
        name: '',
        description: ''
      },
      tasks: [],
      subjects: [],
      categories: [],
      subjectsFilter: [],
      categoriesFilter: [],
    };

    this._handleFilter = this._handleFilter.bind(this);
    this._handleCreateTask = this._handleCreateTask.bind(this);
    this._handleUpdateTask = this._handleUpdateTask.bind(this);
    this._handleDeleteTask = this._handleDeleteTask.bind(this);
    this._handleCreateLabel = this._handleCreateLabel.bind(this);
    this._handleUpdateLabel = this._handleUpdateLabel.bind(this);
    this._handleDeleteLabel = this._handleDeleteLabel.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Tasks',
      headerRight: (
        <HeaderIcon onPress={() => navigation.navigate('TasksCreate', navigation.state.params)}>
          <Icon 
            name="playlist-add" 
            type="material" 
            color="white" 
          />
        </HeaderIcon>
      )
    };
  }

  // Safely fetch data after initial render 
  async componentDidMount() {
    const token = await Storage.retrieveValue('sardonyxToken');
    const sardonyxToken = { 'Sardonyx-Token': token };

    // Fetch common data 
    Promise.all([
      // TODO: clean up the promise chains 
      fetch(`${BASE_URL}/app/user`, { headers: sardonyxToken }).then(r => r.json()).catch(e => console.error(e)),
      fetch(`${BASE_URL}/app/tasklist`, { headers: sardonyxToken }).then(r => r.json()).catch(e => console.error(e)),
      fetch(`${BASE_URL}/app/tasks?full=true`, { headers: sardonyxToken }).then(r => r.json()).catch(e => console.error(e)),
      fetch(`${BASE_URL}/app/subjects`, { headers: sardonyxToken }).then(r => r.json()).catch(e => console.error(e)),
      fetch(`${BASE_URL}/app/categories`, { headers: sardonyxToken }).then(r => r.json()).catch(e => console.error(e))
    ]).then(responses => {
      this.setState({
        user: responses[0],
        tasklist: responses[1],
        tasks: responses[2],
        subjects: responses[3],
        categories: responses[4],
        subjectsFilter: responses[0].subjects,
        categoriesFilter: responses[0].categories,
      });

      this.props.setUserLabels(responses[0].subjects, responses[0].categories);
      this.props.setLabels(responses[3], responses[4]);

      this.props.navigation.setParams({ 
        onCreateTask: this._handleCreateTask, 
        onCreateLabel: this._handleCreateLabel,
        onUpdateLabel: this._handleUpdateLabel,
        onDeleteLabel: this._handleDeleteLabel,
        subjects: this.state.subjects,
        categories: this.state.categories
      })
      
      socket.emit('join room', responses[1].id);
    }).catch(err => {
      alert('There was an error while retrieving information. If this error persists, please contact SardonyxApp.');
      console.error(err); 
    });

    socket.on('tasks', () => {
      fetch(`${BASE_URL}/app/tasks?tasklist=${this.state.tasklist.id}&full=true`, { headers: sardonyxToken })
      .then(response => response.json())
      .then(response => {
        this.setState({ 
          tasks: response 
        });
      });
    });

    socket.on('labels', type => {
      fetch(`${BASE_URL}/app/${type}?tasklist=${this.state.tasklist.id}`, { headers: sardonyxToken })
      .then(response => response.json())
      .then(response => {
        this.setState(() => {
          const payload = {};
          payload[type] = response;
          return payload;
        });
      });
    });
  }

  /**
   * @description Update TaskFilter 
   * @param {String} type subjects or categories 
   * @param {Number} id 
   */ 
  _handleFilter(type, id) {
    this.setState(prevState => {
      const obj = {};
      obj[type] = prevState[type].includes(id) ? prevState[type].filter(l => l !== id) : prevState[type].concat([id]);
      return obj;
    });
  }

  /**
   * @description Create a new task 
   * @param {Object} obj task object 
   */
  async _handleCreateTask(obj) {
    const task = {
      name: obj.name || '',
      description: obj.description || null,
      due: obj.due || null,
      tasklist_id: this.state.tasklist.id,
      student_id: this.state.user.teacher ? null : this.state.user.id,
      teacher_id: this.state.user.teacher ? this.state.user.id : null,
      subject_id: obj.subject_id || null,
      category_id: obj.category_id || null
    };

    const token = await Storage.retrieveValue('sardonyxToken');
    fetch(`${BASE_URL}/app/task?tasklist=${this.state.tasklist.id}`, {
      method: 'POST',
      body: JSON.stringify(task),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Sardonyx-Token': token
      }
    })
    .then(response => response.json())
    .then(response => {
      this.setState(prevState => {
        return {
          tasks: [...prevState.tasks, Object.assign({
            id: response.insertId,
            student_name: prevState.user.teacher ? null : prevState.user.name,
            teacher_name: prevState.user.teacher ? prevState.user.name : null,
            subject_name: null, // TODO: initially set these according to task.subject_id 
            subject_color: null,
            category_name: null,
            category_color: null
          }, task)]
        };
      });

      this.props.navigation.popToTop();
      this.props.navigation.push('TaskInfo', {
        tasks: this.state.tasks, 
        subjects: this.state.subjects, 
        categories: this.state.categories, 
        currentTask: response.insertId,
        onUpdateTask: this._handleUpdateTask,
        onDeleteTask: this._handleDeleteTask
      });
    
      socket.emit('tasks', this.state.tasklist.id);
    }).catch(err => {
      alert('There was an error while creating a new task. If this error persists, please contact SardonyxApp.');
      console.error(err);
    });
  }

  /**
   * @description Update task content 
   * @param {Object} obj task object with any key value pair that is to be changed  
   */
  async _handleUpdateTask(obj) {
    // Deep copy object
    const body = JSON.parse(JSON.stringify(obj));

    // Stored in separate DB table, do not need to be updated 
    delete body.subject_name;
    delete body.subject_color;
    delete body.category_name;
    delete body.category_color;

    // Send the request 
    const token = await Storage.retrieveValue('sardonyxToken')
    fetch(`${BASE_URL}/app/task?id=${obj.id}&tasklist=${this.state.tasklist.id}`, {
      body: JSON.stringify(body),
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Sardonyx-Token': token
      }
    }).then(() => {
      // Update local state using local data, as response object does not return tables 
      this.setState(prevState => {
        return { tasks: prevState.tasks.map(t => t.id === obj.id ? {...t, ...obj} : t) };
      });

      socket.emit('tasks', this.state.tasklist.id);
    }).catch(err => {
      alert('There was an error while editing a task. If this error persists, please contact SardonyxApp.');
      console.error(err);
    });
  }

  /**
   * Delete a task 
   * @param {String|Number} id 
   */
  async _handleDeleteTask(id) {
    const token = await Storage.retrieveValue('sardonyxToken');
    fetch(`${BASE_URL}/app/task?id=${id}&tasklist=${this.state.tasklist.id}`, {
      method: 'DELETE',
      headers: {
        'Sardonyx-Token': token
      }
    }).then(() => {
      this.setState(prevState => {
        return {
          tasks: prevState.tasks.filter(t => t.id !== id)
        };
      });

      socket.emit('tasks', this.state.tasklist.id);
    }).catch(err => {
      alert('There was an error while deleting a task. If this error persists, please contact SardonyxApp.');
      console.error(err);
    });
  }

  /**
   * @description Create a label
   * @param {String} type subjects or categories
   * @param {Object} obj label object
   */ 
  async _handleCreateLabel(type, obj) {
    const token = await Storage.retrieveValue('sardonyxToken');
    fetch(`${BASE_URL}/app/${type}?tasklist=${this.state.tasklist.id}`, {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Sardonyx-Token': token
      }
    })
    .then(response => response.json())
    .then(response => {
      this.setState(prevState => {
        const payload = {};
        payload[type] = prevState[type].concat(Object.assign({
          id: response.insertId          
        }, obj));
        return payload;
      });

      this.props.setLabels(this.state.subjects, this.state.categories);

      this.props.navigation.setParams({
        subjects: this.state.subjects,
        categories: this.state.categories
      });

      this.props.navigation.popToTop();

      socket.emit('labels', type, this.state.tasklist.id);
    }).catch(err => {
      alert('There was an error while creating a label. If this error persists, please contact SardonyxApp.');
      console.error(err);
    });
  }

  /**
   * @description Update a label 
   * @param {String} type subjects or categories 
   * @param {Object} obj
   * @param {Object} obj.id required 
   * @param {String} obj.name 
   * @param {String} obj.color 
   * @param {String} obj.managebac 
   */
  async _handleUpdateLabel(type, obj) {
    const token = await Storage.retrieveValue('sardonyxToken');
    fetch(`${BASE_URL}/app/${type}?id=${obj.id}&tasklist=${this.state.tasklist.id}`, {
      method: 'PATCH',
      body: JSON.stringify(obj),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Sardonyx-Token': token
      }
    }).then(() => {
      this.setState(prevState => {
        const payload = {};
        payload[type] = prevState[type].map(l => l.id === obj.id ? {...l, ...obj} : l);
        return payload;
      });

      this.props.setLabels(this.state.subjects, this.state.categories);

      this.props.navigation.setParams({
        subjects: this.state.subjects,
        categories: this.state.categories
      });

      this.props.navigation.pop();

      socket.emit('labels', type, this.state.tasklist.id);
    }).catch(err => {
      alert('There was an error while editing a label. If this error persists, please contact SardonyxApp.');
      console.error(err);
    });
  }

  /**
   * @description Delete a label 
   * @param {String} type subjects or categories 
   * @param {Number} id 
   */
  async _handleDeleteLabel(type, id) {
    const token = await Storage.retrieveValue('sardonyxToken');
    fetch(`${BASE_URL}/app/${type}?id=${id}&tasklist=${this.state.tasklist.id}`, {
      method: 'DELETE',
      headers: {
        'Sardonyx-Token': token 
      }
    }).then(() => {
      this.setState(prevState => {
        const payload = {};
        payload[type] = prevState[type].filter(l => l.id !== id)
        return payload;
      });

      this.props.setLabels(this.state.subjects, this.state.categories);

      this.props.navigation.setParams({
        subjects: this.state.subjects,
        categories: this.state.categories
      });

      socket.emit('labels', type, this.state.tasklist.id);
    }).catch(err => {
      alert('There was an error while deleting a label. If this error persists, please contact SardonyxApp.');
      console.error(err);
    })
  }

  // For handleUpdateUserLabel, see componentDidMount of SettingsEditUserLabelsScreen

  render() {
    return (
      <ScrollView
        contentContainerStyle={{
          padding: 12
        }}
        style={{ 
          flex: 1, 
          backgroundColor: colors.lightBackground
        }}
      >
        <TasksFilter 
          subjects={this.state.subjects}
          categories={this.state.categories}
          subjectsFilter={this.state.subjectsFilter}
          categoriesFilter={this.state.categoriesFilter}
          onFilter={this._handleFilter}
          navigation={this.props.navigation}
        />
        <ActivityIndicator 
          animating={this.state.tasklist.id === null} 
          style={{ display: this.state.tasklist.id === null ? 'flex' : 'none' }} 
          color={colors.primary}
        />
        <TasksContainer
          tasks={this.state.tasks}
          subjects={this.state.subjects}
          categories={this.state.categories}
          subjectsFilter={this.state.subjectsFilter}
          categoriesFilter={this.state.categoriesFilter}
          navigation={this.props.navigation}
          onUpdateTask={this._handleUpdateTask}
          onDeleteTask={this._handleDeleteTask}
        />
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  const userLabels = state.userLabels;
  return { userLabels };
};

const mapDispatchToProps = dispatch => bindActionCreators({ setUserLabels, setLabels }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TasksScreen);