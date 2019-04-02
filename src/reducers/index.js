import dashboardReducer from './dashboard.reducer'
import themeReducer from './theme.reducer'

function combineReducers(reducers) {
  // First get an array with all the keys of the reducers (the reducer names)
  const reducerKeys = Object.keys(reducers);
  return function combination(state = {}, action) {
    // This is the object we are going to return.
    const nextState = {};

    // Loop through all the reducer keys
    for (let i = 0; i < reducerKeys.length; i++) {
      // Get the current key name
      const key = reducerKeys[i];
      // Get the current reducer
      const reducer = reducers[key];
      // Get the the previous state
      const previousStateForKey = (state[key]===undefined)?{}:state[key];
      // Get the next state by running the reducer
      const nextStateForKey = reducer(previousStateForKey, action);
      // Update the new state for the current reducer
      nextState[key] = nextStateForKey;
    }
    return nextState;
  };
}

const mainReducer = {
  theme:themeReducer,
  dashboard:dashboardReducer,
}

export default combineReducers(mainReducer)