import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import configureStore from './store';
import * as sessionActions from './store/session';

import { restoreCSRF, csrfFetch } from './store/csrf';

const store = configureStore();

// edited section
// if (process.env.NODE_ENV !== 'production') {
//   window.store = store;
// }
// edited section ends


if (import.meta.env.MODE !== 'production') {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
