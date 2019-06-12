// Actions are your functions that take any input and make them into a JSON for the reducer to parse
export const setManagebacOverview = managebacResponse => ({
  type: 'MANAGEBAC_SET_OVERVIEW',
  overview: {...managebacResponse}
});

export const setSettings = (key, value) => ({
  type: 'SETTINGS_SET',
  settings: [key, value]
});

// Responses gained from fetching different api endpoints simultaneously
export const setAll = responses => ({
  type: 'SET_ALL',
  user: responses[0],
  tasklist: responses[1],
  tasks: responses[2],
  subjects: responses[3],
  subjectsFilter: responses[0].subjects,
  categoriesFilter: responses[1].subjects
});

export const filterLabels = (filter, id) => ({
  type: 'FILTER_LABELS',
  filter,
  id
});

export const createTask = (id, student_name, teacher_name, subject_name, subject_color, category_name, category_color) => ({
  type: 'CREATE_TASK',
  id,
  student_name,
  teacher_name,
  subject_name,
  subject_color,
  category_name,
  category_color
});

export const editTask = task => ({
  type: 'EDIT_TASK',
  task
});

export const deleteTask = id => ({
  type: 'DELETE_TASK',
  id
});

export const createLabel = (type, id, obj) => ({
  type: 'CREATE_LABEL',
  labelType: type,
  label: {
    id,
    ...obj
  }
});

export const editLabel = (type, obj) => ({
  type: 'EDIT_LABEL',
  labelType: type,
  label: obj
});

export const deleteLabel = (type, id) => ({
  type: 'DELETE_LABEL',
  labelType: type,
  id
});