import React from 'react';
import {TouchableHighlight, Platform, ToastAndroid,TouchableOpacity,BackHandler,StatusBar, Image, Keyboard, Text, View, Alert, TextInput, AsyncStorage} from 'react-native';
import CommonStyles from './../stylesheets/CommonStyles'
import {Loader} from './ProgressLoader'
import {Actions} from "react-native-router-flux"
import DayStoreBoard from './DayStoreBoard'
import DayPartStoreBoard from './DayPartStoreBoard'
import HourStoreBoard from './HourStoreBoard'
import Icon from 'react-native-vector-icons/Ionicons'
import {getSpecificStoreData} from "./../services/webServices"
import {loginService} from "./../services/webServices"
import IosStyles from './../stylesheets/IosStyles.ios'
import I18n from './../utilities/i18n'

import {PUSH_MANAGER} from "./PushManager"
const defaultTabStyle =[CommonStyles.textCenter,CommonStyles.font18,CommonStyles.tabTextColor]
const selectedTabStyle =[CommonStyles.textCenter,
                         CommonStyles.fontBold,
                         CommonStyles.font18,
                         CommonStyles.textWhite,
                         CommonStyles.paddingB6]
import {CATCH_ERROR_MSG, NOT_VALID_MSG, OBJ_REF_ERROR} from "./../utilities/GenericMessages"
import {CODE_200, CODE_498, CODE_500, CODE_401} from "./../utilities/GenericMessages"
import { encrypt, decrypt } from 'react-native-simple-encryption';

export default class StoreBoard extends React.Component {
  constructor(props) {
    super(props)
    this.state ={
      currTab:this.props.currTab,
      isAnimating:true,
      singleStore:{}
    }

  }
  componentWillMount () {
	   Keyboard.dismiss();
     if(this.props.alertMessage) {
      Alert.alert(
        I18n.t('Alert'),
        this.props.alertMessage,
        [ {text: 'OK'} ],
        { cancelable: false }
      )
     }
     PUSH_MANAGER()
  }

  componentDidMount () {
    AsyncStorage.getItem("JWT").then((response)=>{
      this.setState({JWT:response},()=>{
        AsyncStorage.getItem("uName").then((response)=>{
          this.setState({
            uName:encodeURIComponent(response.split("@")[0])+"@"+response.split("@")[1]
          },()=>{
            AsyncStorage.getItem("languageFormat").then((response)=>{
              I18n.locale = response
              this.setState({language:response},()=>{
                this.getSingleStoreData()
              });
            })
          })
        })
      })
    })
  }

  /*Calling an API to get the daypart and day data to manage it for alerts*/
  getSingleStoreData = () => {
    this.setState({isAnimating:true})
    getSpecificStoreData(this.state.uName, this.props.rowData.StoreUID, this.state.JWT)
    .then((response) => {
      if((response.status==CODE_200) && response.body.length!==0) {
        // console.log(response.body)
        singleStore = JSON.parse(response.body)
        this.setState({singleStore})
        this.setState({isAnimating:false})
      }
      else {
        this.setState({isAnimating:false},()=>{
          Alert.alert(
            I18n.t('Alert'),
            NOT_VALID_MSG(),
            [
              {text:  I18n.t('OK')}
            ],
            { cancelable: false }
          )
        })
      }
    })
    .catch((error)=>{
      console.log('error', error)
      this.setState({isAnimating:false},()=>{
        if(error.status==CODE_401) {
          AsyncStorage.getItem("password").then((response)=>{
            this.setState({password:decrypt('key123', response)},()=>{
              AsyncStorage.getItem("uName").then((response)=>{
                this.setState({username:response},()=>{
                  AsyncStorage.multiRemove(['JWT']).then((response)=>{
                    Actions.login({type: "reset",language:this.state.language, userName :this.state.username,password:this.state.password})
                  })
                })
              })
            })
          })
        }
        else if(error.status==CODE_498) {
          AsyncStorage.removeItem('JWT').then((response)=>{
            this.setState({isAnimating:true,JWT:""},()=>{
              AsyncStorage.getItem("password").then((response)=>{
                this.setState({password:decrypt('key123', response)},()=>{
                  AsyncStorage.getItem("uName").then((response)=>{
                    this.setState({username:response},()=>{
                      /*Login API */
                      loginService(this.state.username,this.state.password)
                      .then((response)=> {
                        if(response.status==CODE_200) {
                          this.setState({isAnimating:false},()=>{
                            AsyncStorage.setItem("JWT", response.body).then((resp)=>{
                              this.setState({JWT:response.body},()=>{
                                this.getSingleStoreData()
                              })
                            })
                          })
                        }
                        else {
                          this.setState({isAnimating:false},()=>{
                            Alert.alert(CATCH_ERROR_MSG)
                          })
                        }
                      })
                        /*Login API */
                    })
                  })
                })
              })
            })
          })
        }
        else if(error.status == CODE_500) {
          Alert.alert(
            I18n.t('Alert'),
            OBJ_REF_ERROR(),
            [
              {text:  I18n.t('OK')}
            ],
            { cancelable: false }
          )
        }
        else if(error.status==undefined) {
          this.setState({isAnimating:false},() => {
            Alert.alert(
              I18n.t('Alert'),
              CATCH_ERROR_MSG(),
              [
                {text:  I18n.t('OK')}
              ],
              { cancelable: false }
            )
          })
        }
        else {
          this.setState({isAnimating:false},() => {
            Alert.alert(
              I18n.t('Alert'),
              CATCH_ERROR_MSG(),
              [
                {text:  I18n.t('OK')}
              ],
              { cancelable: false }
            )
          })
        }
      })
    })
  }


  refreshData = () =>{
    AsyncStorage.getItem("JWT").then((response)=>{
      this.setState({JWT:response},()=>{
        AsyncStorage.getItem("uName").then((response)=>{
          this.setState({
            uName:encodeURIComponent(response.split("@")[0])+"@"+response.split("@")[1]
          },()=>{
            AsyncStorage.getItem("languageFormat").then((response)=>{
              I18n.locale = response
              this.setState({language:response},()=>{
                this.getSingleStoreData()
              });
            })
          })
        })
      })
    })
  }

  /*Navigation to leaderboard*/
  navigateLeaderBoard =() =>{
    Actions.leaderBoard({currTab: this.state.currTab})
  }

  /*It renders the UI*/
  render() {
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
      <StatusBar  barStyle={Platform.OS=="ios" ? 'dark-content' : 'light-content'}  hidden={false}/>
        <View style={[CommonStyles.storeHeader,CommonStyles.blueHeaderColor]}>
          <TouchableOpacity style={Platform.OS=="ios" ?[IosStyles.padding11,CommonStyles.flex4By10]:[CommonStyles.padding20,CommonStyles.flex4By10]}
                            onPress={this.navigateLeaderBoard}>
            <Icon name="ios-arrow-back-outline"  backgroundColor="#3b5998"
                      style={[CommonStyles.font30,CommonStyles.textWhite,CommonStyles.textLeft]} />
          </TouchableOpacity>
          <View style={Platform.OS=="ios" ?[IosStyles.padding11,CommonStyles.flex11,CommonStyles.pL0]:[CommonStyles.padding20,CommonStyles.flex11,CommonStyles.pL0]}>
            <Text allowFontScaling={false}  style={[CommonStyles.textCenter,CommonStyles.font20,
                          CommonStyles.textWhite,CommonStyles.fontBold]}>
              {this.props.rowData.StoreName.toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={[CommonStyles.storeTabStyle,CommonStyles.blueHeaderColor]}>
          <TouchableHighlight underlayColor="rgba(0,0,0,0)" style={{flex:1,marginTop:11}}
          onPress={()=>{this.setState({currTab:"hour"})}}>
          {
            this.state.currTab ==="hour" ?
              <Text allowFontScaling={false}  ellipsizeMode={'tail'} numberOfLines={1} style={selectedTabStyle}>{I18n.t('HOUR')}</Text>
            :
              <Text allowFontScaling={false}  ellipsizeMode={'tail'} numberOfLines={1} style={defaultTabStyle}>{I18n.t('HOUR')}</Text>
          }
          </TouchableHighlight>
          <TouchableHighlight underlayColor="rgba(0,0,0,0)" style={{flex:1,marginTop:11}}
           onPress={()=>{this.setState({currTab:"daypart"})}}>
          {
            this.state.currTab ==="daypart" ?
            <Text allowFontScaling={false}  ellipsizeMode={'tail'} numberOfLines={1} style={selectedTabStyle}>{I18n.t('DAYPART')}</Text>
          :
            <Text allowFontScaling={false}  ellipsizeMode={'tail'} numberOfLines={1} style={defaultTabStyle}>{I18n.t('DAYPART')}</Text>
          }
          </TouchableHighlight>
          <TouchableHighlight underlayColor="rgba(0,0,0,0)" style={{flex:1,marginTop:11}}
          onPress={()=>{this.setState({currTab:"day"})}}>
          {
            this.state.currTab ==="day" ?
            <Text allowFontScaling={false}  ellipsizeMode={'tail'} numberOfLines={1} style={selectedTabStyle}>{I18n.t('DAY')}</Text>
          :
            <Text allowFontScaling={false}  ellipsizeMode={'tail'} numberOfLines={1} style={defaultTabStyle}>{I18n.t('DAY')}</Text>
          }
          </TouchableHighlight>
        </View>
        <View style={[CommonStyles.flexTen]}>
        {
          this.state.currTab === "hour"
          ?
            <HourStoreBoard storeUID={new Array(this.props.rowData.StoreUID)}
                           rowData={this.props.rowData}
                           refreshData = {this.refreshData}
                           singleStore={this.state.singleStore} />
          :
          this.state.currTab === "day"
          ?
            <DayStoreBoard storeUID={new Array(this.props.rowData.StoreUID)}
                           rowData={this.props.rowData}
                           refreshData = {this.refreshData}
                           singleStore={this.state.singleStore} />
          :
            <DayPartStoreBoard storeUID={new Array(this.props.rowData.StoreUID)}
                               rowData={this.props.rowData}
                               refreshData = {this.refreshData}
                               singleStore={this.state.singleStore} />
        }
        </View>
    </View>

  )}
}
