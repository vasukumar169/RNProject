import superagent from 'superagent'
import {WEB_API_URL} from "./../utilities/constants"
import {LOGIN_API_ENDPOINT} from "./../utilities/constants"
import {ACTIVE_DEVICES_API_ENDPOINT} from "./../utilities/constants"
import {DEVICE_SETTINGS_API_ENDPOINT} from "./../utilities/constants"
import {SURVEY_API_ENDPOINT} from "./../utilities/constants"
import {GET_SURVEY_API_ENDPOINT} from "./../utilities/constants"
import {UPDATE_CONFIG_SETTINGS_API_ENDPOINT} from "./../utilities/constants"
import {CONNECT_CU50_API_ENDPOINT} from "./../utilities/constants"
import {MODCMND_API_ENDPOINT} from "./../utilities/constants"
import {MODCMND_GET_API_ENDPOINT} from "./../utilities/constants"

const timeOut = {
  response: 6000,  // Wait 6 seconds for the server to start sending,
  deadline: 30000, // but allow 0.5 minute for the file to finish loading.
}

const timeOutLogin = {
  response: 6000,  // Wait 6 seconds for the server to start sending,
  deadline: 30000, // but allow 0.5 minute for the file to finish loading.
}

const siteSurveyTimeOut = {
  response: 6000,  // Wait 6 seconds for the server to start sending,
  deadline: 30000, // but allow 0.5 minute for the file to finish loading.
}

function loginAPI (username, password) {
  return superagent
    .post(WEB_API_URL+LOGIN_API_ENDPOINT)
    .send({username : username, password : password})
    .type('application/json')
    .timeout(timeOutLogin)
}

function connectCU50 (cu50no) {
  return superagent
    .post(WEB_API_URL+CONNECT_CU50_API_ENDPOINT)
    .send({cu50no: cu50no })
    .type('application/json')
}

function activeDevicesAPI (cu50no) {
  return superagent
    .get(WEB_API_URL+ACTIVE_DEVICES_API_ENDPOINT)
    .query('cu50no=' + cu50no)
}

function deviceSettingAPI (cu50no, deviceid) {
  return superagent
    .get(WEB_API_URL+DEVICE_SETTINGS_API_ENDPOINT)
    .query('cu50no=' + cu50no)
    .query('deviceid=' + deviceid)
}

function updateConfigSettingsAPI (object) {
  return superagent
    .post(WEB_API_URL+UPDATE_CONFIG_SETTINGS_API_ENDPOINT)
    .send(object)
    .timeout(timeOut)
    .type('application/json')
}

function modCommandAPI (object) {
  return superagent
    .post(WEB_API_URL+MODCMND_API_ENDPOINT)
    .send(object)
    .timeout(timeOut)
    .type('application/json')
}

function getSurveyAPI (cu50no) {
  return superagent
    .get(WEB_API_URL+GET_SURVEY_API_ENDPOINT)
    .query('cu50no=' + cu50no)
}


function surveyAPI (cu50no) {
  return superagent
    .post(WEB_API_URL+SURVEY_API_ENDPOINT)
    .send({"Cu50No": cu50no })
    .type('application/json')
    .timeout(siteSurveyTimeOut)
}

function getModCmdAPI (controlcode, cu50no, deviceid) {
  return superagent
  .get(WEB_API_URL+MODCMND_GET_API_ENDPOINT)
  .query('controlcode=' + controlcode)
  .query('cu50no=' + cu50no)
  .query('deviceid=' + deviceid)
}

export {
  loginAPI, activeDevicesAPI,
  deviceSettingAPI, surveyAPI,
  updateConfigSettingsAPI, connectCU50,
  modCommandAPI, getSurveyAPI, getModCmdAPI
}
