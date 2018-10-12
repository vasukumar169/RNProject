import {AsyncStorage, Alert, Platform,AppState} from 'react-native'
import DeviceInfo from 'react-native-device-info'
import PushNotificationAndroid from 'react-native-push-notification'
import {Scene, Router, Stack, Actions} from 'react-native-router-flux'
var PushNotification = require('react-native-push-notification');
import moment from 'moment';
import I18n from './../utilities/i18n'
import {TOTAL, CAR_COUNT} from "./../utilities/HelperLabels"
import {SENDER_ID} from "./../services/webServices";
/*Managing the language Format dynamically*/
setLanguage = () => {
  AsyncStorage.getItem('languageFormat').then((response) => {
    I18n.locale = response
  })
}

/*Whole Push notification cOnfiguration as constant to reuse*/
/*onRegister() it registers the token though ots a required function*/
/*onNotification() it is triggered when it receives and message notification hub*/
/*senderID = it is similar to the senderID which is generated firebase console.*/
const PUSH_MANAGER = () => {
  if(Platform.OS=="android")  {
    if(AppState.currentState=="background" || AppState.currentState== "active" || AppState.currentState== "inactive" || AppState.currentState==null)
      PushNotification.configure({
          onRegister: function(token) {},
          onNotification: function(notification) {
            setTimeout (()=> {
              if(notification['foreground']) {
                let newData = JSON.parse(new String (notification.details))
                if('DAYPART' in newData) {
                  let store_name = newData['StoreName']
                  let store_num = newData['StoreNumber']
                  let store_uid = newData['StoreUID']
                  let day_part_data = newData['DAYPART']
                  let keyArray = []
                  let key;
                  for (key in day_part_data) {
                    keyArray.push(key)
                  }
                  let startTimeIndex = keyArray.indexOf("StartTime")
                  let endTimeIndex = keyArray.indexOf("EndTime")
                  let detectorDataIndex = 3-(endTimeIndex + startTimeIndex)
                  let time1 = moment.utc(day_part_data[keyArray[startTimeIndex]]*1000).format('h A')
                  let time2 = moment.utc(day_part_data[keyArray[endTimeIndex]]*1000).format('h A')

                  let detectionPoint = keyArray[detectorDataIndex] ==TOTAL ? I18n.t('Lane Total') : keyArray[detectorDataIndex] ==CAR_COUNT ? I18n.t('Total')+" "+I18n.t('Cars') : keyArray[detectorDataIndex]

                  let alertMessage = day_part_data[keyArray[detectorDataIndex]] == "null" ? (
                  I18n.t("Store")+" "+store_num+"\n"+"System is offline"+"\n"+I18n.t("Daypart")+" "+time1+" — "+time2)
                  :
                  (I18n.t("Store")+" "+store_num+"\n"+detectionPoint+" "+I18n.t('exceeded')+" "+Math.round(day_part_data[keyArray[detectorDataIndex]])+"\n"+I18n.t("Daypart")+" "+I18n.t("Alert")+" "+time1+" — "+time2)

                  Actions.storeBoard({rowData:{ "StoreName" : store_name,
                                                "StoreUID" : store_uid
                                              },
                                      pnsTab:true,
                                      alertMessage : alertMessage,
                                      currTab:'daypart'})
                }
                if('HOUR' in newData) {
                  let store_name = newData['StoreName']
                  let store_num = newData['StoreNumber']
                  let store_uid = newData['StoreUID']
                  let hour_data = newData['HOUR']
                  let keyArray = []
                  let key;
                  for (key in hour_data) {
                    keyArray.push(key)
                  }
                  let startTimeIndex = keyArray.indexOf("StartTime")
                  let endTimeIndex = keyArray.indexOf("EndTime")
                  let detectorDataIndex = 3-(endTimeIndex + startTimeIndex)
                  // let time1 = moment.utc(hour_data[keyArray[startTimeIndex]]*1000).format('h A')
                  // let time2 = moment.utc(hour_data[keyArray[endTimeIndex]]*1000).format('h A')

                  let lengthOfTime = new Date().toLocaleTimeString().length
                  let x = new Date().toLocaleTimeString()
                  let time1 = moment().format('h A')
                  // let time1 = x[0]+" "+x[lengthOfTime-2]+""+x[lengthOfTime-1]


                  let detectionPoint = keyArray[detectorDataIndex] ==TOTAL ? I18n.t('Lane Total') : keyArray[detectorDataIndex] ==CAR_COUNT ? I18n.t('Total')+" "+I18n.t('Cars') : keyArray[detectorDataIndex]

                  let alertMessage = hour_data[keyArray[detectorDataIndex]] == "null" ? (
                  // I18n.t("Store")+" "+store_num+"\n"+"System is offline"+"\n"+I18n.t("Hour")+" "+time1+" — "+time2)
                  I18n.t("Store")+" "+store_num+"\n"+"System is offline"+"\n"+I18n.t("Hour")+" "+time1)
                  :
                  // (I18n.t("Store")+" "+store_num+"\n"+detectionPoint+" "+I18n.t('exceeded')+" "+Math.round(hour_data[keyArray[detectorDataIndex]])+"\n"+I18n.t("Hour")+" "+I18n.t("Alert")+" "+time1+" — "+time2)
                  (I18n.t("Store")+" "+store_num+"\n"+detectionPoint+" "+I18n.t('exceeded')+" "+Math.round(hour_data[keyArray[detectorDataIndex]])+"\n"+I18n.t("Hour")+" "+I18n.t("Alert")+" "+time1)

                  Actions.storeBoard({rowData:{ "StoreName" : store_name,
                                                "StoreUID" : store_uid
                                              },
                                      pnsTab:true,
                                      alertMessage : alertMessage,
                                      currTab:'hour'})
                }
                if('DAY' in newData) {
                  let store_name = newData['StoreName']
                  let store_uid = newData['StoreUID']
                  let day_data = newData['DAY']
                  let keyArray = []
                  let key;
                  for (key in day_data) {
                    keyArray.push(key)
                  }
                  let startTimeIndexDay = keyArray.indexOf("StartTime")
                  let endTimeIndexDay = keyArray.indexOf("EndTime")
                  let detectorDataIndexDay = 3-(endTimeIndexDay + startTimeIndexDay)

                  let store_num = newData['StoreNumber']

                  let alertMessage = day_data[keyArray[detectorDataIndexDay]]=="null" ? (
                  I18n.t("Store")+" "+store_num+"\n"+"System is offline"+"\n"+I18n.t("Day")+" "+I18n.t("Day")+" "+I18n.t(moment(new Date()).format('dddd'))+" – "+moment(new Date()).format(' – D'))
                  :
                  (I18n.t("Store")+" "+store_num+"\n"+I18n.t("Total Cars")+" "+I18n.t('exceeded')+" "+Math.round(day_data[keyArray[detectorDataIndexDay]])+"\n"+I18n.t("Day")+" "+I18n.t("Alert")+" "+moment(new Date()).format('MMMM D, YYYY'))
                  // let alertMessage = day_data[keyArray[detectorDataIndexDay]]=="null" ? (store_name+"\n"+"No Data Received") : (store_name+"\n"+"Car > "+Math.round(day_data[keyArray[detectorDataIndexDay]]))
                  Actions.storeBoard({rowData:{ "StoreName" : store_name,
                                                "StoreUID" : store_uid
                                              },
                                      pnsTab:true,
                                      alertMessage : alertMessage,
                                      currTab:'day'})
                }
              }
              else {
                let newData = JSON.parse(new String (notification.details))
                if(notification['userInteraction'])
                {
                  if('DAYPART' in newData) {
                    let store_name = newData['StoreName']
                    let store_num = newData['StoreNumber']
                    let store_uid = newData['StoreUID']
                    let day_part_data = newData['DAYPART']
                    let keyArray = []
                    let key;
                      for (key in day_part_data) {
                        keyArray.push(key)
                      }
                      let startTimeId = keyArray.indexOf("StartTime")
                      let endTimeId = keyArray.indexOf("EndTime")
                      let detectorDataId = 3-(endTimeId + startTimeId)
                      let time1 = moment.utc(day_part_data[keyArray[startTimeId]]*1000).format('h A')
                      let time2 = moment.utc(day_part_data[keyArray[endTimeId]]*1000).format('h A')
                      let detectionPoint = keyArray[detectorDataId] ==TOTAL ? I18n.t('Lane Total') : keyArray[detectorDataId] ==CAR_COUNT ? I18n.t('Total')+" "+I18n.t('Cars') : keyArray[detectorDataId]

                      let alertMessage = day_part_data[keyArray[detectorDataId]] == "null" ? (
                      I18n.t("Store")+" "+store_num+"\n"+"System is offline"+"\n"+I18n.t("Daypart")+" "+time1+" — "+time2)
                      :
                      (I18n.t("Store")+" "+store_num+"\n"+detectionPoint+" "+I18n.t('exceeded')+" "+Math.round(day_part_data[keyArray[detectorDataId]])+"\n"+I18n.t("Daypart")+" "+I18n.t("Alert")+" "+time1+" — "+time2)

                      Actions.storeBoard({rowData:{ "StoreName" : store_name,
                                                    "StoreUID" : store_uid
                                                  },
                                          pnsTab:true,
                                          alertMessage : alertMessage,
                                          currTab:'daypart'})


                  }
                  if('HOUR' in newData) {
                    let store_name = newData['StoreName']
                    let store_num = newData['StoreNumber']
                    let store_uid = newData['StoreUID']
                    let hour_data = newData['HOUR']
                    let keyArray = []
                    let key;
                    for (key in hour_data) {
                      keyArray.push(key)
                    }
                    let startTimeIndex = keyArray.indexOf("StartTime")
                    let endTimeIndex = keyArray.indexOf("EndTime")
                    let detectorDataIndex = 3-(endTimeIndex + startTimeIndex)
                    // let time1 = moment.utc(hour_data[keyArray[startTimeIndex]]*1000).format('h A')
                    // let time2 = moment.utc(hour_data[keyArray[endTimeIndex]]*1000).format('h A')
                    let lengthOfTime = new Date().toLocaleTimeString().length
                    let x = new Date().toLocaleTimeString()
                    let time1 = moment().format('h A')

                    let detectionPoint = keyArray[detectorDataIndex] ==TOTAL ? I18n.t('Lane Total') : keyArray[detectorDataIndex] ==CAR_COUNT ? I18n.t('Total')+" "+I18n.t('Cars') : keyArray[detectorDataIndex]

                    let alertMessage = hour_data[keyArray[detectorDataIndex]] == "null" ? (
                    // I18n.t("Store")+" "+store_num+"\n"+"System is offline"+"\n"+I18n.t("Hour")+" "+time1+" — "+time2)
                    I18n.t("Store")+" "+store_num+"\n"+"System is offline"+"\n"+I18n.t("Hour")+" "+time1)
                    :
                    // (I18n.t("Store")+" "+store_num+"\n"+detectionPoint+" "+I18n.t('exceeded')+" "+Math.round(hour_data[keyArray[detectorDataIndex]])+"\n"+I18n.t("Hour")+" "+I18n.t("Alert")+" "+time1+" — "+time2)
                    (I18n.t("Store")+" "+store_num+"\n"+detectionPoint+" "+I18n.t('exceeded')+" "+Math.round(hour_data[keyArray[detectorDataIndex]])+"\n"+I18n.t("Hour")+" "+I18n.t("Alert")+" "+time1)
                    Actions.storeBoard({rowData:{ "StoreName" : store_name,
                                                  "StoreUID" : store_uid
                                                },
                                        pnsTab:true,
                                        alertMessage : alertMessage,
                                        currTab:'hour'})
                  }
                  if('DAY' in newData) {
                    let store_name = newData['StoreName']
                    let store_uid = newData['StoreUID']
                    let day_data = newData['DAY']
                    let keyArray =[]
                    let key;
                    for (key in day_data) {
                      keyArray.push(key)
                    }
                    let startTimeDayId = keyArray.indexOf("StartTime")
                    let endTimeDayId = keyArray.indexOf("EndTime")
                    let detectorDataDayId = 3-(endTimeDayId + startTimeDayId)

                    let store_num = newData['StoreNumber']

                    let alertMessage = day_data[keyArray[detectorDataDayId]]=="null" ? (
                    I18n.t("Store")+" "+store_num+"\n"+"System is offline"+"\n"+I18n.t("Day")+" "+I18n.t(moment(new Date()).format('dddd'))+" – "+moment(new Date()).format('D'))
                    :
                    (I18n.t("Store")+" "+store_num+"\n"+I18n.t("Total Cars")+" "+I18n.t('exceeded')+" "+Math.round(day_data[keyArray[detectorDataDayId]])+"\n"+I18n.t("Day")+" "+I18n.t("Alert")+" "+moment(new Date()).format('MMMM D, YYYY'))

                    // let alertMessage = day_data[keyArray[detectorDataDayId]]=="null" ? (store_name+"\n"+"No Data Received") : (store_name+"\n"+"Car > "+Math.round(day_data[keyArray[detectorDataDayId]]))

                    Actions.storeBoard({rowData:{ "StoreName" : store_name,
                                                  "StoreUID" : store_uid
                                                },
                                        pnsTab:true,
                                        alertMessage : alertMessage,
                                        currTab:'day'})

                  }
                }
              }
            },1);
          },
          senderID: SENDER_ID,
      });
  }/***********IOS STARTED DOWN****************/
  else {
    if(AppState.currentState=="background" || AppState.currentState== "active" || AppState.currentState== "inactive")
      PushNotification.configure({
          onRegister: function(token) {
              console.log( 'TOKEN:', token );
          },
          onNotification: function(notification) {
            setTimeout (()=>{
              if(notification['foreground']) {
                let newData = notification.message
                if ('DAYPART' in newData) {
                  let store_name = newData['StoreName']
                  let store_uid = newData['StoreUID']
                  let day_part_data = newData['DAYPART']
                  let keyArray = []
                  let key;
                  for (key in day_part_data) {
                    keyArray.push(key)
                  }
                  let startTimeIndex = keyArray.indexOf("StartTime")
                  let endTimeIndex = keyArray.indexOf("EndTime")
                  let detectorDataIndex = 3-(endTimeIndex + startTimeIndex)
                  let time1 = moment.utc(day_part_data[keyArray[startTimeIndex]]*1000).format('h A')
                  let time2 = moment.utc(day_part_data[keyArray[endTimeIndex]]*1000).format('h A')
                  let store_num = newData['StoreNumber']

                  let detectionPoint = keyArray[detectorDataIndex] ==TOTAL ? I18n.t('Lane Total') : keyArray[detectorDataIndex] ==CAR_COUNT ? I18n.t('Total')+" "+I18n.t('Cars') : keyArray[detectorDataIndex]

                  let alertMessage = day_part_data[keyArray[detectorDataIndex]] == "null" ? (
                  I18n.t("Store")+" "+store_num+"\n"+"System is offline"+"\n"+I18n.t("Daypart")+" "+time1+" — "+time2)
                  :
                  (I18n.t("Store")+" "+store_num+"\n"+detectionPoint+" "+I18n.t('exceeded')+" "+Math.round(day_part_data[keyArray[detectorDataIndex]])+"\n"+I18n.t("Daypart")+" "+I18n.t("Alert")+" "+time1+" — "+time2)


                  Actions.storeBoard({rowData:{ "StoreName" : store_name,
                                                "StoreUID" : store_uid
                                              },
                                      pnsTab:true,
                                      alertMessage : alertMessage,
                                      currTab:'daypart'})

                }
                if ('HOUR' in newData) {
                  let store_name = newData['StoreName']
                  let store_num = newData['StoreNumber']
                  let store_uid = newData['StoreUID']
                  let hour_data = newData['HOUR']
                  let keyArray = []
                  let key;
                  for (key in hour_data) {
                    keyArray.push(key)
                  }
                  let startTimeIndex = keyArray.indexOf("StartTime")
                  let endTimeIndex = keyArray.indexOf("EndTime")
                  let detectorDataIndex = 3-(endTimeIndex + startTimeIndex)
                  // let time1 = moment.utc(hour_data[keyArray[startTimeIndex]]*1000).format('h A')
                  // let time2 = moment.utc(hour_data[keyArray[endTimeIndex]]*1000).format('h A')

                  let lengthOfTime = new Date().toLocaleTimeString().length
                  let x = new Date().toLocaleTimeString()
                  let time1 = moment().format('h A')


                  let detectionPoint = keyArray[detectorDataIndex] ==TOTAL ? I18n.t('Lane Total') : keyArray[detectorDataIndex] ==CAR_COUNT ? I18n.t('Total')+" "+I18n.t('Cars') : keyArray[detectorDataIndex]

                  let alertMessage = hour_data[keyArray[detectorDataIndex]] == "null" ? (
                  // I18n.t("Store")+" "+store_num+"\n"+"System is offline"+"\n"+I18n.t("Hour")+" "+time1+" — "+time2)
                  I18n.t("Store")+" "+store_num+"\n"+"System is offline"+"\n"+I18n.t("Hour")+" "+time1)
                  :
                  // (I18n.t("Store")+" "+store_num+"\n"+detectionPoint+" "+I18n.t('exceeded')+" "+Math.round(hour_data[keyArray[detectorDataIndex]])+"\n"+I18n.t("Hour")+" "+I18n.t("Alert")+" "+time1+" — "+time2)
                  (I18n.t("Store")+" "+store_num+"\n"+detectionPoint+" "+I18n.t('exceeded')+" "+Math.round(hour_data[keyArray[detectorDataIndex]])+"\n"+I18n.t("Hour")+" "+I18n.t("Alert")+" "+time1)

                  Actions.storeBoard({rowData:{ "StoreName" : store_name,
                                                "StoreUID" : store_uid
                                              },
                                      pnsTab:true,
                                      alertMessage : alertMessage,
                                      currTab:'hour'})
                }
                if('DAY' in newData) {
                  let store_name = newData['StoreName']
                  let store_uid = newData['StoreUID']
                  let day_data = newData['DAY']
                  let keyArray = []
                  let key;
                  for (key in day_data) {
                    keyArray.push(key)
                  }
                  let startTimeIndexDay = keyArray.indexOf("StartTime")
                  let endTimeIndexDay = keyArray.indexOf("EndTime")
                  let detectorDataIndexDay = 3-(endTimeIndexDay + startTimeIndexDay)


                  let store_num = newData['StoreNumber']

                  let alertMessage = day_data[keyArray[detectorDataIndexDay]]=="null" ? (
                  I18n.t("Store")+" "+store_num+"\n"+"System is offline"+"\n"+I18n.t("Day")+" "+I18n.t(moment(new Date()).format('dddd'))+" – "+moment(new Date()).format('D'))
                  :
                  (I18n.t("Store")+" "+store_num+"\n"+I18n.t("Total Cars")+" "+I18n.t('exceeded')+" "+Math.round(day_data[keyArray[detectorDataIndexDay]])+"\n"+I18n.t("Day")+" "+I18n.t("Alert")+" "+moment(new Date()).format('MMMM D, YYYY'))

                  // let alertMessage = day_data[keyArray[detectorDataIndexDay]]=="null" ? (store_name+"\n"+"No Data Received") : (store_name+"\n"+"Car > "+Math.round(day_data[keyArray[detectorDataIndexDay]]))

                  Actions.storeBoard({rowData:{ "StoreName" : store_name,
                                                "StoreUID" : store_uid
                                              },
                                      pnsTab:true,
                                      alertMessage : alertMessage,
                                      currTab:'day'})

                }
              }
              else {
                let newData = notification.message
                if(notification['userInteraction'])
                {
                  if('DAYPART' in newData) {
                    let store_name = newData['StoreName']
                    let store_uid = newData['StoreUID']
                    let day_part_data = newData['DAYPART']
                    let keyArray = []
                    let key;
                      for (key in day_part_data) {
                        keyArray.push(key)
                      }
                      let startTimeId = keyArray.indexOf("StartTime")
                      let endTimeId = keyArray.indexOf("EndTime")
                      let detectorDataId = 3-(endTimeId + startTimeId)
                      let time1 = moment.utc(day_part_data[keyArray[startTimeId]]*1000).format('h A')
                      let time2 = moment.utc(day_part_data[keyArray[endTimeId]]*1000).format('h A')

                      let store_num = newData['StoreNumber']

                      let detectionPoint = keyArray[detectorDataId] ==TOTAL ? I18n.t('Lane Total') : keyArray[detectorDataId] ==CAR_COUNT ? I18n.t('Total')+" "+I18n.t('Cars') : keyArray[detectorDataId]

                      let alertMessage = day_part_data[keyArray[detectorDataId]] == "null" ? (
                      I18n.t("Store")+" "+store_num+"\n"+"System is offline"+"\n"+I18n.t("Daypart")+" "+time1+" — "+time2)
                      :
                      (I18n.t("Store")+" "+store_num+"\n"+detectionPoint+" "+I18n.t('exceeded')+" "+Math.round(day_part_data[keyArray[detectorDataId]])+"\n"+I18n.t("Daypart")+" "+I18n.t("Alert")+" "+time1+" — "+time2)

                      Actions.storeBoard({rowData:{ "StoreName" : store_name,
                                                    "StoreUID" : store_uid
                                                  },
                                          pnsTab:true,
                                          alertMessage : alertMessage,
                                          currTab:'daypart'})

                  }
                  if ('HOUR' in newData) {
                    let store_name = newData['StoreName']
                    let store_num = newData['StoreNumber']
                    let store_uid = newData['StoreUID']
                    let hour_data = newData['HOUR']
                    let keyArray = []
                    let key;
                    for (key in hour_data) {
                      keyArray.push(key)
                    }
                    let startTimeIndex = keyArray.indexOf("StartTime")
                    let endTimeIndex = keyArray.indexOf("EndTime")
                    let detectorDataIndex = 3-(endTimeIndex + startTimeIndex)
                    // let time1 = moment.utc(hour_data[keyArray[startTimeIndex]]*1000).format('h A')
                    // let time2 = moment.utc(hour_data[keyArray[endTimeIndex]]*1000).format('h A')

                    let lengthOfTime = new Date().toLocaleTimeString().length
                    let x = new Date().toLocaleTimeString()
                    let time1 = moment().format('h A')


                    let detectionPoint = keyArray[detectorDataIndex] ==TOTAL ? I18n.t('Lane Total') : keyArray[detectorDataIndex] ==CAR_COUNT ? I18n.t('Total')+" "+I18n.t('Cars') : keyArray[detectorDataIndex]

                    let alertMessage = hour_data[keyArray[detectorDataIndex]] == "null" ? (
                    // I18n.t("Store")+" "+store_num+"\n"+"System is offline"+"\n"+I18n.t("Hour")+" "+time1+" — "+time2)
                    I18n.t("Store")+" "+store_num+"\n"+"System is offline"+"\n"+I18n.t("Hour")+" "+time1)
                    :
                    // (I18n.t("Store")+" "+store_num+"\n"+detectionPoint+" "+I18n.t('exceeded')+" "+Math.round(hour_data[keyArray[detectorDataIndex]])+"\n"+I18n.t("Hour")+" "+I18n.t("Alert")+" "+time1+" — "+time2)
                    (I18n.t("Store")+" "+store_num+"\n"+detectionPoint+" "+I18n.t('exceeded')+" "+Math.round(hour_data[keyArray[detectorDataIndex]])+"\n"+I18n.t("Hour")+" "+I18n.t("Alert")+" "+time1)

                    Actions.storeBoard({rowData:{ "StoreName" : store_name,
                                                  "StoreUID" : store_uid
                                                },
                                        pnsTab:true,
                                        alertMessage : alertMessage,
                                        currTab:'hour'})
                  }
                  if('DAY' in newData) {
                    let store_name = newData['StoreName']
                    let store_uid = newData['StoreUID']
                    let day_data = newData['DAY']
                    let keyArray = []
                    let key;
                    for (key in day_data) {
                      keyArray.push(key)
                    }
                    let startTimeDayId = keyArray.indexOf("StartTime")
                    let endTimeDayId = keyArray.indexOf("EndTime")
                    let detectorDataDayId = 3-(endTimeDayId + startTimeDayId)

                    // let alertMessage = day_data[keyArray[detectorDataDayId]]=="null" ? (store_name+"\n"+"No Data Received") : (store_name+"\n"+"Car > "+Math.round(day_data[keyArray[detectorDataDayId]]))

                    let store_num = newData['StoreNumber']

                    let alertMessage = day_data[keyArray[detectorDataDayId]]=="null" ? (
                    I18n.t("Store")+" "+store_num+"\n"+"System is offline"+"\n"+I18n.t("Day")+" "+I18n.t(moment(new Date()).format('dddd'))+" – "+moment(new Date()).format(' – D'))
                    :
                    (I18n.t("Store")+" "+store_num+"\n"+I18n.t("Total Cars")+" "+I18n.t('exceeded')+" "+Math.round(day_data[keyArray[detectorDataDayId]])+"\n"+I18n.t("Day")+" "+I18n.t("Alert")+" "+moment(new Date()).format('MMMM D, YYYY'))

                    Actions.storeBoard({rowData:{ "StoreName" : store_name,
                                                  "StoreUID" : store_uid
                                                },
                                        pnsTab:true,
                                        alertMessage : alertMessage,
                                        currTab:'day'})

                  }
                }
              }
            },1);
          },
          senderID: SENDER_ID,
      });
  }
}

export { PUSH_MANAGER }
