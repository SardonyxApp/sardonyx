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

export default combineReducers({
  settings: settingsReducer,
  managebac: managebacReducer
});
