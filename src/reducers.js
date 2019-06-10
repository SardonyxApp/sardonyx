import { combineReducers } from 'redux';

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

const MANAGEBAC_DATA_INITIAL_STATE = {
  overview: {}
};

const managebacDataReducer = (state = MANAGEBAC_DATA_INITIAL_STATE, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default combineReducers({
  settings: settingsReducer,
  managebacData: managebacDataReducer
});
