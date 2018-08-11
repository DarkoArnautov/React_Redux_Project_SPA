/*
  Import Dependencies
*/
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router'
import 'babel-polyfill';

import App from './components/App';
import Single from './components/Single';
import PhotoGrid from './components/PhotoGrid';
import Login from './components/Login';
import Register from './components/Register';

import css from  './styles/style.styl';

import store, { history } from './store';


render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={PhotoGrid} />
        <Route path="/login" component={Login}></Route>
        <Route path="/register" component={Register}></Route>
        <Route path="/view/:postId" component={Single}></Route>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);

