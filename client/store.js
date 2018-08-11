import { createStore, applyMiddleware, compose } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers/index';
import comments from './data/comments';
import posts from './data/posts';


const defaultState = {
  posts,
  comments
};

const enhancers = compose(
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

const loggerMiddleware = createLogger();

const store = createStore(
  rootReducer, 
  defaultState, 
  enhancers,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
);


export const history = syncHistoryWithStore(browserHistory, store);


if(module.hot) {
  module.hot.accept('./reducers/', () => {
    const nextRootReducer = require('./reducers/index').default;
    store.replaceReducer(nextRootReducer);
  });
}

export default store;
