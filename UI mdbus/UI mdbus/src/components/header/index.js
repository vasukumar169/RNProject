import React, { Component } from 'react';
import { LOGOUT } from './../../utilities/logoutUser';
import { Link } from 'react-router-dom';
import logo from './../../assets/images/logo.png';
/*Generic Header component with routing paths*/
const Header = (props) => {
  const { path } = props.match;
  let { activeIndex, onClick, onClickNavbar } = props;
  return (
    <header className="header-section">
      <div className="container showall">
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type = "button" 
                className = "navbar-toggle" 
                data-toggle = "collapse" 
                data-target = "#bs-example-navbar-collapse-1" 
                // onClick = {()=>{onClickNavbar(!isOpen)}}
                // aria-expanded = {isOpen}
                >
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <div className="logo">
                <a className="navbar-brand">
                  <img src={logo} width="125" height="57" alt="Logo"/></a>
              </div>
            </div>
            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <ul className="nav navbar-nav menu-list">
                <li onClick = {()=>onClick(1)}
                  className={activeIndex === 1 ? "active" : null}>
                  <Link to={`${path}/storeSelect`}>Select Store</Link>
                </li>
                <li onClick = {()=>onClick(2)}
                  className={activeIndex === 2 ? "active" : null}>
                  <Link to={`${path}/storeStatus`}>Store Status</Link>
                </li>
                <li onClick = {()=>onClick(4)}
                  className={activeIndex === 4 ? "active" : null}>
                  <Link to={`${path}/survey`}>Site Survey</Link>
                </li>
                <li onClick = {()=>onClick(3)}
                  className={activeIndex === 3 ? "active" : null}>
                  <Link to={`${path}/nodeStatus`}>Node Status</Link>
                </li>
                <li onClick = {()=>onClick(5)}
                  className={activeIndex === 5 ? "active" : null}>
                  <Link to={`${path}/cmd`}>Extended Controls</Link>
                </li>
                <li>
                  <button onClick = {()=>LOGOUT()}
                    className="btn btn-default logoutbtn">
                    <span>
                      <i className="fa fa-sign-out" data-unicode="f08b"></i>
                    </span>
                    &nbsp;Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="clear"></div>
        <div className="bdrbtm"></div>
      </div>
    </header>
  )
}

export default Header
