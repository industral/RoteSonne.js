import React from 'react'
import {Router, Route, IndexRoute, hashHistory} from 'react-router'
import {render} from 'react-dom'

import reducer from './reducers'
import {createStore} from 'redux'
import {Provider} from 'react-redux'

import MainLayout from './components/layout/Main'
import MainPage from './components/page/Main'

// import DevTools from './assets/js/DevTools'

import Player from './context/Player';

// window._store = createStore(reducer, DevTools.instrument());
window._store = createStore(reducer);

Player.getInstance();

import LibraryProcess from './components/widget/LibraryProcess'

__openLibrary.cb = function() {

  dialog.showOpenDialog({
    properties: ['openDirectory']
  }, function(path) {
    render(
      <Provider store={window._store}>
        <LibraryProcess path={path} />
      </Provider>, document.getElementById('dynamic'));
  });
};

render(
  <Provider store={window._store}>
    <Router history={hashHistory}>
      <Route path="/" component={MainLayout}>
        <IndexRoute component={MainPage} />

      </Route>
    </Router>
  </Provider>, document.getElementById('app')
);
