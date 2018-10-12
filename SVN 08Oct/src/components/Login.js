import React from 'react';
import {
          TouchableOpacity,
          TouchableHighlight,
          BackHandler,
          ActivityIndicator,
          AsyncStorage,
          AppState,
          StatusBar,
          Platform,
          KeyboardAvoidingView,
          ImageBackground,
          Image, Keyboard, Text, View, Alert, TextInput, NativeModules
      } from 'react-native';
import CommonStyles from './../stylesheets/CommonStyles'
import IosStyles from './../stylesheets/IosStyles.ios'

/*Loading Indicator*/
import {Loader} from './ProgressLoader'
/*Navigational Screens*/
import {Actions} from "react-native-router-flux";
/*LOGIN SERVICE REST API*/
import {loginService} from "./../services/webServices"
/*GET STORE TYPE REST API*/
import {getStoreType} from "./../services/webServices"
/*REG PUSH NOTIFICATION IOS REST API*/
import {registerPushNotificationIOS} from "./../services/webServices"
/*REG PUSH NOTIFICATION ANDROID REST API*/
import {registerPushNotificationAndroid} from "./../services/webServices"
/*ICON LIBRARY*/
import Icon from 'react-native-vector-icons/MaterialIcons';
/*Internationalization*/
import I18n from './../utilities/i18n'
/*Device Info*/
import DeviceInfo from 'react-native-device-info'
/*Language List to show languages in dropdown*/
import { languageArray } from "./../utilities/LanguageArray"
/*STATUS CODE*/
import {CODE_200, CODE_498, CODE_500, CODE_401} from "./../utilities/GenericMessages"
/*DYNAMIC MESSAGES*/
import {FORGET_PWD, SERVER_ERROR_MSG, INVALID_CRED, FILL_RELVNT_DETAILS} from "./../utilities/GenericMessages"
/*DYNAMIC IMAGE AND LOGO URLS*/
import {BG_URL,  HME_F_LOGO, HME_S_LOGO} from "./../utilities/HelperLabels"
/*Push Notification Configuration*/
import {PUSH_MANAGER} from "./PushManager"

var PushNotification = require('react-native-push-notification');
/*DrowpDown Library*/
import { Picker } from 'react-native-picker-dropdown'

//Global scope variables of tagName, appVersion, login Status as pushStatus
let tagName;
let pushStatus = 1
let appVersion = DeviceInfo.getVersion()

import { encrypt, decrypt } from 'react-native-simple-encryption';


export default class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userName :this.props.userName ? this.props.userName : "",
      password :this.props.password ? this.props.password : "",
      isUserValid:true,
      isPwdValid : true,
      isAnimating : false,
      language : ""
    }
  }
  componentWillMount () {

    //Managing the default language to be shown accordingly in drop down.

    if (this.props.language == undefined) {
      AsyncStorage.getItem("languageFormat").then((response)=>{
        if(response != null) {
          I18n.locale = response
          let lang = response
          this.setState({language: lang});
        }
        else {
          I18n.locale = DeviceInfo.getDeviceLocale()
          let lang = DeviceInfo.getDeviceLocale()
            if(lang.includes("en")){
              this.setState({language: "en"});
            }
            else {
                this.setState({language: lang});
            }
        }
      })
    }
		else {
      this.setState({language : this.props.language});
		}
  }



  async componentDidMount () {
    Keyboard.dismiss();

    AsyncStorage.getItem("password").then((response)=>{
      this.setState({password:decrypt('key123', response)},()=>{
        AsyncStorage.getItem("uName").then((response)=>{
          this.setState({userName:response})
        })
      })
    })
    //Fetching the device token which is used as tagName for Push Notification for IOS & Android
    this.setState({isAnimating:true})
    if(Platform.OS=="ios") {
      let deviceToken =  await NativeModules.AppDelegate.getThing();
      tagName = deviceToken
      this.setState({isAnimating:false})
    }
    else {
      tagName = DeviceInfo.getUniqueID()
      this.setState({isAnimating:false})
    }
    //Configuring the Push Notification Service by calling Push Manager
    PUSH_MANAGER()
  }

  //Setting the Username
  handleUserName = (text) => {
    this.setState({userName: text.replace(/ +/g, "")})
  }

  //Setting the Password.
  handlePwd = (text) => {
    this.setState({password: text})
  }


  //Pressing the Login Button.
  handleLogin =()=>{
    Keyboard.dismiss();
    if(this.state.userName!=="" && this.state.password!=="")
    {
      // Starting the Loader, Hiding error on wrong userName and password
      this.setState({isAnimating:true, isUserValid: true, isPwdValid: true})

      // Hitting the Login Web Service
      /* Storing the JWT, userName, password, languageFormat, timeFormat,
       Stopping the loader and redirecting to Dashboard after getting status code = 200 */
  		loginService(this.state.userName, this.state.password)
      .then((response)=> {
        if(response.status==CODE_200) {
          getStoreType(this.state.userName, Platform.OS, response.body).then((resp)=>{
            if(resp.status==CODE_200) {
              if(resp.body=="storenumber") {
                  AsyncStorage.setItem("col1", "StoreNumber").then((res)=>{
                    this.setState({column1Select : 'StoreNumber'},()=>{
                      AsyncStorage.setItem("JWT", response.body).then((response)=>{
                          AsyncStorage.setItem("uName", this.state.userName).then((reponse)=>{
                            AsyncStorage.getItem("TF").then((response)=>{
                              if (response != null) {
                                AsyncStorage.setItem("TF", response).then((response)=>{
                                  AsyncStorage.setItem("languageFormat", this.state.language).then((response)=>{
                                    AsyncStorage.setItem("password",encrypt('key123', this.state.password)).then((response)=>{
                                      if(Platform.OS=="ios") {
                                        AsyncStorage.setItem("tagNameIOS",tagName).then((response)=>{
                                          registerPushNotificationIOS(this.state.userName, tagName, appVersion, pushStatus).then((response)=>{
                                            if(response.status==CODE_200) {
                                              this.setState({isAnimating:false})
                                              //Navigational Route for DashBoard named as LeaderBoard Screen
                                              Actions.leaderBoard({userName: this.state.userName, language: this.state.language, tagName:tagName})
                                            }
                                            else {
                                              this.setState({isAnimating:false})
                                              Alert.alert(
                                                I18n.t('Alert'),
                                                I18n.t(SERVER_ERROR_MSG()),
                                                [
                                                  {text:  I18n.t('OK')}
                                                ],
                                                { cancelable: false }
                                              )
                                            }
                                          }).catch((error) => {
                                              this.setState({isAnimating:false})
                                              Alert.alert(
                                                I18n.t('Alert'),
                                                I18n.t(SERVER_ERROR_MSG()),
                                                [
                                                  {text:  I18n.t('OK')}
                                                ],
                                                { cancelable: false }
                                              )
                                          })
                                      })
                                      }
                                      else {
                                        registerPushNotificationAndroid(this.state.userName, tagName, appVersion, pushStatus).then((response)=>{
                                          if(response.status==CODE_200) {
                                            this.setState({isAnimating:false})
                                            Actions.leaderBoard({userName: this.state.userName, language: this.state.language})
                                          }
                                          else {
                                            this.setState({isAnimating:false})
                                            Alert.alert(
                                              I18n.t('Alert'),
                                              I18n.t(SERVER_ERROR_MSG()),
                                              [
                                                {text:  I18n.t('OK')}
                                              ],
                                              { cancelable: false }
                                            )
                                          }

                                        }).catch((error) => {
                                            this.setState({isAnimating:false})
                                            Alert.alert(
                                              I18n.t('Alert'),
                                              I18n.t(SERVER_ERROR_MSG()),
                                              [
                                                {text:  I18n.t('OK')}
                                              ],
                                              { cancelable: false }
                                            )
                                        })
                                      }
                                    })
                                  })
                                })
                              }
                              else {
                                AsyncStorage.setItem("TF", "seconds").then((response)=>{
                                  AsyncStorage.setItem("languageFormat", this.state.language).then((response)=>{
                                    AsyncStorage.setItem("password",encrypt('key123', this.state.password)).then((response)=>{
                                      if(Platform.OS=="ios") {
                                        registerPushNotificationIOS(this.state.userName, tagName, appVersion, pushStatus).then((response)=>{
                                          if(response.status==CODE_200) {
                                            this.setState({isAnimating:false})
                                            Actions.leaderBoard({userName: this.state.userName, language: this.state.language})
                                          }
                                        }).catch((error) => {
                                            this.setState({isAnimating:false})
                                            Alert.alert(
                                              I18n.t('Alert'),
                                              I18n.t(SERVER_ERROR_MSG()),
                                              [
                                                {text:  I18n.t('OK')}
                                              ],
                                              { cancelable: false }
                                            )
                                        })
                                      }
                                      else {
                                        registerPushNotificationAndroid(this.state.userName, tagName, appVersion, pushStatus).then((response)=>{
                                          if(response.status==CODE_200) {
                                            this.setState({isAnimating:false})
                                            Actions.leaderBoard({userName: this.state.userName, language: this.state.language})
                                          }

                                        }).catch((error) => {
                                            this.setState({isAnimating:false})
                                            Alert.alert(
                                              I18n.t('Alert'),
                                              I18n.t(SERVER_ERROR_MSG()),
                                              [
                                                {text:  I18n.t('OK')}
                                              ],
                                              { cancelable: false }
                                            )
                                        })
                                      }
                                    })
                                  })
                                })
                              }
                            }).catch((error)=>{
                                AsyncStorage.setItem("TF", "seconds").then((response)=>{
                                  AsyncStorage.setItem("languageFormat", this.state.language).then((response)=>{
                                    AsyncStorage.setItem("password",this.state.password).then((response)=>{
                                      this.setState({isAnimating:false})
                                      Actions.leaderBoard({userName: this.state.userName, language: this.state.language})
                                    })
                                  })
                                })
                            })
                          })
                        })
                    })
                  })
              }
              else {
                AsyncStorage.setItem("col1", "StoreName").then((res)=>{
                  this.setState({column1Select : 'StoreName'},()=>{
                    AsyncStorage.setItem("JWT", response.body).then((response)=>{
                        AsyncStorage.setItem("uName", this.state.userName).then((reponse)=>{
                          AsyncStorage.getItem("TF").then((response)=>{
                            if (response != null) {
                              AsyncStorage.setItem("TF", response).then((response)=>{
                                AsyncStorage.setItem("languageFormat", this.state.language).then((response)=>{
                                  AsyncStorage.setItem("password",encrypt('key123', this.state.password)).then((response)=>{
                                    if(Platform.OS=="ios") {
                                      AsyncStorage.setItem("tagNameIOS",tagName).then((response)=>{
                                        registerPushNotificationIOS(this.state.userName, tagName, appVersion, pushStatus).then((response)=>{
                                          if(response.status==CODE_200) {
                                            this.setState({isAnimating:false})
                                            //Navigational Route for DashBoard named as LeaderBoard Screen
                                            Actions.leaderBoard({userName: this.state.userName, language: this.state.language, tagName:tagName})
                                          }
                                          else {
                                            this.setState({isAnimating:false})
                                            Alert.alert(
                                              I18n.t('Alert'),
                                              I18n.t(SERVER_ERROR_MSG()),
                                              [
                                                {text:  I18n.t('OK')}
                                              ],
                                              { cancelable: false }
                                            )
                                          }
                                        }).catch((error) => {
                                            this.setState({isAnimating:false})
                                            Alert.alert(
                                              I18n.t('Alert'),
                                              I18n.t(SERVER_ERROR_MSG()),
                                              [
                                                {text:  I18n.t('OK')}
                                              ],
                                              { cancelable: false }
                                            )
                                        })
                                    })
                                    }
                                    else {
                                      registerPushNotificationAndroid(this.state.userName, tagName, appVersion, pushStatus).then((response)=>{
                                        if(response.status==CODE_200) {
                                          this.setState({isAnimating:false})
                                          Actions.leaderBoard({userName: this.state.userName, language: this.state.language})
                                        }
                                        else {
                                          this.setState({isAnimating:false})
                                          Alert.alert(
                                            I18n.t('Alert'),
                                            I18n.t(SERVER_ERROR_MSG()),
                                            [
                                              {text:  I18n.t('OK')}
                                            ],
                                            { cancelable: false }
                                          )
                                        }

                                      }).catch((error) => {
                                          this.setState({isAnimating:false})
                                          Alert.alert(
                                            I18n.t('Alert'),
                                            I18n.t(SERVER_ERROR_MSG()),
                                            [
                                              {text:  I18n.t('OK')}
                                            ],
                                            { cancelable: false }
                                          )
                                      })
                                    }
                                  })
                                })
                              })
                            }
                            else {
                              AsyncStorage.setItem("TF", "seconds").then((response)=>{
                                AsyncStorage.setItem("languageFormat", this.state.language).then((response)=>{
                                  AsyncStorage.setItem("password",encrypt('key123', this.state.password)).then((response)=>{
                                    if(Platform.OS=="ios") {
                                      registerPushNotificationIOS(this.state.userName, tagName, appVersion, pushStatus).then((response)=>{
                                        if(response.status==CODE_200) {
                                          this.setState({isAnimating:false})
                                          Actions.leaderBoard({userName: this.state.userName, language: this.state.language})
                                        }
                                      }).catch((error) => {
                                          this.setState({isAnimating:false})
                                          Alert.alert(
                                            I18n.t('Alert'),
                                            I18n.t(SERVER_ERROR_MSG()),
                                            [
                                              {text:  I18n.t('OK')}
                                            ],
                                            { cancelable: false }
                                          )
                                      })
                                    }
                                    else {
                                      registerPushNotificationAndroid(this.state.userName, tagName, appVersion, pushStatus).then((response)=>{
                                        if(response.status==CODE_200) {
                                          this.setState({isAnimating:false})
                                          Actions.leaderBoard({userName: this.state.userName, language: this.state.language})
                                        }

                                      }).catch((error) => {
                                          this.setState({isAnimating:false})
                                          Alert.alert(
                                            I18n.t('Alert'),
                                            I18n.t(SERVER_ERROR_MSG()),
                                            [
                                              {text:  I18n.t('OK')}
                                            ],
                                            { cancelable: false }
                                          )
                                      })
                                    }
                                  })
                                })
                              })
                            }
                          }).catch((error)=>{
                              AsyncStorage.setItem("TF", "seconds").then((response)=>{
                                AsyncStorage.setItem("languageFormat", this.state.language).then((response)=>{
                                  AsyncStorage.setItem("password",this.state.password).then((response)=>{
                                    this.setState({isAnimating:false})
                                    Actions.leaderBoard({userName: this.state.userName, language: this.state.language})
                                  })
                                })
                              })
                          })
                        })
                      })
                  })
                })
              }
            }
          })
          .catch((err)=>{

          })


        }
        else {
          this.setState({isAnimating:false})
          I18n.locale=this.state.language
          Alert.alert(
            I18n.t('Alert'),
            I18n.t(SERVER_ERROR_MSG()),
            [
              {text:  I18n.t('OK')}
            ],
            { cancelable: false }
          )
        }


      })
      .catch((error)=>{
        if(error.status == CODE_401) {
          this.setState({isUserValid:false,isAnimating:false,isPwdValid:false},()=>{
            I18n.locale = this.state.language
          })
          this.setState({userName: ""})
          this.setState({password: ""})
        }
        else {
          this.setState({isAnimating: false, userName: "", password: ""}, ()=> {
              I18n.locale=this.state.language
              Alert.alert(
                I18n.t('Alert'),
                I18n.t(SERVER_ERROR_MSG()),
                [
                  {text: I18n.t('OK')}
                ],
                { cancelable: false }
              )
          })
        }
      })
    }
    else {
        I18n.locale=this.state.language
        Alert.alert(
          I18n.t('Alert'),
          I18n.t(FILL_RELVNT_DETAILS()),
          [
            {text:  I18n.t('OK')}
          ],
          { cancelable: false }
        )
    }
	}

  selectLanguage =(itemValue) =>{
    I18n.locale=itemValue
    this.setState({language: itemValue},()=>{
      I18n.locale=this.state.language
    })
  }

  render() {
    let pickerItem = []
    languageArray.map((value, index) => {
      for(let x in value) {
        pickerItem.push(
          <Picker.Item
            label={x}
            value={value[x]}
            key={index}
          />
        )
      }
    })
    I18n.locale=this.state.language
    return (
      <ImageBackground  source={BG_URL}
                        style={Platform.OS=="ios" ? [CommonStyles.backImage,IosStyles.mTP35]
                                                  : [CommonStyles.backImage]}>
      <StatusBar barStyle={Platform.OS=="ios" ?'dark-content':'light-content'}  hidden={false}/>

      { Platform.OS=="ios"
        ?
        <View style={{width:"100%",alignItems:"flex-end",borderTopWidth:0.5}}>
          <View style={{width:"35%", height:30}}>
            <Icon name="language"
                  backgroundColor="#3b5998"
                  style={[CommonStyles.font22]} />
            <Picker style={{marginTop:-17, marginLeft:35}}
              selectedValue={this.state.language}
              onValueChange={(itemValue, itemIndex) => {this.selectLanguage(itemValue, itemIndex)}}>
              {pickerItem}
            </Picker>
          </View>
        </View>
        :
        <View style ={[CommonStyles.flexOne,CommonStyles.rowFlexDir]}>
          <View style={[CommonStyles.flexFive,CommonStyles.rowFlexDir]}>
              <View style={[CommonStyles.flexSeven]}>
              </View>
              <View style={[CommonStyles.flexOne,{backgroundColor:"#e2e2e2"}]}>
              <Icon name="language"
                    backgroundColor="#3b5998"
                    style={[CommonStyles.font30,CommonStyles.textRight,]} />
              </View>
            </View>
            <View style={[CommonStyles.flexTwo,{backgroundColor:"#e2e2e2"}]}>
              <Picker style={{marginTop:-9,marginRight:-20}}
                selectedValue={this.state.language}
                onValueChange={(itemValue, itemIndex) => {this.selectLanguage(itemValue, itemIndex)}}>
                {pickerItem}
              </Picker>
            </View>
        </View>
      }
      {
        this.state.isAnimating
        ?
        <View style={{flex: 20,justifyContent: 'center'}}>
          <Loader isLoading = {this.state.isAnimating} />
        </View>
        :
        <View style={[{flex:20}]}>


            <View style= {[,CommonStyles.flexFour,CommonStyles.alignCenter]} >
              <View style= {[CommonStyles.flexFour]}>
                {
                  /*Extra Gap managed*/
                }
              </View>
              <View style= {[CommonStyles.flexTwo,CommonStyles.alignCenter]} >
                <Image source={HME_F_LOGO} resizeMode="contain" style={[CommonStyles.flexThree]}/>
              </View>
              <View style= {[CommonStyles.flex4By10]}>
                {
                  /*Extra Gap managed*/
                }
              </View>
              <View style= {[CommonStyles.flexTwo]}>
                <Image source={HME_S_LOGO} resizeMode="contain" style={[CommonStyles.flex4By10]}/>
              </View>
            </View>
            <KeyboardAvoidingView behavior={'padding'} style= {[CommonStyles.flexFive,
              CommonStyles.alignCenter,CommonStyles.mTP20]}  >
              <View style={[CommonStyles.containerInput]}>
                <TextInput allowFontScaling= {false}
                        placeholder={I18n.t('Username')}
                        placeholderTextColor="#ffffff"
                        underlineColorAndroid='transparent'
                        value={this.state.userName ? this.state.userName.toLowerCase() : ""}
                        onChangeText={this.handleUserName}
                        style={[
                            CommonStyles.height40,
                            CommonStyles.pL10,
                            CommonStyles.font16,
                            CommonStyles.textWhite
                          ]} />
              </View>
            { !this.state.isUserValid ?
              <View style={[CommonStyles.mTP2,
                            CommonStyles.customErrorTextView]}>
                <Text allowFontScaling ={false} style={[CommonStyles.fontBold,
                              CommonStyles.errorColor,
                              CommonStyles.font16,
                              CommonStyles.mL10]}>
                  {I18n.t(INVALID_CRED())}
                </Text>
              </View>
              : null
            }
              <View style={[CommonStyles.containerInput,CommonStyles.mTP10]}>
                <TextInput
                        allowFontScaling= {false}
                        placeholder={I18n.t('Password')}
                        placeholderTextColor="#ffffff"
                        secureTextEntry={true}
                        value={this.state.password}
                        underlineColorAndroid='transparent'
                        onChangeText={this.handlePwd}
                        style={[CommonStyles.pL10,
                                CommonStyles.height40,
                                CommonStyles.font16,
                                CommonStyles.textWhite]} />
              </View>
            { !this.state.isPwdValid ?
              <TouchableOpacity
                              onPress={()=>{Actions.forgotpassword({language:this.state.language})}}
                              style={[CommonStyles.mTP2,
                                      CommonStyles.customErrorTextView]}>
                <Text allowFontScaling ={false} style={[CommonStyles.fontBold,
                              CommonStyles.errorColor,
                              CommonStyles.font16,CommonStyles.mL10]}>
                  {I18n.t(FORGET_PWD())}
                </Text>
              </TouchableOpacity>
              : null
            }
              <TouchableOpacity
                      style={[CommonStyles.mTP10,CommonStyles.loginButton]} onPress={this.handleLogin}>
                <Text allowFontScaling ={false} style={[
                              CommonStyles.fontBold,CommonStyles.font16,
                              CommonStyles.loginTextColor,CommonStyles.boxWidth,
                              CommonStyles.textCenter]}>{I18n.t('LOGIN')}</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>

        </View>
      }
    </ImageBackground>
	);
  }
}
