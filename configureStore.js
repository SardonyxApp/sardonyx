import { createStore } from 'redux';
import reducers from './src/reducers';

import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

export default function configureStore() {
  const persistConfig = {
    key: 'root',
    storage
  };

  const persistedReducers = persistReducer(persistConfig, reducers);

  // Initialise the entire Redux Store with all reducers combined.
  const store = createStore(persistedReducers);

  let persistor = persistStore(store);

  return { store, persistor };
}
