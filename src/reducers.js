import { combineReducers } from 'redux';

// The reducers are functions that take a initial state and action, and sets the state.

const SETTINGS_INITIAL_STATE = {
  general: {
    showOverviewAnimation: true
  }
};

const settingsReducer = (state = SETTINGS_INITIAL_STATE, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

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
