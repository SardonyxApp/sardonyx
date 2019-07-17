// Actions are your functions that take any input and make them into a JSON for the reducer to parse
export const setManagebacOverview = managebacResponse => ({
  type: 'MANAGEBAC_SET_OVERVIEW',
  overview: {...managebacResponse}
});

export const setSettings = (key, value) => ({
  type: 'SETTINGS_SET',
  settings: [key, value]
});

export const setUserLabels = (subjects, categories) => ({
  type: 'SET_USER_LABELS',
  subjects,
  categories
});

export const addUserLabels = (labelType, id) => ({
  type: 'ADD_USER_LABELS',
  labelType,
  id
});

export const deleteUserLabels = (labelType, id) => ({
  type: 'DELETE_USER_LABELS',
  labelType,
  id
});

export const setLabels = (subjects, categories) => ({
  type: 'SET_LABELS',
  subjects,
  categories
});

export const addLabel = (labelType, obj) => ({
  type: 'ADD_LABEL',
  labelType,
  obj
});

export const updateLabel = (labelType, id, obj) => ({
  type: 'UPDATE_LABEL',
  labelType,
  id,
  obj
});

export const deleteLabel = (labelType, id) => ({
  type: 'DELETE_LABEL',
  labelType,
  id
});