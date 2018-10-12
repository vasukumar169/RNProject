import {loginAPI} from './APIDeclarations';
import {activeDevicesAPI} from './APIDeclarations';
import {deviceSettingAPI} from './APIDeclarations';
import {surveyAPI} from './APIDeclarations';
import {getSurveyAPI} from './APIDeclarations';
import {updateConfigSettingsAPI} from './APIDeclarations';
import {connectCU50} from './APIDeclarations';
import {modCommandAPI} from './APIDeclarations';
import {getModCmdAPI} from './APIDeclarations';
import {STATUS_CODES} from "./../utilities/constants"

/*LOGIN SERVICE*/
function loginService (username, password) {
  return  loginAPI(username, password).then((response)=>{
    if((STATUS_CODES.includes(response.status) && response.body.length !== 0)) {
      return response.body
    }
  }).catch((er)=>{
    if(STATUS_CODES.includes(er.status)) {
      return er.message
    }
  })
}

/*CONNECTING CU 50 SERVICE*/
function connectCU50Service (cu50) {
  return  connectCU50(cu50).then((response)=>{
    if((STATUS_CODES.includes(response.status) && response.body.length !== 0)) {
      if (response.body.Status === "SPNF") {
        return cu50 + " Serial Port Not Found";
      } else if (response.body.Status === "SPUTC") {
        return cu50 + " Serial Port Unable to Connect";
      } else if (response.body.Status === "Invalid") {
        return cu50 + " Gateway Communication Failure";
      } else {
        return response.body.statusMessage;
      }
    }
  }).catch((er)=>{
    if(STATUS_CODES.includes(er.status)) {
      return cu50 + " " + er.message
    }
  })
}


/*ACTIVE DEVICE SERVICE*/
function activeDeviceService () {
  let cu50no = localStorage.getItem('serialNo')
  return  activeDevicesAPI(cu50no).then((response)=>{
    if((STATUS_CODES.includes(response.status) && response.body.length !== 0)) {
      return response.body
    }
  }).catch((er)=>{
    if(STATUS_CODES.includes(er.status)) {
      return er.message
    }
  })
}

/*GET DEVICE CONFIG SERVICE*/
function deviceSettingService () {
  let cu50no = localStorage.getItem('serialNo')
  let deviceid = localStorage.getItem('nodeId')
  return  deviceSettingAPI(cu50no, deviceid).then((response)=>{
    if((STATUS_CODES.includes(response.status) && response.body.length !== 0)) {
      return response.body
    }
  }).catch((er)=>{
    if(STATUS_CODES.includes(er.status)) {
      return er.message
    }
  })
}

/*MOD COMMAND SERVICE*/
function modCommandService (object) {
  return  modCommandAPI(object).then((response)=>{
    if((STATUS_CODES.includes(response.status) && response.body.length !== 0)) {
      return response.body
    }
  }).catch((er)=>{
    if(STATUS_CODES.includes(er.status)) {
      return er.message
    }
  })
}


/*POST SURVEY SERVICE*/
function surveyService () {
  let cu50no = localStorage.getItem('serialNo')
  return  surveyAPI(cu50no).then((response)=>{
    if((STATUS_CODES.includes(response.status) && response.body.length !== 0)) {
      return response.body
    }
  }).catch((er)=>{
    if(STATUS_CODES.includes(er.status)) {
      return er.message
    }
  })
}

/*GET SURVEY SERVICE*/
function getSurveyService () {
  let cu50no = localStorage.getItem('serialNo')
  return  getSurveyAPI(cu50no).then((response)=>{
    if((STATUS_CODES.includes(response.status) && response.body.length !== 0)) {
      return response.body
    }
  }).catch((er)=>{
    if(STATUS_CODES.includes(er.status)) {
      return er.message
    }
  })
}


/*UPDATE CONFIG SERVICE*/
function updateConfigSettings (object) {
  return  updateConfigSettingsAPI(object).then((response)=>{
    if((STATUS_CODES.includes(response.status) && response.body.length !== 0)) {
      return response.body
    }
  }).catch((er)=>{
    if(STATUS_CODES.includes(er.status)) {
      return er.message
    }
  })
}


/*GET EXTENDED CONTROL SERVICE*/
function getModCmdService (controlcode) {
  let cu50no = localStorage.getItem('serialNo')
  let deviceid = localStorage.getItem('nodeId')
  return  getModCmdAPI(controlcode, cu50no, deviceid).then((response)=>{
    if((STATUS_CODES.includes(response.status) && response.body.length !== 0)) {
      return response.body
    }
  }).catch((er)=>{
    if(STATUS_CODES.includes(er.status)) {
      return er.message
    }
  })
}

export {
  loginService,
  activeDeviceService,
  deviceSettingService,
  surveyService,
  updateConfigSettings,
  connectCU50Service,
  modCommandService,
  getSurveyService,
  getModCmdService
}
