import { combineReducers } from 'redux';

// The reducers are functions that take a initial state and action, and sets the state.

const USER_INITIAL_STATE = {
  name: '',
};

const userReducer = (state = USER_INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        name: action.user.name
      };
    default:
      return state;
  }
};

const LABELS_INITIAL_STATE = { 
  subjects: [],
  categories: [],
  loaded: false
};

// User default labels
const userLabelsReducer = (state = LABELS_INITIAL_STATE, action) => {
  switch(action.type) {
    case 'SET_USER_LABELS':
      return {
        subjects: action.subjects,
        categories: action.categories,
        loaded: true
      };
    case 'ADD_USER_LABELS':
      return {
        ...state,
        [action.labelType]: state[action.labelType].concat(action.id)
      };
    case 'REMOVE_USER_LABELS':
      return {
        ...state,
        [action.labelType]: state[action.labelType].filter(l => l !== action.id)
      };
    default: 
      return state;
  }
}

// Tasklist labels
const labelsReducer = (state = LABELS_INITIAL_STATE, action) => {
  switch(action.type) {
    case 'SET_LABELS': 
      return {
        subjects: action.subjects,
        categories: action.categories,
        loaded: true
      };
    case 'ADD_LABEL': 
      return {
        ...state,
        [action.labelType]: state[action.labelType].concat(action.obj)
      };
    case 'UPDATE_LABEL': 
      return {
        ...state,
        [action.labelType]: state[action.labelType].map(l => l.id === action.id ? action.obj : l)
      };
    case 'DELETE_LABEL': 
      return {
        ...state,
        [action.labelType]: state[action.labelType].filter(l => l.id !== action.id)
      };
    default: 
      return state;
  }
};

export default combineReducers({
  user: userReducer,
  userLabels: userLabelsReducer,
  labels: labelsReducer
});