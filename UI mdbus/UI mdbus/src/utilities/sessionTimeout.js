import React from 'react';
import { LOGOUT } from './logoutUser';
import { AUTO_LOGOUT_TIME } from './constants';

/*AUTOMATIC SESSION LOGOUT FUNCTION */

let TIMEOUT_ID 

const SESSION_TIMEOUT = () => {
  window.addEventListener("mousemove", resetTimer, false);
  window.addEventListener("mousedown", resetTimer, false);
  window.addEventListener("keypress", resetTimer, false);
  window.addEventListener("mousewheel", resetTimer, false);
  startTimer()
}
 
function startTimer () {
  TIMEOUT_ID = window.setTimeout(LOGOUT, AUTO_LOGOUT_TIME);
}
 
function resetTimer () {
  window.clearTimeout(TIMEOUT_ID);
  startTimer();
}
 

export {
  SESSION_TIMEOUT,
  TIMEOUT_ID
}
