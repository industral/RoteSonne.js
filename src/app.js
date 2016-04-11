import './assets/css/photon.css'
import './assets/css/style.css'

import React from 'react'
import {Router, Route, IndexRoute, hashHistory} from 'react-router'
import {render} from 'react-dom'

import reducer from './reducers'
import {createStore} from 'redux'
import {Provider} from 'react-redux'

import MainLayout from './components/layout/Main'
import MainPage from './components/page/Main'

import DevTools from './assets/js/DevTools'

import Player from './context/Player';

console.log(process.env.REDUX);

if (process.env.REDUX) {
  window._store = createStore(reducer, DevTools.instrument());
} else {
  window._store = createStore(reducer);
}

Player.getInstance();

import LibraryProcess from './components/widget/LibraryProcess'

__openLibrary.cb = function() {

  dialog.showOpenDialog({
    properties: ['openDirectory']
  }, function(files) {
    if (files) {
      render(
        <Provider store={window._store}>
          <LibraryProcess files={files} />
        </Provider>, document.getElementById('dynamic'));
    }
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
