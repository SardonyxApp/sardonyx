import { combineReducers } from 'redux';

// The reducers are functions that take a initial state and action, and sets the state.

const SETTINGS_INITIAL_STATE = {
  general: {
    showOverviewAnimation: true
  }
};

const settingsReducer = (state = SETTINGS_INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SETTINGS_SET':
      const newState = {
        ...state
      };
      console.log(action.settings)
      setPath(newState, action.settings[0], action.settings[1]);
      return newState;
    default:
      return state;
  }
};

const setPath = (object, path, value) => path
   .split('.')
   .reduce((o,p,i) => o[p] = path.split('.').length === ++i ? value : o[p] || {}, object)

const MANAGEBAC_INITIAL_STATE = {
  overview: {}
};

const managebacReducer = (state = MANAGEBAC_INITIAL_STATE, action) => {
  switch (action.type) {
    case 'MANAGEBAC_SET_OVERVIEW':
      return {
        ...state,
        overview: action.overview
      };
    default:
      return state;
  }
};

const TASKS_INITIAL_STATE = { 
  user: { 
    teacher: false,
    name: '', 
    email: '',
    tasklist_id: '',
    subjects: [],
    categories: []
  },
  tasklist: { 
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

const tasksReducer = (state = TASKS_INITIAL_STATE, action) => {
  switch(action.type) {
    case 'FILTER_LABEL': 
      return { 
        ...state, 
        [action.filter]: state[action.filter].includes(action.id) ? state[action.filter].filter(l =>l !== id) : state[action.filter].concat(action.id) 
      };
    case 'CREATE_TASK': 
      return {
        ...state,
        tasks: [
          ...state.tasks,
          {
            id: action.id, 
            student_name: action.student_name,
            teacher_name: action.teacher_name,
            subject_name: action.subject_name,
            subject_color: action.subject_color,
            category_name: action.category_name,
            category_color: action.category_color
          }
        ]
      };
    case 'EDIT_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t => t.id === action.task.id ? { ...t, ...action.task } : t )
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(t => t.id !== action.id)
      };
    case 'CREATE_LABEL':
      return {
        ...state,
        [action.labelType]: state[action.labelType].concat(action.label)
      };
    case 'EDIT_LABEL':
      return {
        ...state,
        [action.labelType]: state[action.labelType].map(l => l.id === action.label.id ? { ...l, ...action.label} : l )
      };
    case 'DELETE_LABEL':
      return {
        ...state,
        [action.labelType]: state[action.labelType].filter(l => l.id !== action.id)
      };
    case 'SET_ALL':
    default:
      return state;
  }
};

export default combineReducers({
  settings: settingsReducer,
  managebac: managebacReducer,
  tasks: tasksReducer
});
