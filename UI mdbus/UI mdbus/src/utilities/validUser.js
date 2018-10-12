import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
/*
  is User Valid or Not
*/
const IS_VALID_USER = () => {
  if(localStorage.getItem("jwtToken") === null) {
    return(<Redirect from ="/" to="/login" />)
  }
}

/*
  is User Valid or Not
*/

const CHECK_VALID_USER = (params) => {
  const { history } = params;
  if(localStorage.getItem("jwtToken") === null) {
    history.replace({ pathname: '/login' })
  }
}

export {
  IS_VALID_USER,
  CHECK_VALID_USER
}
