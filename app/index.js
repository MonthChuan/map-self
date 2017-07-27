import './common.css';
import 'antd/dist/antd.css';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, hashHistory } from 'react-router';

import editorReducers from './reducers';
import LoginPage from './ui/login/login.jsx';
import EditorPage from './ui/editor/editor.jsx';
import PlazaList from './ui/plazalist/PlazaList';

// create root component
const Root = ({ store }) => (
<Provider store={store}>
    <Router history={hashHistory}>
    <Route path="/login" component={LoginPage}/>
    <Route path="/plazalist" component={PlazaList}/>
    <Route path="/:plazaId(/:key)" component={EditorPage}/>
    </Router>
 </Provider>
);
Root.propTypes = { store: PropTypes.object.isRequired };
let store = createStore(editorReducers);

store.subscribe(() => { 
    //监听state变化
    // console.log(store.getState().store)
});


// render
ReactDOM.render(
  <Root store={store} />,
  document.getElementById('content')
);