import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';

import './index.css';
import { Provider } from 'react-redux';
import App from './Components/App/App';
import StoreRef from './Store/Store'


ReactDOM.render(
  <React.StrictMode>
    <Provider store={StoreRef}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
