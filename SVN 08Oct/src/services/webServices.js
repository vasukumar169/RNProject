import superagent from 'superagent'
import { Alert } from 'react-native'

/***************************************LIVE****************************************/

// const BASE_URL = 'https://hme-live2-leaderboard.azurewebsites.net'
// const UPwd = 'Kfd149M$19*1'
// const Auth = 'Basic aG1lX3RlYW06S2ZkMTQ5TSQxOSox';
// const BASE_URL_PNS = 'https://hme-live-registerpushnotification.azurewebsites.net/api/hme/store/aggregate/registernotification'
// const SENDER_ID = "860124029336"

/***************************************UAT***********************************************/
const BASE_URL = 'https://hme-uat2-leaderboard.azurewebsites.net'
const UPwd = 'kZMb80K91$Q1'
const Auth = 'Basic aG1lX3RlYW06a1pNYjgwSzkxJFEx'
const BASE_URL_PNS = 'https://registerpushnotification.azurewebsites.net/api/hme/store/aggregate/registernotification'
const SENDER_ID = "971161549671"

/**************************************REST API SERVICES URL***************************************/

const UName = 'hme_team'
const LOGIN_API = '/api/hme/user/authLogin'
const DAY_PART_ALL_STOTRES = '/api/hme/store/aggregate/daypart'
const DAY_ALL_STOTRES = '/api/hme/store/aggregate/day'
const HOUR_ALL_STOTRES = '/api/hme/store/aggregate/hour'
const RESPECTIVE_STORE = '/api/hme/store/aggregate/alertsetting'
const FORGET_PASSWORD = '/api/hme/user/forgotPassword'
const GET_STORE_TYPE = '/api/hme/user/GetStoreTypeAlert'
const SET_STORE_TYPE = '/api/hme/user/StoreTypeAlert'
const POST_MULTI_STORE = '/api/hme/store/aggregate/alertsetting/GetAlertSettingListMultiStore'


/**************************************SERVICES FUNCTIONS***************************************/

function loginService (username, password) {
  return superagent
                  .post(BASE_URL + LOGIN_API)
                  .auth(UName, UPwd, { type: "Basic auth" })
                  .send({username: username, password: password})
                  .set('Authorization', Auth)
}

function getDayPartStores (user, JWT) {
  return superagent
                  .get(BASE_URL + DAY_PART_ALL_STOTRES)
                  .auth(UName, UPwd, { type: "Basic auth" })
                  .query('username=' + user)
                  .type('application/json')
                  .set('Authorization', Auth)
                  .set('AuthJWT', JWT)
}

function getDayStores (user, JWT) {
  return superagent
                  .get(BASE_URL + DAY_ALL_STOTRES)
                  .auth(UName, UPwd, { type: "Basic auth" })
                  .query('username=' + user)
                  .type('application/json')
                  .set('Authorization', Auth)
                  .set('AuthJWT', JWT)
}

function getHourStores (user, JWT) {
  return superagent
                  .get(BASE_URL + HOUR_ALL_STOTRES)
                  .auth(UName, UPwd, { type: "Basic auth" })
                  .query('username=' + user)
                  .type('application/json')
                  .set('Authorization', Auth)
                  .set('AuthJWT', JWT)
}

function getSpecificStoreData (user, storeUID, JWT) {
  return superagent
    .get(BASE_URL + RESPECTIVE_STORE)
    .auth(UName, UPwd, { type: "Basic auth" })
    .query('userName=' + user)
    .query('storeUID=' + storeUID)
    .type('application/json')
    .set('Authorization', Auth)
    .set('AuthJWT', JWT)
}

function updateAlertConfig (user, userId, JWT, tabType, storeUID,
                            alertType, isOn,
                            thresholdAlert, repeatAlert, howOften,
                            dndFrom, dndTo, listTimeRange) {
  return superagent
    .post(BASE_URL + RESPECTIVE_STORE)
    .send({
      AlertID : 0,
      User_Id: userId,
      TabType: tabType,
      StoreUIDs: storeUID,
      AlertType: alertType,
      IsOn: isOn,
      ThresholdAlert: thresholdAlert,
      RepeatAlert : repeatAlert,
      HowOften : howOften,
      Dndfrom :dndFrom,
      DndTo :dndTo,
      listTimeRange:listTimeRange
    })
    .query('username=' + user)
    .auth(UName, UPwd, { type: "Basic auth" })
    .type('application/json')
    .set('Authorization', Auth)
    .set('AuthJWT', JWT)
}

function forgetPassword (username, lang) {
  return superagent
    .post(BASE_URL + FORGET_PASSWORD)
    .auth(UName, { type: "Basic auth" })
    .send({username: username, lang : lang})
    .set('Authorization', Auth)
}

function registerPushNotificationIOS (username, tagName, appVersion, pushStatus) {
  return superagent
    .post(BASE_URL_PNS)
    .send({
      UserId: username,
      TagName: tagName,
      RegistrationId: tagName,
      App_Platform: "ios",
      AppVersion: appVersion,
      PushStatus: pushStatus
    })
}

function registerPushNotificationAndroid (username, tagName, appVersion, pushStatus) {
  return superagent
    .post(BASE_URL_PNS)
    .send({
      UserId: username,
      TagName: tagName,
      RegistrationId: tagName,
      App_Platform: "android",
      AppVersion: appVersion,
      PushStatus: pushStatus
    })
}
function getStoreType (user, platForm, JWT) {
  return superagent
    .get(BASE_URL + GET_STORE_TYPE)
      .auth(UName, UPwd, { type: "Basic auth" })
      .query('userID=' + user)
      .query('platForm=' + platForm)
      .type('application/json')
      .set('Authorization', Auth)
      .set('AuthJWT', JWT)
}


function setStoreType (user, platForm, storeType, JWT) {
  return superagent
  .post(BASE_URL + SET_STORE_TYPE)
  .send({
    userName: user,
    appPlatform: platForm,
    storeType: storeType
  })
  .auth(UName, UPwd, { type: "Basic auth" })
  .type('application/json')
  .set('Authorization', Auth)
  .set('AuthJWT', JWT)
}

function getMultiStoreData (storeUIDs, username, tabType, JWT) {
  return superagent
  .post(BASE_URL + POST_MULTI_STORE)
  .send({storeUIDs: storeUIDs})
  .query('tabType=' + tabType)
  .query('username=' + username)
  .auth(UName, UPwd, { type: "Basic auth" })
  .type('application/json')
  .set('Authorization', Auth)
  .set('AuthJWT', JWT)
}

export {
        loginService,
        getDayPartStores,
        getDayStores,
        getHourStores,
        updateAlertConfig,
        getSpecificStoreData,
        forgetPassword,
        registerPushNotificationIOS,
        registerPushNotificationAndroid,
        getStoreType,
        setStoreType,
        getMultiStoreData,
        SENDER_ID
      }
