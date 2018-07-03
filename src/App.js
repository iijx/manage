
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


import Home from './containers/Home';
import Login from './containers/login/Login';

import './utils/request';

import 'normalize.css';
import './App.css';


class Index extends React.Component {
  render() {
    return (
        <Router>
          <Switch>
            <Route path="/manage/login" component={Login}></Route>
            <Route path="/manage/" component={Home}></Route>
          </Switch>
        </Router>
    )
  }
}

export default Index;