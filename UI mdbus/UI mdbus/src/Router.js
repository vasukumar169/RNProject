import React, { Component } from 'react';

import { Redirect, Switch, Route, Link } from 'react-router-dom';
/*It is the routing library in react which uses various components to route*/

/******************Various Custom Components**********************/
/**Pages made in form of components***/
import Login from './pages/login';
import ConnectCU50 from './pages/connectCU50';
import NodeStatus from './pages/nodeStatus';
import Survey from './pages/survey';
import StoreStatus from './pages/storeStatus';
import Cmd from './pages/cmd';
/*****/

/**Common Reusable Components***/
import Header from './components/header';
import Footer from './components/footer';
/*****/
import { IS_VALID_USER } from './utilities/validUser';

/**************************************************************/
export default class Router extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex : 1,
      isOpen : false
    }
  }

  /***************Active index for header*******************/
  onLinkClick = (activeIndex) => {
    this.setState({activeIndex})
  }
  
  componentDidMount () {}
  
  
  onClickNavbar = (isOpened) => {
    this.setState({isOpen : isOpened})
  }
  
    render() {
      const { path } = this.props.match;
      const { location } = this.props;
      let { isOpen, activeIndex } = this.state;
      return (
        <div>
          <div className="links">
            <Header activeIndex = {activeIndex} 
              // isOpen ={isOpen}
              location={location} 
              // onClickNavbar = {this.onClickNavbar}
              onClick = {this.onLinkClick} match = {this.props.match}  />
          </div>
          <div className="tabs">
            <Switch>
              <Route path={`${path}/storeSelect`} exact
                render = {
                  ()=>(
                    localStorage.getItem("jwtToken") === null
                    ?
                    <Redirect to="/login" />
                    :
                    <ConnectCU50 onClick = {this.onLinkClick} path ={path}
                      history = {this.props.history} location ={location}/>
                  )
                }
              />
              <Route path={`${path}/storeStatus`} exact
                render = {
                  ()=>(
                    localStorage.getItem("jwtToken") === null
                    ?
                    <Redirect to="/login" />
                    :
                    <StoreStatus onClick = {this.onLinkClick} path ={path}
                      history = {this.props.history} location ={location}/>
                  )
                }
              />
              <Route path={`${path}/nodeStatus`} exact
                render = {
                  ()=>(
                    localStorage.getItem("jwtToken") === null
                    ?
                    <Redirect to="/login" />
                    :
                    <NodeStatus  path ={path} onClick = {this.onLinkClick}
                      history = {this.props.history} location ={location}/>
                  )
                }
              />
              <Route path={`${path}/survey`} exact
                render = {
                  ()=>(
                    localStorage.getItem("jwtToken") === null
                    ?
                    <Redirect to="/login" />
                    :
                    <Survey  path ={path} onClick = {this.onLinkClick}
                      history = {this.props.history} location ={location}/>
                  )
                }
              />
              <Route path={`${path}/cmd`} exact
                render = {
                  ()=>(
                    localStorage.getItem("jwtToken") === null
                    ?
                    <Redirect to="/login" />
                    :
                    <Cmd  path ={path} onClick = {this.onLinkClick}
                      history = {this.props.history} location ={location}/>
                  )
                }
              />
            </Switch>
          </div>
          <Footer />
        </div>
      );
    }
}
