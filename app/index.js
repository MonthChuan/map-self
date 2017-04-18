import c from './common.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';

import LoginPage from './components/login.jsx';
import EditorPage from './components/editor.jsx';
 
ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/login" component={LoginPage}/>
    <Route path="/" component={EditorPage}/>
  </Router>,
  document.getElementById('content')
);