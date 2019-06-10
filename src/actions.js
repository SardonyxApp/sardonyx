// Actions are your functions that take any input and make them into a JSON for the reducer to parse
export const setManagebacOverview = managebacResponse => ({
  type: 'MANAGEBAC_SET_OVERVIEW',
  overview: {...managebacResponse}
});
