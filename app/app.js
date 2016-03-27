import React from 'react'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import { render } from 'react-dom'

import reducer from './reducers'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import MainLayout from './components/layout/Main'
import MainPage from './components/page/Main'

import DevTools from './assets/js/DevTools'

let store = createStore(reducer, DevTools.instrument());


render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={MainLayout}>
        <IndexRoute component={MainPage} />

      </Route>
    </Router>
  </Provider>, document.getElementById('app')
);
