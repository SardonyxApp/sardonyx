import { combineReducers } from 'redux';

// The reducers are functions that take a initial state and action, and sets the state.

const SETTINGS_INITIAL_STATE = {
  general: {
    showOverviewAnimation: true,
    firstScreenManagebac: false
  }
};

const settingsReducer = (state = SETTINGS_INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SETTINGS_SET':
      const newState = {
        ...state
      };
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
    default: 
      return state;
  }
};

export default combineReducers({
  settings: settingsReducer,
  managebac: managebacReducer,
  userLabels: userLabelsReducer,
  labels: labelsReducer
});