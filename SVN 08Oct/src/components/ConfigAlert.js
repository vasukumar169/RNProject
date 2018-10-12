import React from 'react';
import {TouchableOpacity, Alert, Platform, AsyncStorage, KeyboardAvoidingView, Keyboard, Switch, Slider, StatusBar, StyleSheet, ScrollView, View, Text, Image,TextInput} from 'react-native';
import CommonStyles from './../stylesheets/CommonStyles'
import {Actions} from "react-native-router-flux";
import Icon  from 'react-native-vector-icons/Ionicons';
import { Picker } from 'react-native-picker-dropdown'
import moment from 'moment';
import isEmpty from 'lodash/isEmpty'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button'

// const Moment = require('moment');
const MomentRange = require('moment-range');
 const Moments = MomentRange.extendMoment(moment);
// import {CheckBox, StyleProvider } from 'native-base';
import {updateAlertConfig} from "./../services/webServices";
import getTheme from './../../native-base-theme/components';
import material from './../../native-base-theme/variables/material';
import IosStyles from './../stylesheets/IosStyles.ios'
import I18n from './../utilities/i18n'
import {Loader} from './ProgressLoader'
import {TRY_AGN_LTR} from "./../utilities/GenericMessages"
import {NO_DECIMAL} from "./../utilities/GenericMessages"
import {NO_NEGATIVE, NO_COMMA} from "./../utilities/GenericMessages"
import {NO_PLUS, NO_ASTERIKS, NO_PARENTHISIS, NO_HASH, NO_SPACE} from "./../utilities/GenericMessages"
import { NO_DOLLAR, NO_P, NO_W } from "./../utilities/GenericMessages"

import DatePicker from 'react-native-datepicker';
const tRArray  = [];
let DNDtime;

export default class ConfigAlert extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      switchValue :this.props.data.isOn != undefined ? this.props.data.isOn == "True" ? true : false : false ,
      ThresholdValue:this.props.data.threshold != undefined ? this.props.data.threshold ? this.props.data.threshold : "" : "",
      ThresholdValueSeconds:this.props.data.threshold != undefined ? this.props.data.threshold ? ((this.props.data.threshold)%60).toString() : "" :"",
      ThresholdValueMinutes:this.props.data.threshold != undefined ? this.props.data.threshold ? (Math.floor((this.props.data.threshold) / 60)).toString() : "" : "",
      value: this.props.data.HowOften != undefined ? this.props.data.HowOften ? this.props.data.HowOften : "0.5" :"0.5",
      isAnimating:true,
      timeRangeArray: this.props.data.listTimeRange != undefined ? this.props.data.listTimeRange.length > 0 ? this.props.data.listTimeRange : [] : [],
      isActive: this.props.data.RepeatAlert != undefined ? this.props.data.RepeatAlert == "True" ? true : false : false,
      isArray: true,
      timeDNDValue1 : this.props.data.Dndfrom ? this.props.data.Dndfrom : "",
      timeDNDValue2 : this.props.data.DndTo ? this.props.data.DndTo : "",
      timeRangeValue1 : "00:00",
      timeRangeValue2 : "00:30",
      newTimeArray:[]
    }
  }

  componentDidMount () {
    //Fetching the credenatials and data from Local Storage
    let {ThresholdValue} = this.state
    AsyncStorage.getItem("JWT").then((response)=>{
      this.setState({JWT:response},()=>{
        AsyncStorage.getItem("uName").then((response)=>{
          this.setState({userId:response,
              uName:encodeURIComponent(response.split("@")[0])+"@"+response.split("@")[1]
          },()=>{
            AsyncStorage.getItem("TF").then((response)=>{
              this.setState({timeFormat : response},()=>{
                AsyncStorage.getItem("languageFormat").then((response)=>{
                  this.setState({isAnimating:false},()=>{
                    I18n.locale = response
                  })
                })
              })
            })
          });
        })
      })
    }).catch((error)=>{
      this.setState({isAnimating : false})
		})
  }

  //Setting the threshold value

  handleAlertValue = (text) => {
    this.setState({ThresholdValue: text})
  }

  //Setting the threshold value in Minutes

  handleAlertValueMinutes = (text) => {
    this.setState({ThresholdValueMinutes: text})
  }

  //Setting the threshold value in Seconds

  handleAlertValueSeconds = (text) => {
    this.setState({ThresholdValueSeconds: text})
  }

  //Setting the switch value

  handleSwitchValue = () => {
    Keyboard.dismiss()
    this.setState({switchValue: !this.state.switchValue})
  }

  //updating the alertsettings by calling POST API

  updateAlertConfiguration = (timeRangeArrayParam) => {
    // console.log("**************************")
    // console.log("**************************")
    this.setState({isAnimating:true})
    let thresholdFinalValue = this.state.ThresholdValue ? parseInt(this.state.ThresholdValue) : ""
    updateAlertConfig(
                      this.state.uName,
                      this.state.userId,
                      this.state.JWT,
                      this.props.tabType.toUpperCase(),
                      this.props.storeUID,
                      this.props.alertType,
                      this.state.switchValue,
                      thresholdFinalValue,
                      this.state.isActive,
                      (this.state.value).toString(),
                      this.state.timeDNDValue1,
                      this.state.timeDNDValue2,
                      timeRangeArrayParam
                    ).then((response)=>{
                      // console.log(response)
                      this.setState({isAnimating:false})
                      if(this.props.storeUID.length==1) {
                        Actions.storeBoard({switchValue1 :this.state.switchValue,
                          currTab:this.props.tabType,
                          rowData:this.props.rowData,
                          storeUID:this.props.storeUID[0]
                        })
                      }
                      else {
                        Actions.multiStoreBoard({
                          currTab:this.props.tabType,
                          dataArray:this.props.storeUID
                        })
                      }
                    }).catch((error)=>{
                      this.setState({isAnimating:false},()=>{
                        Alert.alert(
                          I18n.t('Alert'),
                          I18n.t(TRY_AGN_LTR()) ,
                          [
                            {text: I18n.t('OK'), onPress: () => {Actions.pop()}}
                          ],
                          { cancelable: false }
                        )
                      })
                    })
                  }

  // Back arrow clicked conditionally

  naviagteBack =()=>{
    var timeArray = []
    timeArray = [...this.state.timeRangeArray]
    var newTimeArray=[]
    if(timeArray.length==0) {
      newTimeArray.push({TimeRangeFrom:this.state.timeRangeValue1,TimeRangeTo:this.state.timeRangeValue2})
    }
    else {
      timeArray.forEach(function(el, index) {
        newTimeArray.push({TimeRangeFrom:el.TimeRangeFrom,TimeRangeTo:el.TimeRangeTo})
      });
    }
    Keyboard.dismiss();
    if(this.state.timeFormat=="seconds") {
      if(this.props.data.threshold) {
        if(this.state.ThresholdValue.length==0) {
          Alert.alert("Please fill the "+this.props.alertType+" threshold value")
        }
        if(this.state.ThresholdValue.length > 0)
        {
          if(this.state.ThresholdValue.includes("-")) {
            Alert.alert(I18n.t(NO_NEGATIVE()))
          }
          else if(this.state.ThresholdValue.includes(".")) {
            Alert.alert(I18n.t(NO_DECIMAL()))
          }
          else if(this.state.ThresholdValue.includes(",")) {
            Alert.alert(I18n.t(NO_COMMA()))
          }
          else if(this.state.ThresholdValue.includes("(")) {
            Alert.alert(I18n.t(NO_PARENTHISIS()))
          }
          else if(this.state.ThresholdValue.includes(")")) {
            Alert.alert(I18n.t(NO_PARENTHISIS()))
          }
          else if(this.state.ThresholdValue.includes("*")) {
            Alert.alert(I18n.t(NO_ASTERIKS()))
          }
          else if(this.state.ThresholdValue.includes("#")) {
            Alert.alert(I18n.t(NO_HASH()))
          }
          else if(this.state.ThresholdValue.includes("+")) {
            Alert.alert(I18n.t(NO_PLUS()))
          }
          else if(this.state.ThresholdValue.includes(" ")) {
            Alert.alert(I18n.t(NO_SPACE()))
          }
          else if(this.state.ThresholdValue.includes("$")) {
            Alert.alert(I18n.t(NO_DOLLAR()))
          }
          else if(this.state.ThresholdValue.includes("P")) {
            Alert.alert(I18n.t(NO_P()))
          }
          else if(this.state.ThresholdValue.includes("W")) {
            Alert.alert(I18n.t(NO_W()))
          }
          else {
            this.updateAlertConfiguration(newTimeArray)
          }
        }
      }
      else {
        if(this.state.ThresholdValue.length==0) {
          Actions.pop()
        }
        if(this.state.ThresholdValue.length > 0) {
          if(this.state.ThresholdValue.includes("-")) {
            Alert.alert(I18n.t(NO_NEGATIVE()))
          }
          else if(this.state.ThresholdValue.includes(".")) {
            Alert.alert(I18n.t(NO_DECIMAL()))
          }
          else if(this.state.ThresholdValue.includes(",")) {
            Alert.alert(I18n.t(NO_COMMA()))
          }
          else if(this.state.ThresholdValue.includes("(")) {
            Alert.alert(I18n.t(NO_PARENTHISIS()))
          }
          else if(this.state.ThresholdValue.includes(")")) {
            Alert.alert(I18n.t(NO_PARENTHISIS()))
          }
          else if(this.state.ThresholdValue.includes("*")) {
            Alert.alert(I18n.t(NO_ASTERIKS()))
          }
          else if(this.state.ThresholdValue.includes("#")) {
            Alert.alert(I18n.t(NO_HASH()))
          }
          else if(this.state.ThresholdValue.includes("+")) {
            Alert.alert(I18n.t(NO_PLUS()))
          }
          else if(this.state.ThresholdValue.includes(" ")) {
            Alert.alert(I18n.t(NO_SPACE()))
          }
          else if(this.state.ThresholdValue.includes("$")) {
            Alert.alert(I18n.t(NO_DOLLAR()))
          }
          else if(this.state.ThresholdValue.includes("P")) {
            Alert.alert(I18n.t(NO_P()))
          }
          else if(this.state.ThresholdValue.includes("W")) {
            Alert.alert(I18n.t(NO_W()))
          }
          else {
            this.updateAlertConfiguration(newTimeArray)
          }
        }
      }
    }
    else {
      if(this.props.alertType!="CarCount") {
        if(this.props.data.threshold) {
          if(this.state.ThresholdValueMinutes.length==0 && this.state.ThresholdValueSeconds.length==0) {
            Alert.alert("Please fill the "+this.props.alertType+" threshold value")
          }
          else {
            if(this.state.ThresholdValueMinutes.includes("-") || this.state.ThresholdValueSeconds.includes("-")) {
              Alert.alert(I18n.t(NO_NEGATIVE()))
            }
            else if(this.state.ThresholdValueMinutes.includes(".") || this.state.ThresholdValueSeconds.includes(".")) {
              Alert.alert(I18n.t(NO_DECIMAL()))
            }
            else if(this.state.ThresholdValueMinutes.includes(",") || this.state.ThresholdValueSeconds.includes(",")) {
              Alert.alert(I18n.t(NO_COMMA()))
            }
            else if(this.state.ThresholdValueMinutes.includes("(") || this.state.ThresholdValueSeconds.includes("(")) {
              Alert.alert(I18n.t(NO_PARENTHISIS()))
            }
            else if(this.state.ThresholdValueMinutes.includes(")") || this.state.ThresholdValueSeconds.includes(")")) {
              Alert.alert(I18n.t(NO_PARENTHISIS()))
            }
            else if(this.state.ThresholdValueMinutes.includes("*") || this.state.ThresholdValueSeconds.includes("*")) {
              Alert.alert(I18n.t(NO_ASTERIKS()))
            }
            else if(this.state.ThresholdValueMinutes.includes("#") || this.state.ThresholdValueSeconds.includes("#")) {
              Alert.alert(I18n.t(NO_HASH()))
            }
            else if(this.state.ThresholdValueMinutes.includes("+") || this.state.ThresholdValueSeconds.includes("+")) {
              Alert.alert(I18n.t(NO_PLUS()))
            }
            else if(this.state.ThresholdValueMinutes.includes(" ") || this.state.ThresholdValueSeconds.includes(" ")) {
              Alert.alert(I18n.t(NO_SPACE()))
            }
            else if(this.state.ThresholdValueMinutes.includes("$") || this.state.ThresholdValueSeconds.includes("$")) {
              Alert.alert(I18n.t(NO_DOLLAR()))
            }
            else if(this.state.ThresholdValueMinutes.includes("P") || this.state.ThresholdValueSeconds.includes("P")) {
              Alert.alert(I18n.t(NO_P()))
            }
            else if(this.state.ThresholdValueMinutes.includes("W") || this.state.ThresholdValueSeconds.includes("W")) {
              Alert.alert(I18n.t(NO_W()))
            }
            else {
              let ThresholdValue = (parseInt((this.state.ThresholdValueMinutes)*60) + parseInt(this.state.ThresholdValueSeconds*1)).toString()
              this.setState({ThresholdValue : ThresholdValue},()=>{
                if(this.state.ThresholdValue.length==0) {
                  Actions.pop()
                }
                if(this.state.ThresholdValue.length > 0) {
                  this.updateAlertConfiguration(newTimeArray)
                }
              })
            }
          }
        }
        else {
          if(this.state.ThresholdValueMinutes.length==0 && this.state.ThresholdValueSeconds.length==0) {
            Actions.pop()
          }
          else {
            if(this.state.ThresholdValueMinutes.includes("-") || this.state.ThresholdValueSeconds.includes("-")) {
              Alert.alert(I18n.t(NO_NEGATIVE()))
            }
            else if(this.state.ThresholdValueMinutes.includes(".") || this.state.ThresholdValueSeconds.includes(".")) {
              Alert.alert(I18n.t(NO_DECIMAL()))
            }
            else if(this.state.ThresholdValueMinutes.includes(",") || this.state.ThresholdValueSeconds.includes(",")) {
              Alert.alert(I18n.t(NO_COMMA()))
            }
            else if(this.state.ThresholdValueMinutes.includes("(") || this.state.ThresholdValueSeconds.includes("(")) {
              Alert.alert(I18n.t(NO_PARENTHISIS()))
            }
            else if(this.state.ThresholdValueMinutes.includes(")") || this.state.ThresholdValueSeconds.includes(")")) {
              Alert.alert(I18n.t(NO_PARENTHISIS()))
            }
            else if(this.state.ThresholdValueMinutes.includes("*") || this.state.ThresholdValueSeconds.includes("*")) {
              Alert.alert(I18n.t(NO_ASTERIKS()))
            }
            else if(this.state.ThresholdValueMinutes.includes("#") || this.state.ThresholdValueSeconds.includes("#")) {
              Alert.alert(I18n.t(NO_HASH()))
            }
            else if(this.state.ThresholdValueMinutes.includes("+") || this.state.ThresholdValueSeconds.includes("+")) {
              Alert.alert(I18n.t(NO_PLUS()))
            }
            else if(this.state.ThresholdValueMinutes.includes(" ") || this.state.ThresholdValueSeconds.includes(" ")) {
              Alert.alert(I18n.t(NO_SPACE()))
            }
            else if(this.state.ThresholdValueMinutes.includes("$") || this.state.ThresholdValueSeconds.includes("$")) {
              Alert.alert(I18n.t(NO_DOLLAR()))
            }
            else if(this.state.ThresholdValueMinutes.includes("P") || this.state.ThresholdValueSeconds.includes("P")) {
              Alert.alert(I18n.t(NO_P()))
            }
            else if(this.state.ThresholdValueMinutes.includes("W") || this.state.ThresholdValueSeconds.includes("W")) {
              Alert.alert(I18n.t(NO_W()))
            }
            else {
              let ThresholdValue = (parseInt((this.state.ThresholdValueMinutes)*60) + parseInt(this.state.ThresholdValueSeconds*1)).toString()
              this.setState({ThresholdValue : ThresholdValue},()=>{
                if(this.state.ThresholdValue.length==0) {
                  Actions.pop()
                }
                if(this.state.ThresholdValue.length > 0) {
                  this.updateAlertConfiguration(newTimeArray)
                }
              })
            }
          }
        }
      }
      else {
        if(this.props.data.threshold) {
          if(this.state.ThresholdValue.length==0) {
            Alert.alert("Please fill the "+this.props.alertType+" threshold value")
          }
          if(this.state.ThresholdValue.length > 0)
          {
            if(this.state.ThresholdValue.includes("-")) {
              Alert.alert(I18n.t(NO_NEGATIVE()))
            }
            else if(this.state.ThresholdValue.includes(".")) {
              Alert.alert(I18n.t(NO_DECIMAL()))
            }
            else if(this.state.ThresholdValue.includes(",")) {
              Alert.alert(I18n.t(NO_COMMA()))
            }
            else if(this.state.ThresholdValue.includes("(")) {
              Alert.alert(I18n.t(NO_PARENTHISIS()))
            }
            else if(this.state.ThresholdValue.includes(")")) {
              Alert.alert(I18n.t(NO_PARENTHISIS()))
            }
            else if(this.state.ThresholdValue.includes("*")) {
              Alert.alert(I18n.t(NO_ASTERIKS()))
            }
            else if(this.state.ThresholdValue.includes("#")) {
              Alert.alert(I18n.t(NO_HASH()))
            }
            else if(this.state.ThresholdValue.includes("+")) {
              Alert.alert(I18n.t(NO_PLUS()))
            }
            else if(this.state.ThresholdValue.includes(" ")) {
              Alert.alert(I18n.t(NO_SPACE()))
            }
            else if(this.state.ThresholdValue.includes("$")) {
              Alert.alert(I18n.t(NO_DOLLAR()))
            }
            else if(this.state.ThresholdValue.includes("P")) {
              Alert.alert(I18n.t(NO_P()))
            }
            else if(this.state.ThresholdValue.includes("W")) {
              Alert.alert(I18n.t(NO_W()))
            }
            else {
              this.updateAlertConfiguration(newTimeArray)
            }
          }
        }
        else {
          if(this.state.ThresholdValue.length==0) {
            Actions.pop()
          }
          if(this.state.ThresholdValue.length > 0)
          {
            if(this.state.ThresholdValue.includes("-")) {
              Alert.alert(I18n.t(NO_NEGATIVE()))
            }
            else if(this.state.ThresholdValue.includes(".")) {
              Alert.alert(I18n.t(NO_DECIMAL()))
            }
            else if(this.state.ThresholdValue.includes(",")) {
              Alert.alert(I18n.t(NO_COMMA()))
            }
            else if(this.state.ThresholdValue.includes("(")) {
              Alert.alert(I18n.t(NO_PARENTHISIS()))
            }
            else if(this.state.ThresholdValue.includes(")")) {
              Alert.alert(I18n.t(NO_PARENTHISIS()))
            }
            else if(this.state.ThresholdValue.includes("*")) {
              Alert.alert(I18n.t(NO_ASTERIKS()))
            }
            else if(this.state.ThresholdValue.includes("#")) {
              Alert.alert(I18n.t(NO_HASH()))
            }
            else if(this.state.ThresholdValue.includes("+")) {
              Alert.alert(I18n.t(NO_PLUS()))
            }
            else if(this.state.ThresholdValue.includes(" ")) {
              Alert.alert(I18n.t(NO_SPACE()))
            }
            else if(this.state.ThresholdValue.includes("$")) {
              Alert.alert(I18n.t(NO_DOLLAR()))
            }
            else if(this.state.ThresholdValue.includes("P")) {
              Alert.alert(I18n.t(NO_P()))
            }
            else if(this.state.ThresholdValue.includes("W")) {
              Alert.alert(I18n.t(NO_W()))
            }
            else {
              this.updateAlertConfiguration(newTimeArray)
            }
          }
        }
      }
    }
  }


  //return the text input value conditionally

  returnTextInput = () => {

      if(this.props.alertType!="CarCount")
      {
        if(this.state.timeFormat =="seconds") {
          return(
            <TextInput  maxLength={4}
                    allowFontScaling= {false}
                    keyboardType="numeric"
                    underlineColorAndroid="transparent"
                    onChangeText={this.handleAlertValue}
                    value={this.state.ThresholdValue}
                    style={[CommonStyles.font20,
                            CommonStyles.mustardBgColor,
                            CommonStyles.textCenter,
                            CommonStyles.mL30,{width:70,height:45}]}/>)
        }
        else {
          return(
            <View style={[CommonStyles.rowFlexDir]}>
              <TextInput  maxLength={3}
                          allowFontScaling= {false}
                          keyboardType="numeric"
                          underlineColorAndroid="transparent"
                          onChangeText={this.handleAlertValueMinutes}
                          value={this.state.ThresholdValueMinutes}
                          style={[CommonStyles.font20,
                                  CommonStyles.mustardBgColor,
                                  CommonStyles.textCenter,
                                  CommonStyles.mL30,{width:70,height:45}]}/>
              <View style={[{width:30}]}>
                <Text allowFontScaling={false}  style={[CommonStyles.font20,
                              CommonStyles.mTP10,
                              CommonStyles.textCenter,
                              CommonStyles.fontBold]}>
                  :
                </Text>
              </View>
              <TextInput  maxLength={2}
                          allowFontScaling= {false}
                          keyboardType="numeric"
                          underlineColorAndroid="transparent"
                          onChangeText={this.handleAlertValueSeconds}
                          value={this.state.ThresholdValueSeconds}
                          style={[CommonStyles.font20,
                                  CommonStyles.mustardBgColor,
                                  CommonStyles.textCenter,{width:50,height:45}]}/>
            </View>
          )
        }
      }
      else {
        return(
          <TextInput  maxLength={4}
                  allowFontScaling= {false}
                  keyboardType="numeric"
                  underlineColorAndroid="transparent"
                  onChangeText={this.handleAlertValue}
                  value={this.state.ThresholdValue}
                  style={[CommonStyles.font20,
                          CommonStyles.mustardBgColor,
                          CommonStyles.textCenter,
                          CommonStyles.mL30,{width:70,height:45}]}/>
    )}
  }

  //UI Part to render
  setRepeatAlert = (val) => {
    if(val == 0) {
      this.setState({isActive:true})
    }
    else if(val == 1) {
      this.setState({isActive:false})
    }
  }

  calculateTimeinMinutes = (startTime, endTime) => {
    var time1 = moment(startTime.toString(), "HH:mm")
    var time2 = moment(endTime.toString(), "HH:mm")
    var duration = moment.duration(time2.subtract(time1))
    var minutes = parseInt(duration.asMinutes())
    return minutes
  }


  checkOverlap = () => {
    let {timeRangeArray, isArray, timeRangeValue1, timeRangeValue2} = this.state
    let range1 = Moments.range( moment(timeRangeValue1, 'HH:mm'),  moment(timeRangeValue2, 'HH:mm'))
    timeRangeArray.push( {TimeRangeFrom:range1['start']['_i'], TimeRangeTo : range1['end']['_i'], range : range1} )
      for(let i = 0; i < timeRangeArray.length; i++) {
        if(timeRangeArray.length == 1) {
          this.setState({isArray : !isArray},
            ()=>{
              this.setState({
                timeRangeValue1: "00:00", timeRangeValue2 : "00:30"
            })
          })
        }
        if(timeRangeArray.length > 1) {

          let findObjIndex =  timeRangeArray.findIndex((element)=>{
            return element.range.start['_i'] == range1.start['_i'];
          })
          if(i== findObjIndex)  {

          }
          else {
            if(range1.overlaps(timeRangeArray[i]['range'])) {
              Alert.alert(
                I18n.t('Alert'),
                I18n.t('Time range has overlapped, Please change it') ,
                [
                  {text: 'OK'}
                ],
                { cancelable: false }
              )
              timeRangeArray.pop()
              break;
            }
            else {
              this.setState({isArray : !isArray},
                ()=>{
                  this.setState({
                    timeRangeValue1: "00:00", timeRangeValue2 : "00:30"
                })
              })
            }
          }
        }
      }
  }

  addNewRange = () => {
    let {timeRangeArray, isArray, timeRangeValue1, timeRangeValue2} = this.state
    var timeInMinutes = this.calculateTimeinMinutes(timeRangeValue1, timeRangeValue2)

    if(timeInMinutes >=30) {
      if(timeRangeArray.length > 0) {
        for (let s = 0; s <timeRangeArray.length; s++) {
          let range = Moments.range( moment(timeRangeArray[s].TimeRangeFrom, 'HH:mm'),  moment(timeRangeArray[s].TimeRangeTo, 'HH:mm'))
          timeRangeArray[s]['range'] = range
        }
        this.checkOverlap()
      }
      else {
        this.checkOverlap()
      }
    }
    else {
      Alert.alert(
        I18n.t('Alert'),
        I18n.t('Time range has not exceeded 30 minutes') ,
        [
          {text: 'OK'}
        ],
        { cancelable: false }
      )
    }

  }

  removeRangeRow = (id) => {
    let { timeRangeArray } = this.state

    timeRangeArray.splice(id, 1)

    this.setState({timeRangeArray})

  }


  render() {
    let radio_props = [
      {label: 'Yes', value: 0 },
      {label: 'No', value : 1 }
    ];
    let { isActive, timeRangeArray } = this.state

    if(this.state.isAnimating)
    {
      return (
        <View style={[CommonStyles.bgWhite,CommonStyles.flexOne,
                      CommonStyles.justifyCenterContent,
                      CommonStyles.alignCenterContent]}>
          <Loader isLoading = {this.state.isAnimating} />
        </View>
    )}
    return (
      <View style={Platform.OS=="ios" ? [CommonStyles.flexOne,IosStyles.mTP35] : [CommonStyles.flexOne]} >
        <StatusBar  barStyle={Platform.OS=="ios" ? 'dark-content' : 'light-content'}  hidden={false} />

          <View style={[CommonStyles.settingHeader,CommonStyles.blueHeaderColor]}>
            <TouchableOpacity style={Platform.OS=="ios" ?[IosStyles.padding11,CommonStyles.flex4By10]:[CommonStyles.padding20,CommonStyles.flex4By10]}
                            onPress={this.naviagteBack}>
              <Icon name="ios-arrow-back-outline"  backgroundColor="#3b5998"
                        style={[CommonStyles.font30, CommonStyles.textWhite,CommonStyles.textLeft]} />
            </TouchableOpacity>
            <View style={Platform.OS=="ios" ?[IosStyles.padding11,CommonStyles.flex11,CommonStyles.pL0]:[CommonStyles.padding20,CommonStyles.flex11,CommonStyles.pL0]}>
              <Text allowFontScaling={false}  style={[CommonStyles.textCenter,CommonStyles.font23,CommonStyles.fontBold,
                            CommonStyles.textWhite]}>
                {I18n.t('Mobile Alert').toUpperCase()}
              </Text>
            </View>
          </View>
{/*************************************************************************/}
          <View style={[CommonStyles.flexTen,CommonStyles.bgWhite]}>

            <View style={[CommonStyles.flexTwo,
                          CommonStyles.rowFlexDir,
                          CommonStyles.alignItemsStart,CommonStyles.alignCenter]}>
              <Switch style= {[CommonStyles.mL15]}
                      onValueChange={this.handleSwitchValue}
                      value={this.state.switchValue} />
              <Text allowFontScaling={false}  style={[CommonStyles.font20,CommonStyles.mL10,CommonStyles.flatListRenderRowTextColor]}>
              {
                  this.state.switchValue ? I18n.t('ON'):I18n.t('OFF')
              }
              </Text>
            </View>

            <View style={[CommonStyles.flex7By2,
                          CommonStyles.borderTop1,
                          CommonStyles.borderGreySeparator,
                          CommonStyles.borderbtmWidthOne]}>
              <View style={[CommonStyles.flexOne,CommonStyles.justifyCenterContent]}>
                <View style={[CommonStyles.mL15,CommonStyles.mB25]}>
                  <Text allowFontScaling={false}
                    style={[CommonStyles.font20,CommonStyles.flatListRenderRowTextColor]}>
                    {I18n.t('Alert when')}</Text>
                </View>
                <View style={[CommonStyles.rowFlexDir, CommonStyles.mL15]}>
                  <Text allowFontScaling={false}  ellipsizeMode={'tail'} numberOfLines={1}
                        style={[CommonStyles.font20,CommonStyles.mTP10,CommonStyles.fontBold,CommonStyles.flatListRenderRowTextColor]}>
                    {this.props.alertType}
                  </Text>
                  <Icon name="ios-arrow-forward-outline"
                        backgroundColor="#3b5998"
                        style={[CommonStyles.font30,,CommonStyles.mTP10,CommonStyles.backIconColor,CommonStyles.mL30]} />
                  {
                    this.returnTextInput()
                  }
                </View>
              </View>
            </View>
            {/*flex 2 starts*/}
            <View style={isEmpty(timeRangeArray) ?
              [CommonStyles.rowFlexDir,
              CommonStyles.borderGreySeparator,
              CommonStyles.borderbtmWidthOne,CommonStyles.flex11By4]
              :
              [CommonStyles.rowFlexDir,
              CommonStyles.borderGreySeparator,
              CommonStyles.borderbtmWidthOne,CommonStyles.flexFive]
            }>
            <ScrollView>
              <View style={[CommonStyles.rowFlexDir,{width:"100%",paddingTop:20,marginLeft:15,}]}>
                <Text allowFontScaling={false}
                    style={[CommonStyles.font18,CommonStyles.flatListRenderRowTextColor]}>
                    {I18n.t('Time Range')}
                </Text>

                <DatePicker
                  style={[CommonStyles.mL15,CommonStyles.mB10,{width: 80, borderWidth: 1, height:40,}]}
                  date={this.state.timeRangeValue1}
                  mode="time"
                  format="HH:mm"
                  showIcon={false}
                  confirmBtnText="OK"
                  cancelBtnText="CANCEL"
                  is24Hour={false}
                  customStyles={{
                    dateInput: {
                      borderWidth: 0,
                    },
                    placeholderText :{
                      color: '#58595b',
                      marginBottom:3
                    }
                  }}
                  androidMode="spinner"
                  onDateChange={(time) => {this.setState({timeRangeValue1: time})}}
                />
                <View style={[{width:30}]}>
                    <Text allowFontScaling={false}  style={[CommonStyles.font18,
                      CommonStyles.mTP10,
                      CommonStyles.textCenter,
                      CommonStyles.fontBold]}>
                      to
                    </Text>
                </View>
                <DatePicker
                  style={[CommonStyles.mB10,{width: 80,borderWidth: 1, height:40}]}
                  date={this.state.timeRangeValue2}
                  mode="time"
                  format="HH:mm"
                  confirmBtnText="OK"
                  cancelBtnText="CANCEL"
                  showIcon={false}
                  is24Hour={false}
                  customStyles={{
                    dateInput: {
                      borderWidth: 0,
                    },
                    placeholderText :{
                      color: '#58595b',
                      marginBottom:3
                    }
                  }}
                  androidMode="spinner"
                  onDateChange={(time) => {this.setState({timeRangeValue2: time})}}
                />
                <View style= {[CommonStyles.mL10]}>
                    <TouchableOpacity onPress={()=>{this.addNewRange()}}>
                      <Icon name="ios-add"
                        style={[CommonStyles.mTP10,
                        CommonStyles.font25, CommonStyles.mR40,CommonStyles.blackText]} />
                    </TouchableOpacity>
                  </View>

              </View>
              <View style={[CommonStyles.mTP20]}>
                {
                  timeRangeArray.map((val, id)=> {
                    return(
                      <View key = {id} style={[CommonStyles.rowFlexDir, CommonStyles.mB10]}>
                        <View style={[CommonStyles.mL30,CommonStyles.mTP15]}>
                          <Text allowFontScaling={false}
                            style={[CommonStyles.font16,CommonStyles.textWhite]}>
                            {I18n.t('Time Ran')}
                          </Text>
                        </View>
                        <Text
                          style={[CommonStyles.font14,
                          CommonStyles.textCenter,
                          CommonStyles.mL30,
                          CommonStyles.borderWidthOne,
                          CommonStyles.timeRange]}>
                          {val.TimeRangeFrom}
                        </Text>
                          <View style={[{width:30}]}>
                            <Text allowFontScaling={false}  style={[CommonStyles.font18,
                              CommonStyles.mTP5,
                              CommonStyles.textCenter,
                              CommonStyles.fontBold]}>
                              to
                            </Text>
                          </View>
                          <Text
                            style={[CommonStyles.font14,
                            CommonStyles.textCenter,
                            CommonStyles.borderWidthOne,
                            CommonStyles.timeRange]}>
                            {val.TimeRangeTo}
                          </Text>
                          <View style= {[CommonStyles.mL10]}>
                            <TouchableOpacity onPress={() => this.removeRangeRow(id)}>
                              <Icon name="ios-remove"
                                style={[CommonStyles.mTP10,
                                CommonStyles.font25, CommonStyles.mR40 ,CommonStyles.blackText]} />
                            </TouchableOpacity>
                          </View>
                      </View>
                    )
                  }
                  )
                }
              </View>
            </ScrollView>
            </View>
            {/*flex 2 ends*/}
            {/*Flex 3 starts*/}
            {this.props.alertType != 'CarCount' ?
            <View style={isActive ? [CommonStyles.flexFive,
              CommonStyles.borderGreySeparator,CommonStyles.mB10,
              CommonStyles.borderbtmWidthOne,{flexDirection:'column'}] : [CommonStyles.flex11By4,
                CommonStyles.borderGreySeparator,CommonStyles.mB20,
                CommonStyles.borderbtmWidthOne,{flexDirection:'column'}]}>

                <View style={[CommonStyles.rowFlexDir,
                  CommonStyles.mL30,
                  CommonStyles.mTP30]}>
                  <Text style={[CommonStyles.font20,CommonStyles.flatListRenderRowTextColor]}>
                    Repeat Alert
                  </Text>
                  <RadioForm style={[CommonStyles.mL30]}
                    radio_props={radio_props}
                    initial={this.state.isActive ? 0 : 1}
                    formHorizontal={true}
                    labelHorizontal={true}
                    buttonColor={'#2196f3'}
                    labelStyle={{marginRight: 30}}
                    animation={true}
                    onPress={(value) => {this.setRepeatAlert(value)}}
                  />
                </View>
                {
                  isActive ?
                  <View style={[CommonStyles.rowFlexDir,
                    CommonStyles.mL30,
                    CommonStyles.mTP20]}>
                    <Text style={[CommonStyles.font20,
                      CommonStyles.pT10,
                      CommonStyles.flatListRenderRowTextColor]}>
                      How Often
                    </Text>
                    <Picker  style={[,CommonStyles.borderWidthOne,
                      CommonStyles.mL30,{height: 50, width: 100}]}
                      selectedValue={this.state.value}
                      onValueChange={(itemValue) => this.setState({value: itemValue})}>
                      <Picker.Item label="0.5" value="0.5" />
                      <Picker.Item label="1" value="1" />
                      <Picker.Item label="2" value="2" />
                      <Picker.Item label="4" value="4" />
                      <Picker.Item label="8" value="8" />
                    </Picker>
                  </View>
                  : null
                }

            </View>
            :
            null
            }
            {/*Flex 3 ends*/}
            {/*Flex 4 starts*/}
              <View style={[CommonStyles.flexFour,
                CommonStyles.borderGreySeparator,
                { flexDirection: 'column',
                  alignItems: 'center'},
                CommonStyles.borderbtmWidthOne]}>

                <View style={[CommonStyles.mL30,CommonStyles.mTP10,CommonStyles.mR10]}>
                  <Text allowFontScaling={false}
                    style={[CommonStyles.font20,CommonStyles.flatListRenderRowTextColor]}>
                    Do Not Disturb
                  </Text>
                </View>
                <View style={[CommonStyles.mTP20,{marginBottom:20},CommonStyles.rowFlexDir]}>
                  <DatePicker
                    style={{width: 95,borderWidth: 1, height:40}}
                    date={this.state.timeDNDValue1}
                    mode="time"
                    placeholder="Select Time"
                    format="HH:mm"
                    confirmBtnText="OK"
                    cancelBtnText="CANCEL"
                    showIcon={false}
                    is24Hour={false}
                    customStyles={{
                      dateInput: {
                        borderWidth: 0,
                      },
                      placeholderText :{
                        color: '#58595b',
                        marginBottom:3
                      }
                    }}
                    androidMode="spinner"
                    onDateChange={(time) => {this.setState({timeDNDValue1: time})}}
                  />
                  <Text allowFontScaling={false}  style={[CommonStyles.font18,
                    CommonStyles.mTP5,
                    CommonStyles.mR10,
                    CommonStyles.mL10,
                    CommonStyles.textCenter,
                    CommonStyles.fontBold]}>
                    to
                  </Text>
                  <DatePicker
                    style={{width: 95,borderWidth: 1, height:40}}
                    date={this.state.timeDNDValue2}
                    mode="time"
                    placeholder="Select Time"
                    format="HH:mm"
                    confirmBtnText="OK"
                    cancelBtnText="CANCEL"
                    showIcon={false}
                    is24Hour={false}
                    customStyles={{
                      dateInput: {
                        borderWidth: 0,
                      },
                      placeholderText :{
                        color: '#58595b',
                        marginBottom:3
                      }
                    }}
                    androidMode="spinner"
                    onDateChange={(time) => {this.setState({timeDNDValue2: time})}}
                  />
                </View>
              </View>
            {/*Flex 4 ends*/}

          </View>
      </View>
    );
  }
}
