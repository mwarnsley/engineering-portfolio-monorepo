import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import Mash from './Mash';
import { store } from './store';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <Mash />
    </Provider>
  </React.StrictMode>,
);
