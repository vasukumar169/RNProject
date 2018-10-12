import React, { Component } from 'react';
/*This is default classes of React to be imported*/
import Router from './Router';
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import Login from './pages/login';
/*
This file manages the routes and default login pages
It has two components {Login} and {Router}
Router has various routes pointing to various components
*/
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/" render={()=>(<Redirect to="/login" />)} />
          <Route path="/home" component={Router} />

        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
