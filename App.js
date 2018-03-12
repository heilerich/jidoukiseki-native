import React from 'react';

import { Provider } from 'react-redux';
import reduxStore from './store/store';
import { PersistGate } from 'redux-persist/integration/react';

import RootView from './views/RootView';

export default class App extends React.Component {
  render () {
    const { store, persistor } = reduxStore();
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RootView />
        </PersistGate>
      </Provider>
    );
  }
}
