import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';

import Login from './components/login.jsx';
import Editor from './components/editor.jsx';
 
ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/login" component={Login}/>
    <Route path="/" component={Editor}/>
  </Router>,
  document.getElementById('content')
);