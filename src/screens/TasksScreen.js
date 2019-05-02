import React from 'react';

import { ScrollView } from 'react-native';

// import io from 'socket.io-client';
import { Storage } from '../helpers';
import { BASE_URL } from '../../env';

import TasksFilter from '../components/TasksFilter';
import TasksContainer from '../components/TasksContainer';

// Disable sockets for now 
// const socket = io.connect(BASE_URL);

Array.prototype.findById = function(id) {
  const index = this.findIndex(i => i.id === id);
  return this[index] || null;
};

export default class TasksScreen extends React.Component {
  constructor(props) {
    super(props);

// Set initial state with empty values to not cause any rendering errors 
    this.state = { 
      // Data state 
      user: { 
        teacher: false,
        name: '', 
        email: '',
        tasklist_id: '',
        subjects: [],
        categories: []
      },
      tasklist: { // Store information about current tasklist 
        id: null,
        name: '',
        description: ''
      },
      tasklists: [], // Store information about other tasklists (teachers only)
      tasks: [],
      currentTask: -1, // Store the id of current task: -1 -> no task selected 
      subjects: [],
      categories: [],
      subjectsFilter: [],
      categoriesFilter: []
    };

    this._handleSelectTasklist = this._handleSelectTasklist.bind(this);
    this._handleSelectTask = this._handleSelectTask.bind(this);
    this._handleFilter = this._handleFilter.bind(this);
    this._handleCreateTask = this._handleCreateTask.bind(this);
    this._handleUpdateTask = this._handleUpdateTask.bind(this);
    this._handleDeleteTask = this._handleDeleteTask.bind(this);
    this._handleCreateLabel = this._handleCreateLabel.bind(this);
    this._handleUpdateLabel = this._handleUpdateLabel.bind(this);
    this._handleDeleteLabel = this._handleDeleteLabel.bind(this);
    this._handleUpdateUserLabel = this._handleUpdateUserLabel.bind(this);
    this._handleChangeUserTasklist = this._handleChangeUserTasklist.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Tasks'
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
      
      // socket.emit('join room', responses[1].id);
    }).catch(err => {
      alert('There was an error while retrieving information. If this error persists, please contact SardonyxApp.');
      console.error(err); 
    });

    // Teachers only feature 

    // fetch(`${BASE_URL}/app/tasklist?tasklist=all`)
    // .then(response => response.json())
    // .then(response => {
    //   this.setState({
    //     tasklists: response
    //   });
    // }).catch(err => {
    //   console.error('There was an error while retrieving all available tasklists. If you are a student, do not worry about this error. ' + err);
    // });

    // Disable sockets for now 

    // socket.on('tasks', () => {
    //   fetch(`${BASE_URL}/app/tasks?tasklist=${this.state.tasklist.id}&full=true`)
    //   .then(response => response.json())
    //   .then(response => {
    //     this.setState({ 
    //       tasks: response 
    //     });
    //   });
    // });

    // socket.on('labels', type => {
    //   fetch(`${BASE_URL}/app/${type}?tasklist=${this.state.tasklist.id}`)
    //   .then(response => response.json())
    //   .then(response => {
    //     this.setState(() => {
    //       const payload = {};
    //       payload[type] = response;
    //       return payload;
    //     });
    //   });
    // });
  }

  // Fetch data to change tasklist 
  async _handleSelectTasklist(tasklist) {
    const token = await Storage.retrieveValue('sardonyxToken');
    const sardonyxToken = { 'Sardonyx-Token': token };

    Promise.all([
      // Fetch user because the default filters change 
      fetch(`${BASE_URL}/app/user?tasklist=${tasklist.id}`, { headers: sardonyxToken }).then(r => r.json()).catch(e => console.error(e)),
      fetch(`${BASE_URL}/app/tasks?full=true&tasklist=${tasklist.id}`, { headers: sardonyxToken }).then(r => r.json()).catch(e => console.error(e)),
      fetch(`${BASE_URL}/app/subjects?tasklist=${tasklist.id}`, { headers: sardonyxToken }).then(r => r.json()).catch(e => console.error(e)),
      fetch(`${BASE_URL}/app/categories?tasklist=${tasklist.id}`, { headers: sardonyxToken }).then(r => r.json()).catch(e => console.error(e))
    ]).then(responses => {
      // socket.emit('leave room', this.state.tasklist.id);

      this.setState({
        user: responses[0],
        tasklist: tasklist,
        tasks: responses[1],
        subjects: responses[2],
        categories: responses[3],
        currentTask: -1,
        subjectsFilter: responses[0].subjects,
        categoriesFilter: responses[0].categories
      });
      
      // socket.emit('join room', tasklist.id);
    }).catch(err => {
      alert('There was an error while retrieving information. If this error persists, please contact SardonyxApp.');
      console.error(err);
    });
  }

  // Update current task 
  _handleSelectTask(i) {
    this.setState(prevState => ({
      currentTask: prevState.currentTask === i ? -1 : i
    }));
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
          currentTask: response.insertId,
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
    
      // socket.emit('tasks', this.state.tasklist.id);
    }).catch(err => {
      alert('There was an error while creating a new task. If this error persists, please contact SardonyxApp.');
      console.error(err);
    });
  }

  /**
   * @description Update task content 
   * @param {Object} obj task object with any key value pair that is to be changed  
   * @param {Number} id required in order to change state correctly 
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

      // socket.emit('tasks', this.state.tasklist.id);
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
          tasks: prevState.tasks.filter(t => t.id !== id),
          currentTask: -1
        };
      });

      // socket.emit('tasks', this.state.tasklist.id);
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

      // socket.emit('labels', type, this.state.tasklist.id);
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

      // socket.emit('labels', type, this.state.tasklist.id);
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

      // socket.emit('labels', type, this.state.tasklist.id);
    }).catch(err => {
      alert('There was an error while deleting a label. If this error persists, please contact SardonyxApp.');
      console.error(err);
    })
  }

  /**
   * @description Add or delete a user's default label
   * @param {String} type 
   * @param {Number} id 
   */
  async _handleUpdateUserLabel(type, id) {
    const method = this.state.user[type].includes(id) ? 'DELETE' : 'POST';
    const token = await Storage.retrieveValue('sardonyxToken');
    fetch(`${BASE_URL}/app/user/${type}?id=${id}`, {
      method,
      headers: {
        'Sardonyx-Token': token 
      }
    }).then(() => {
      this.setState(prevState => {
        const user = prevState.user;
        user[type] = method === 'POST' ? user[type].concat([id]) : user[type].filter(l => l !== id);
        return { user };
      });
    }).catch(err => {
      alert('There was an error while updating default labels. If this error persists, please contact SardonyxApp.');
      console.error(err);
    }) 
  }

  /**
   * @description Update a teacher's default tasklist 
   * @param {Number} tasklistId 
   */
  async _handleChangeUserTasklist(tasklistId) {
    const token = await Storage.retrieveValue('sardonyxToken');
    fetch(`${BASE_URL}/app/user/tasklist?id=${tasklistId}`, { 
      method: 'PATCH',
      headers: {
        'Sardonyx-Token': token
      }
    }).then(response => {
      Storage.writeValue('sardonyxToken', response.headers.map['sardonyx-token']);
      this.setState(prevState => {
        return { user: {  ...prevState.user, tasklist_id: tasklistId } };
      });
    }).catch(err => {
      alert('There was an error while updating your default tasklist. If this error persists, please contact SardonyxApp.');
      console.error(err);
    });
  }

  render() {
    return (
      <ScrollView
        style={{
          backgroundColor: '#f4f4fa',
          paddingHorizontal: 12
        }}
      >
        <TasksFilter 
          subjects={this.state.subjects}
          categories={this.state.categories}
          subjectsFilter={this.state.subjectsFilter}
          categoriesFilter={this.state.categoriesFilter}
          onFilter={this.state._handleFilter}
        />
        <TasksContainer
          tasks={this.state.tasks}
          subjectsFilter={this.state.subjectsFilter}
          categoriesFilter={this.state.categoriesFilter}
          currentTask={this.state.currentTask}
          onSelectTask={this._handleSelectTask}
        />
      </ScrollView>
    );
  }
}