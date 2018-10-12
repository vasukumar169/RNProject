import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

/*GENERIC LOGOUT FUNCTION*/

const LOGOUT = () => {
  localStorage.clear()
  window.location.pathname =  '/'
  // <Redirect to="/login" />
}

export {
  LOGOUT
}
