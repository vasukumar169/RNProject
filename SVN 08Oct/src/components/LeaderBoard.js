import React from 'react';
import {TouchableHighlight, AsyncStorage, Platform, BackHandler, Dimensions, ToastAndroid, TouchableOpacity, StatusBar, Image, Keyboard, Text, View, Alert, TextInput} from 'react-native';
import CommonStyles from './../stylesheets/CommonStyles'
import IosStyles from './../stylesheets/IosStyles.ios'
import {Actions} from "react-native-router-flux";

import { encrypt, decrypt } from 'react-native-simple-encryption';

/*DRAWER ICON HAMBURGER MENU*/
import DrawerLayout from 'react-native-drawer-layout-polyfill'
/*TAB 2*/
import DayPartLeaderBoard from './DayPartLeaderBoard'
/*TAB 1*/
import DayLeaderBoard from './DayLeaderBoard'
/*TAB 3*/
import HourLeaderBoard from './HourLeaderBoard'
import Icon from 'react-native-vector-icons/Ionicons';
/*Three Dot Menu*/
import { MenuContext } from 'react-native-popup-menu';
/*DIFFERENT LABELS AS CONSTANTS IN HAMBURGER MENU*/
import {ABOUT_LABEL, FEEDBACK_LABEL, SETTINGS_LABEL, USER_GUIDE, LOGOUT_LABEL} from "./../utilities/HamburgerMenuLabels"

import I18n from './../utilities/i18n'
import {Loader} from './ProgressLoader'
import DeviceInfo from 'react-native-device-info'
import {registerPushNotificationIOS} from "./../services/webServices"
import {registerPushNotificationAndroid} from "./../services/webServices"
import {PUSH_MANAGER} from "./PushManager"

const pushStatus = 0
const appVersion = DeviceInfo.getVersion()
const tagNameAndroid = DeviceInfo.getUniqueID()

/*Styling the tab View when not Selected*/
const defaultTabStyle =[CommonStyles.textCenter,CommonStyles.font18,CommonStyles.tabTextColor]
/*Styling the tab View when Selected*/
const selectedTabStyle =[CommonStyles.textCenter,CommonStyles.fontBold,CommonStyles.font18,CommonStyles.textWhite,CommonStyles.paddingB6]

export default class LeaderBoard extends React.Component {
  constructor(props) {
    super(props)
    this.state ={
      showSearch :false,
      currTab :this.props.currTab ? this.props.currTab : "daypart",
      JWT:"",
      userId:this.props.userName,
      searchText:"",
      column1Select:"StoreName",
      isAnimating:true,
      language:props.language
    }
  }
  componentWillMount () {
    Keyboard.dismiss();
    PUSH_MANAGER()
  }
  componentDidMount () {

    /*
    Accessing the local storage to fetch
    JWT, username, languageFormat, tagNameIOS, timeformat
    for various methods and Rest APIs
    Also setting column name that could be resused accordingly from local storage
    */

    AsyncStorage.getItem("JWT").then((response)=>{
      this.setState({JWT:response},()=>{
        AsyncStorage.getItem("uName").then((response)=>{
          this.setState({userId:response},()=>{
            AsyncStorage.getItem("languageFormat").then((response)=>{
              I18n.locale = response
              this.setState({language:response, isAnimating : false},()=>{
                AsyncStorage.getItem("TF").then((response)=>{
                  this.setState({timeFormat : response},()=>{
                    AsyncStorage.getItem("tagNameIOS").then((response)=>{
                      this.setState({tagNameIOS : response},()=>{
                        AsyncStorage.getItem("col1").then((response)=>{
                          if(response!=null) {
                            this.setState({column1Select : response},()=>{
                              BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
                            })
                          }
                          else {
                            AsyncStorage.setItem("col1", "StoreName").then((response)=>{
                              this.setState({column1Select : "StoreName"},()=>{
                                BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
                              })
                            })
                          }
                        })
                      })
                    })
                  })
                });
              })
            })
          })
        })
      })
    }).catch((error)=>{
      this.setState({isAnimating : false})
		})
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.currTab) {
      this.setState({currTab:nextProps.currTab})
    }
  }

  /*Remove Back Functionality on Successful Login*/
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  handleBackButton() {
    return true;
  }

  /*Open HAMBURGER MENU*/
  openDrawer = () => {
    this.refs.DRAWER.openDrawer()
    this.setState({showSearch:false})
  }
  /*Manage Logout with not removing the user preferences*/
  handleLogout =() =>{
      AsyncStorage.getItem("password").then((response)=>{
        this.setState({password:decrypt('key123', response)},()=>{
          AsyncStorage.getItem("uName").then((response)=>{
            this.setState({username:response},()=>{
              AsyncStorage.multiRemove(['JWT','col1']).then((response)=>{
                this.setState({isAnimating:true})
                if(Platform.OS=="ios") {
                    registerPushNotificationIOS(this.state.userId, this.state.tagNameIOS, appVersion, pushStatus).then((response)=>{
                      if(response.status===200) {
                        this.setState({isAnimating:false},()=>{
                          Actions.login({type: "reset",language:this.state.language, timeFormat:this.state.timeFormat, userName :this.state.username,password:this.state.password})
                        })
                      }
                    }).catch((error) => {
                      this.setState({isAnimating:false},()=>{
                        Actions.login({type: "reset",language:this.state.language, timeFormat:this.state.timeFormat, userName :this.state.username,password:this.state.password})
                      })
                    })
                  }
                else {
                    registerPushNotificationAndroid(this.state.userId, tagNameAndroid, appVersion, pushStatus).then((response)=>{
                      if(response.status==200) {
                        this.setState({isAnimating:false},()=>{
                          Actions.login({type: "reset",language:this.state.language, timeFormat:this.state.timeFormat, userName :this.state.username,password:this.state.password})
                        })
                      }
                    }).catch((error) => {
                      this.setState({isAnimating:false},()=>{
                        Actions.login({type: "reset",language:this.state.language, timeFormat:this.state.timeFormat, userName :this.state.username,password:this.state.password})
                      })
                    })
                  }
              })
            })
          })
        })
      })

  }

  /*set the value of Search input bar*/
  onSearchTextChange =(text) =>{
      this.setState({searchText:text})
  }

  /*set the value of Search input bar flag to show or hide the input field accordingly*/
  setShowSearchState =() =>{
      this.setState({showSearch:false})
  }

  /*set the value of column Name*/
  setColumn = (columName) => {
    this.setState({column1Select:columName})
  }

/**********************************************************************************/
/*Maintain the columName across tabs*/

  selectHour = () =>{
    AsyncStorage.getItem('col1').then((response)=>{
      this.setState({currTab:"hour", showSearch:false, column1Select:response})
    })
  }

  selectDay = () =>{
    AsyncStorage.getItem('col1').then((response)=>{
      this.setState({currTab:"day", showSearch:false, column1Select:response})
    })
  }

  selectDaypart = () =>{
    AsyncStorage.getItem('col1').then((response)=>{
      this.setState({currTab:"daypart",showSearch:false, column1Select:response})
    })
  }
/**********************************************************************************/
  render() {
    var navigationView = (
    <View style={Platform.OS=="ios" ? [IosStyles.hamburgerMenuHeight,IosStyles.mTP35,CommonStyles.bgWhite] : [CommonStyles.bgWhite]} >

      <View style={[CommonStyles.blueHeaderColor,CommonStyles.height70,CommonStyles.rowFlexDir]}>
        <TouchableOpacity style={[CommonStyles.flexOne,CommonStyles.height70]}
          onPress={()=>{this.refs.DRAWER.closeDrawer()}}>
          <Icon name="ios-arrow-back-outline"
                  style={
                    Platform.OS=="ios"
                    ? [IosStyles.font30,IosStyles.mTP20,CommonStyles.textWhite,CommonStyles.textCenter]
                    : [CommonStyles.font30,CommonStyles.lineHeight50,CommonStyles.textWhite,CommonStyles.textCenter]
                  } />
        </TouchableOpacity>
        <View style={[CommonStyles.flexTen,CommonStyles.height70]}>
          <Text allowFontScaling ={false} style={
            Platform.OS=="ios"
            ?
            [CommonStyles.fontBold,IosStyles.mTP20,CommonStyles.textWhite,CommonStyles.font22,CommonStyles.textCenter]
            :
            [CommonStyles.fontBold,CommonStyles.lineHeight50,CommonStyles.textWhite,CommonStyles.font22,CommonStyles.textCenter]}>
                {this.state.userId}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={[CommonStyles.drawerStyle, CommonStyles.rowFlexDir,
        CommonStyles.borderBottom1,CommonStyles.borderGreySeparator]}
        onPress={()=>{Actions.about({language:this.state.language})}}>
        <View style={[CommonStyles.flex12]}>
          <Text allowFontScaling ={false} ellipsizeMode={'tail'} numberOfLines={1}
                style={[CommonStyles.font18,CommonStyles.flatListRenderRowTextColor]}>
                {I18n.t(ABOUT_LABEL)}
          </Text>
        </View>
        <View style={[CommonStyles.flex5By10]}>
          <Icon name="ios-arrow-forward-outline"
                    style={
                      Platform.OS=="ios"
                      ? [IosStyles.font22,IosStyles.bgWhite,CommonStyles.flatListRenderRowTextColor]
                      : [CommonStyles.font25,CommonStyles.flatListRenderRowTextColor]
                    } />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={[CommonStyles.drawerStyle, CommonStyles.rowFlexDir,
        CommonStyles.borderBottom1,CommonStyles.borderGreySeparator]}
        onPress={()=>{Actions.userguide({language:this.state.language})}}>
        <View style={[CommonStyles.flex12]}>
          <Text allowFontScaling ={false} ellipsizeMode={'tail'} numberOfLines={1}
                style={[CommonStyles.font18,CommonStyles.flatListRenderRowTextColor]}>
              {I18n.t(USER_GUIDE)}
          </Text>
        </View>
        <View style={[CommonStyles.flex5By10]}>
          <Icon name="ios-arrow-forward-outline"
                    style={
                      Platform.OS=="ios"
                      ? [IosStyles.font22,IosStyles.bgWhite,CommonStyles.flatListRenderRowTextColor]
                      : [CommonStyles.font25,CommonStyles.flatListRenderRowTextColor]
                    } />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={[CommonStyles.drawerStyle, CommonStyles.rowFlexDir,
        CommonStyles.borderBottom1,CommonStyles.borderGreySeparator]}
        onPress={()=>{Actions.feedback({language:this.state.language})}}>
        <View style={[CommonStyles.flex12]}>
          <Text allowFontScaling ={false} ellipsizeMode={'tail'} numberOfLines={1}
                style={[CommonStyles.font18,CommonStyles.flatListRenderRowTextColor]}>
                {I18n.t(FEEDBACK_LABEL)}
          </Text>
        </View>
        <View style={[CommonStyles.flex5By10]}>
          <Icon name="ios-arrow-forward-outline"
                    style={
                      Platform.OS=="ios"
                      ? [IosStyles.font22,IosStyles.bgWhite,CommonStyles.flatListRenderRowTextColor]
                      : [CommonStyles.font25,CommonStyles.flatListRenderRowTextColor]
                    } />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={[CommonStyles.drawerStyle, CommonStyles.rowFlexDir,
        CommonStyles.borderBottom1,CommonStyles.borderGreySeparator]}
        onPress={()=>{Actions.setting({language:this.state.language})}}>
        <View style={[CommonStyles.flex12]}>
          <Text allowFontScaling ={false} ellipsizeMode={'tail'} numberOfLines={1}
                style={[CommonStyles.font18,CommonStyles.flatListRenderRowTextColor]}>
              {I18n.t(SETTINGS_LABEL)}
          </Text>
        </View>
        <View style={[CommonStyles.flex5By10]}>
          <Icon name="ios-arrow-forward-outline"
                    style={
                      Platform.OS=="ios"
                      ? [IosStyles.font22,IosStyles.bgWhite,CommonStyles.flatListRenderRowTextColor]
                      : [CommonStyles.font25,CommonStyles.flatListRenderRowTextColor]
                    } />
        </View>
      </TouchableOpacity>



      <TouchableOpacity style={[CommonStyles.drawerStyle, CommonStyles.rowFlexDir,
        CommonStyles.borderBottom1,CommonStyles.borderGreySeparator]}
        onPress={this.handleLogout}>
        <View style={[CommonStyles.flex12]}>
          <Text allowFontScaling ={false} ellipsizeMode={'tail'} numberOfLines={1}
                style={[CommonStyles.font18,CommonStyles.flatListRenderRowTextColor]}>
                {I18n.t(LOGOUT_LABEL)}
          </Text>
        </View>
        <View style={[CommonStyles.flex5By10]}>
          <Icon name="ios-arrow-forward-outline"
                    style={
                      Platform.OS=="ios"
                      ? [IosStyles.font22,IosStyles.bgWhite,CommonStyles.flatListRenderRowTextColor]
                      : [CommonStyles.font25,CommonStyles.flatListRenderRowTextColor]
                    } />
        </View>
      </TouchableOpacity>
    </View>
  )
  return (
    <View style={[CommonStyles.bgWhite,CommonStyles.flexOne]}>
    {
      this.state.isAnimating
      ?
      <View style={[{ flex: 1,
                      justifyContent:"center",
                      alignContent:"center",
                      backgroundColor:"white"
                    }]}>
        <Loader isLoading = {this.state.isAnimating} />
      </View>
      :
      <DrawerLayout
        ref={'DRAWER'}
        drawerWidth={Dimensions.get('window').width}
        drawerPosition={DrawerLayout.positions.Left}
        renderNavigationView={() => navigationView}>
        <View style={Platform.OS=="ios" ? [CommonStyles.flexOne,IosStyles.mTP35] : [CommonStyles.flexOne]} >
          <StatusBar  barStyle={Platform.OS=="ios" ? 'dark-content' : 'light-content'}  hidden={false}/>
          <View style={[CommonStyles.drawerHeaderSearch]}>
            {
              !this.state.showSearch
              ?
                <View style={[CommonStyles.flexOne,CommonStyles.rowFlexDir]}>
                  <TouchableOpacity onPress={this.openDrawer}
                    activeOpacity={0.9} style={[CommonStyles.flexOne,CommonStyles.alignCenter,CommonStyles.justifyCenterContent]}>
                    <Icon name="ios-menu"
                          backgroundColor="#3b5998"
                          style={[CommonStyles.font50,
                                  CommonStyles.textLeft,
                                  CommonStyles.textWhite]} />
                  </TouchableOpacity>
                  <View style={[CommonStyles.flex5By10]}/>
                  <View style={[CommonStyles.flexEight,CommonStyles.alignCenter,CommonStyles.justifyCenterContent]}>
                    <Text allowFontScaling ={false} ellipsizeMode={'tail'} numberOfLines={1}
                          style={[CommonStyles.font25,CommonStyles.fontBold,
                            CommonStyles.textWhite]}>{I18n.t('Store').toUpperCase()} {I18n.t('Ranking').toUpperCase()}</Text>
                  </View>
                  <View style={[CommonStyles.flex5By10]}/>
                  <TouchableOpacity style={[CommonStyles.flexOne,CommonStyles.alignCenter,CommonStyles.justifyCenterContent]}
                                    onPress={()=>{this.setState({showSearch:true,searchText:""},()=>{
                                      this.refs.Search.focus()
                                    })}}>
                    <Icon name="ios-search"
                          backgroundColor="#3b5998"
                          style={[CommonStyles.font40,
                                  CommonStyles.textWhite,
                                  CommonStyles.textRight]} />
                  </TouchableOpacity>
                </View>
              :
              <View style={{width:"100%",marginTop:8}}>
                <TextInput  placeholder= {
                  this.state.column1Select ==="StoreName" ?
                    I18n.t('Search stores by name')
                  : I18n.t('Search stores by number')
                  }
                  placeholderTextColor={"#c1c1c1"}
                  ref="Search"
                  onChangeText={this.onSearchTextChange}
                  underlineColorAndroid='transparent'
                  style={Platform.OS=="ios"
                      ? [{width:"100%",paddingLeft:40,fontSize:20,backgroundColor:"white"},IosStyles.heightIos40]
                      : [{width:"100%",paddingLeft:40,fontSize:20,backgroundColor:"white"}]} />
                <Icon name="ios-search-outline"
                          backgroundColor="#3b5998"
                          style={Platform.OS=="ios"
                            ? [IosStyles.font35,IosStyles.bgWhite,{width:35},CommonStyles.customSearchIconStyle]
                            : [CommonStyles.font40,{width:35},CommonStyles.customSearchIconStyle]
                          } />

                <Icon name="ios-arrow-back-outline"
                          onPress={()=>{this.setState({showSearch:false,searchText:""})}}
                          backgroundColor="#3b5998"
                          style={
                            Platform.OS=="ios"
                            ? [IosStyles.font35,IosStyles.bgWhite,{width:30},CommonStyles.backIconColor,CommonStyles.customCloseIconStyle]
                            : [CommonStyles.font40,{width:30},CommonStyles.backIconColor,CommonStyles.customCloseIconStyle]
                          } />

              </View>
            }
          </View>
          <View style={[CommonStyles.blueHeaderColor,CommonStyles.rowFlexDir,CommonStyles.flex3By4]}>
            <TouchableHighlight underlayColor="rgba(0,0,0,0)" style={{flex:1,marginTop:11}}
                                onPress={()=>{this.selectHour()}}>
            {
              this.state.currTab ==="hour" ?
                <Text allowFontScaling ={false} ellipsizeMode={'tail'} numberOfLines={1} style={selectedTabStyle}>
                  {I18n.t("HOUR")}
                </Text>
              :
                <Text allowFontScaling ={false} ellipsizeMode={'tail'} numberOfLines={1} style={defaultTabStyle}>
                  {I18n.t("HOUR")}
                </Text>
            }
            </TouchableHighlight>
            <TouchableHighlight  underlayColor="rgba(0,0,0,0)" style={{flex:1,marginTop:11}}
                                  onPress={()=>{this.selectDaypart()}}>
            {
              this.state.currTab ==="daypart" ?
              <Text allowFontScaling ={false} ellipsizeMode={'tail'} numberOfLines={1} style={selectedTabStyle}>
                {I18n.t("DAYPART")}
              </Text>
            :
              <Text allowFontScaling ={false} ellipsizeMode={'tail'} numberOfLines={1} style={defaultTabStyle}>
                {I18n.t("DAYPART")}
              </Text>
            }
            </TouchableHighlight>
            <TouchableHighlight  underlayColor="rgba(0,0,0,0)" style={{flex:1,marginTop:11}}
                                onPress={()=>{this.selectDay()}}>
            {
              this.state.currTab ==="day" ?
              <Text allowFontScaling ={false} ellipsizeMode={'tail'} numberOfLines={1} style={selectedTabStyle}>
                {I18n.t("DAY")}
              </Text>
            :
              <Text allowFontScaling ={false} ellipsizeMode={'tail'} numberOfLines={1} style={defaultTabStyle}>
                {I18n.t("DAY")}
              </Text>
            }
            </TouchableHighlight>
          </View>
          <View style={{flex:9}}>
          {
            this.state.currTab === "hour"
            ?
              <MenuContext>
              <HourLeaderBoard setColumn ={this.setColumn} setShowSearchState={this.setShowSearchState} searchText={this.state.searchText}
  						currTab={this.state.currTab}
              language={this.state.language}
              showSearch={this.state.showSearch}/>
              </MenuContext>
            :
            this.state.currTab === "day"
            ?
              <MenuContext>
              <DayLeaderBoard setColumn ={this.setColumn} setShowSearchState={this.setShowSearchState} searchText={this.state.searchText}
  						currTab={this.state.currTab}
              language={this.state.language}
              showSearch={this.state.showSearch}/>
              </MenuContext>
            :
              <MenuContext>
              <DayPartLeaderBoard setColumn ={this.setColumn} setShowSearchState={this.setShowSearchState} searchText={this.state.searchText}
  						currTab={this.state.currTab}
              language={this.state.language}
              showSearch={this.state.showSearch}/>
              </MenuContext>
          }
          </View>
        </View>
      </DrawerLayout>
    }
    </View>
  )}
}
