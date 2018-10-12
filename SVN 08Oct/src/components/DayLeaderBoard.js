import React from 'react';
import {TouchableOpacity,StatusBar, Platform, TouchableHighlight,RefreshControl, AsyncStorage, Dimensions,Image,FlatList, Keyboard, Text, View, Alert, TextInput} from 'react-native';
import CommonStyles from './../stylesheets/CommonStyles'
import IosStyles from './../stylesheets/IosStyles.ios'
import {customPopupStyle,customPopupOptionLabelStyle} from './../stylesheets/PopupMenuStyles'
import {Actions} from "react-native-router-flux";
import Icon from 'react-native-vector-icons/Ionicons';
import {getDayStores, pushNotification} from "./../services/webServices"
import {Loader} from './ProgressLoader'
import {CATCH_ERROR_MSG, NOT_VALID_MSG, NO_DATA} from "./../utilities/GenericMessages"
import {OK} from "./../utilities/HelperLabels"
import I18n from './../utilities/i18n'
// import {CheckBox, StyleProvider } from 'native-base';
import { CheckBox } from 'react-native-elements'
import getTheme from './../../native-base-theme/components';
import material from './../../native-base-theme/variables/material';
import isEmpty from 'lodash/isEmpty'
import {loginService} from "./../services/webServices"
import {setStoreType} from "./../services/webServices"
import {STORE_NAME, STORE_NUMBER} from "./../utilities/HelperLabels"
import {CODE_200, CODE_498, CODE_500, CODE_401} from "./../utilities/GenericMessages"
const defaultTabStyle =[CommonStyles.textCenter,CommonStyles.font25,CommonStyles.tabTextColor]
const selectedTabStyle =[CommonStyles.textCenter,CommonStyles.font25,CommonStyles.textWhite,CommonStyles.paddingB10,CommonStyles.borderBottom3,CommonStyles.TabSelectBorderColor]
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
/*global scope variables to maintain lists on different functionalities*/
let intialStores =[]
let intialSearchStores =[]
let responseStoresName =[]
let responseStoresNo =[]
let dataRowArray = []
import { encrypt, decrypt } from 'react-native-simple-encryption';

export default class DayLeaderBoard extends React.Component {
  constructor(props) {
    super(props)
    this.state ={
      stores :[],
      uName:"",
      JWT:"",
      isAnimating:true,
			isAscending:0,
			isAscendingCol2:1,
			defaultColumn:2,
      column1Select:"StoreName",
      column2Select:"Total",
      refreshing:false,
      isChecked:[],
      isCheckedAll:false,
      recorder:[],
      language:props.language
    }
  }
  componentWillMount () {
	   Keyboard.dismiss();
  }

  componentDidMount () {
    /*
      Fetch JWT to make different rest API calls for the tab
      Get column names to maintain in local storage and user preferences
    */
    AsyncStorage.getItem("JWT").then((response)=>{
      this.setState({JWT:response},()=>{
        AsyncStorage.getItem("uName").then((response)=>{
          this.setState({
            userId : response,
            username :response,
            uName:encodeURIComponent(response.split("@")[0])+"@"+response.split("@")[1]
          },()=>{
            AsyncStorage.getItem("TF").then((response)=>{
              this.setState({timeFormat : response},()=>{
                AsyncStorage.getItem("col1").then((response)=>{
                  if(response!=null) {
                    this.setState({column1Select : response},()=>{
                      AsyncStorage.getItem("col2").then((response)=>{
                        if(response!=null) {
                          this.setState({column2Select : response},()=>{
                            this.getDayStoreData()
                          })
                        }
                        else {
                          AsyncStorage.setItem("col2", "Total").then((response)=>{
                            this.setState({column2Select : 'Total'},()=>{
                                this.getDayStoreData()
                            })
                          })
                        }
                      })
                    })
                  }
                  else {
                    AsyncStorage.setItem("col1", "StoreName").then((response)=>{
                      this.setState({column1Select : 'StoreName'},()=>{
                          this.getDayStoreData()
                      })
                    })
                  }
                })
              })
            })
          })
        })
      })
    })
  }

  componentWillReceiveProps (nextProps) {
    /*
      To manage search results by getting the search text value as props from parent to child
    */
    if(nextProps.showSearch) {
      if(this.state.column1Select ==="StoreName") {
        this.filterSearch(nextProps.searchText)
      }
      else if(this.state.column1Select ==="StoreNumber") {
          this.filterSearchStoreNumber(nextProps.searchText)
      }
    }
    else {
      if(intialStores.length>0) {
        let isChecked  = []
        let  recorder  = []
        let StoreID;
        this.setState({
          isChecked
        })

        for(let i =0; i<intialStores.length; i++) {
          StoreID = intialStores[i]['StoreUID']
          isChecked.push({[StoreID]:false})
        }

        this.setState({
          stores: intialStores,
          isChecked:isChecked,
          isCheckedAll:false,recorder
        })
      }
    }
  }

  /*Get Searched Stores by Store Name*/
  filterSearch(text) {
    if(text!="") {
      const newData = intialSearchStores.filter(function (item) {
        const itemData = item.StoreName.toUpperCase()
        const textData = text.toUpperCase()
        return itemData.indexOf(textData) > -1
      })

      let isChecked  = []
      let  recorder  = []
      let StoreID;
      this.setState({
        isChecked
      })

      for(let i =0; i<newData.length; i++) {
        StoreID = newData[i]['StoreUID']
        isChecked.push({[StoreID]:false})
      }

      this.setState({
        stores: newData,
        isChecked:isChecked,
        isCheckedAll:false
      })

    }
    else {

      let isChecked  = []
      let  recorder  = []
      let StoreID;
      this.setState({
        isChecked
      })

      for(let i =0; i<intialStores.length; i++) {
        StoreID = intialStores[i]['StoreUID']
        isChecked.push({[StoreID]:false})
      }

      this.setState({
        stores: intialStores,
        isChecked:isChecked,
        isCheckedAll:false,recorder
      })
    }
  }

  /*Get Searched Stores by Store Number*/
  filterSearchStoreNumber(text) {
    if(text!="") {
      const newData = intialSearchStores.filter(function (item) {
        const itemData = item.StoreNumber.toUpperCase()
        const textData = text.toUpperCase()
        return itemData.indexOf(textData) > -1
      })

      let isChecked  = []
      let  recorder  = []
      let StoreID;
      this.setState({
        isChecked, recorder
      })

      for(let i =0; i<intialStores.length; i++) {
        StoreID = intialStores[i]['StoreUID']
        isChecked.push({[StoreID]:false})
      }

      this.setState({
        stores: newData,
        isChecked:isChecked,
        isCheckedAll:false
      })
    }
    else {

      let isChecked  = []
      let  recorder  = []
      let StoreID;
      this.setState({
        isChecked, recorder
      })

      for(let i =0; i<intialStores.length; i++) {
        StoreID = intialStores[i]['StoreUID']
        isChecked.push({[StoreID]:false})
      }

      this.setState({
        stores: intialStores,
        isChecked:isChecked,
        isCheckedAll:false
      })
    }
  }

  /*WebService to get Day store data*/

  getDayStoreData = ()=> {
    this.setState({isAnimating:true})
    this.setState({refreshing: true},()=>{this.props.setShowSearchState()})
    getDayStores(this.state.uName, this.state.JWT)
    .then((response) => {
      if((response.status==CODE_200)  && response.body.length!==0) {
        this.setState({isAnimating:false})
        this.setState({refreshing: false});

        /*Object.assign creates new object to segregate for functionalities*/

        let responseData = Object.assign([],response.body)
        intialStores = Object.assign([],response.body)
        intialSearchStores = Object.assign([],response.body)
        responseStoresNo = Object.assign([],response.body)
        responseStoresName = Object.assign([],response.body)

        if(this.state.column2Select =="Total") {
          intialStores.sort( function ( a, b ) { return b.Day.Total - a.Day.Total })
          responseData.sort( function ( a, b ) { return b.Day.Total - a.Day.Total })
        }
        else {
          intialStores.sort( function ( a, b ) { return b.Day.Car - a.Day.Car })
          responseData.sort( function ( a, b ) { return b.Day.Car - a.Day.Car })
        }

        let isChecked  = this.state.isChecked
        let StoreID;
        for(let i =0; i<responseData.length; i++) {
          StoreID = responseData[i]['StoreUID']
          isChecked.push({[StoreID]:false})
        }

        this.setState({stores:responseData, isChecked},()=>{
          this.setState({isAnimating:false, refreshing: false});
        })

      }
      else {
        this.setState({isAnimating:false, refreshing: false},()=>{
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
      this.setState({isAnimating:false,stores :[], refreshing: false},()=>{
        if(error.status==CODE_401) {
          AsyncStorage.getItem("password").then((response)=>{
            this.setState({password:decrypt('key123', response)},()=>{
              AsyncStorage.getItem("uName").then((response)=>{
                this.setState({username:response},()=>{
                  AsyncStorage.multiRemove(['JWT']).then((response)=>{
                    Actions.login({type: "reset",language:this.state.language, timeFormat:this.state.timeFormat,userName :this.state.username,password:this.state.password})
                  })
                })
              })
            })
          })
        }
        /*This status code relogins the app by taking credentials from local storage*/
        else if(error.status==CODE_498){
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
                                this.getDayStoreData()
                              })
                            })
                          })
                        }
                        else {
                          this.setState({isAnimating:false},()=>{
                            Alert.alert(CATCH_ERROR_MSG())
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

/* list to use the IDs for the react instead of default */
  _keyExtractor = (item, index) => item.StoreUID;
/*Navigation to Store Board*/
  navigateStoreBoard = () => {
    let { recorder, isCheckedAll } = this.state

    if(recorder.length <= 1) {
      if(isCheckedAll) {
        Actions.storeBoard({rowData:this.state.stores[0],currTab:this.props.currTab})
      }
      else {
        Actions.storeBoard({rowData:dataRow,currTab:this.props.currTab})
      }
    }
    else {
      Actions.multiStoreBoard({dataArray:recorder,currTab:this.props.currTab})
    }
  }
/************************************************************************************/
  /*Get list of rows of day Data*/
  renderRow(rowData, rowID) {
    let minutes = Math.floor((rowData.Day.Total) / 60)
    let seconds = ((rowData.Day.Total)%60) >= 10 ? ((rowData.Day.Total)%60) : "0"+((rowData.Day.Total)%60)
    let timeInMinutes = minutes+":"+seconds
    let isChecked  = this.state.isChecked
    return (
      <TouchableHighlight activeOpacity = {0.9}
        // onPress={()=>this.navigateStoreBoard(rowData)}
        style={[CommonStyles.flexOne]}>
        <View style={[CommonStyles.flatListRendeRow,CommonStyles.borderBottom1,CommonStyles.borderGreySeparator]}>
          <View style={[CommonStyles.flexOne]}>
            {/*Managing list data according to column name*/
              this.state.column1Select ==="StoreName"
              ?
                <Text  allowFontScaling ={false} ellipsizeMode={'tail'} numberOfLines={1}
                style={[CommonStyles.flatListRenderRowTextColor,
                              CommonStyles.textLeft,
                              CommonStyles.font20,
                              CommonStyles.mL10]}>
                  {rowData.StoreName}
                </Text>
              :
              this.state.column1Select ==="StoreNumber"
              ?
                <Text  allowFontScaling ={false} ellipsizeMode={'tail'} numberOfLines={1}
                style={[CommonStyles.flatListRenderRowTextColor,
                            CommonStyles.textLeft,
                            CommonStyles.font20,
                            CommonStyles.mL10]}>
                  {rowData.StoreNumber}
                </Text>
              :
              null
            }
          </View>
          <View style={[CommonStyles.flexOne]}>
          {/*Managing list data according to column name*/
            this.state.column2Select ==="Total"
            ?
              <Text  allowFontScaling ={false} style={[CommonStyles.textRight,
                        CommonStyles.flatListRenderRowTextColor,
                        CommonStyles.font20,
                        CommonStyles.mR10]}>
                {this.state.timeFormat == "seconds" ? rowData.Day.Total : timeInMinutes }
              </Text>
            :
            this.state.column2Select ==="Car"
            ?
            <Text  allowFontScaling ={false} style={[CommonStyles.textRight,
                      CommonStyles.flatListRenderRowTextColor,
                      CommonStyles.font20,
                      CommonStyles.mR10]}>
              {rowData.Day.Car}
            </Text>
            :
            null
          }
          </View>
          <View style={[CommonStyles.flex3By2,CommonStyles.rowFlexDir, CommonStyles.alignCenter,CommonStyles.justifyCenterContent]}>
            <Text allowFontScaling ={false}
              style={[CommonStyles.font18, CommonStyles.fontBold,
                CommonStyles.mR10, CommonStyles.mL30, CommonStyles.textWhite]}>
              {I18n.t('Set')}{"\n"}{I18n.t('Alert')}
            </Text>
            {/*<StyleProvider style={getTheme(material)}>*/}
              <CheckBox
                size ={Platform.OS == "ios" ? 28 :35}
                checkedColor={'#00bcd4'}
                containerStyle={{backgroundColor: 'transparent', borderWidth:0}}
                checked={isChecked[rowID][rowData['StoreUID']] == undefined ? false : isChecked[rowID][rowData['StoreUID']]}
                onIconPress={()=>this.clickSingleCheckBox(rowData, rowID)}/>
              {/*</StyleProvider>*/}
          </View>
        </View>
      </TouchableHighlight>
    )
  }
  /************************************************************************************/
    clickSingleCheckBox = (data, index) => {
      let ID = data.StoreUID
  		let stores = this.state.stores
  		let recorder = this.state.recorder
  		let isChecked = this.state.isChecked
  		if(isChecked[index][ID]) {
        isChecked[index][ID] = false
        this.setState({isChecked, isCheckedAll : false})
        recorder = recorder.filter(item => item != ID)
        this.setState({ recorder })
        dataRowArray = dataRowArray.filter(item => item.StoreUID != data.StoreUID )

        if(recorder.length <= 1) {
          dataRow = dataRowArray[0]
        }
        else {
          dataRow = {}
        }
      }
      else {
        isChecked[index][ID] = true
        this.setState({isChecked})
        recorder.push(ID)
        this.setState({ recorder})
        dataRowArray.push(data)
        if(recorder.length <= 1) {
          dataRow = data
        }
        else {
          dataRow = {}
        }
      }
    }
    clickAllCheckBox = () => {
      let { isCheckedAll, isChecked, stores, recorder } = this.state
      let StoreID;
      if(isCheckedAll) {
        recorder = []
        for(let i = 0 ; i < stores.length; i++) {
          StoreID = stores[i]['StoreUID']
          isChecked[i][StoreID] = false
        }
        dataRowArray = []
        this.setState({isChecked, recorder, isCheckedAll : false})
      }
      else {
        recorder = []
        for(let i = 0 ; i < stores.length; i++) {
          dataRowArray.push(stores[i])
          StoreID = stores[i]['StoreUID']
          isChecked[i][StoreID] = true
          recorder.push(StoreID)
        }
        this.setState({isChecked, recorder, isCheckedAll : true})
      }
    }
  /************************************************************************************/

  /*Header for the list row*/
  flatListHeader = () =>{
    return(
        <View style={[CommonStyles.flatListHeaderStyle]}>
          <Menu style={[CommonStyles.threeDotWidth35]}>
            <MenuTrigger>
              <Icon name="md-more"  backgroundColor="#3b5998"
                    style={[CommonStyles.font20,CommonStyles.mL15,CommonStyles.paddingB20,
                            CommonStyles.defaultTextblue,
                            CommonStyles.mTP15]} />
            </MenuTrigger>
            <MenuOptions customStyles={customPopupStyle}>
              <MenuOption customStyles={customPopupOptionLabelStyle}
                          onSelect={this.changeDropDown1.bind(this)}
                          text={this.state.column1Select==="StoreName" ? I18n.t('Store #'):I18n.t('Store')+" "+I18n.t('Name')} />
            </MenuOptions>
          </Menu>
        <TouchableOpacity onPress={()=>this.setAscendingFlag(this.state.column1Select)}
                          style={[CommonStyles.flatListSubHeaderStyle]}>
          {/*Select Column Name*/
            this.state.column1Select ==="StoreName"
            ?
              <Text  allowFontScaling ={false}
                style={[CommonStyles.font18,
                        CommonStyles.fontBold,
                        CommonStyles.textLeft,
                        CommonStyles.mL10,CommonStyles.defaultTextblue]}>
                {I18n.t('Store')}{"\n"}{I18n.t('Name')}
              </Text>
            :
            this.state.column1Select ==="StoreNumber"
            ?
              <Text allowFontScaling ={false}
                style={[CommonStyles.font18,
                        CommonStyles.fontBold,
                        CommonStyles.textLeft,
                        CommonStyles.mL10,CommonStyles.defaultTextblue]}>
                {I18n.t('Store #')}
              </Text>
            :
            null
          }
          {/*Select Ascending State of Column*/
            this.state.isAscending === 1
          ?
            <Icon name="ios-arrow-down"
              backgroundColor="#3b5998"
              style={[CommonStyles.font18,
                      CommonStyles.mL10,
                      CommonStyles.defaultTextblue,
                      CommonStyles.mTP5]} />
          :
            this.state.isAscending === 2
          ?
            <Icon name="ios-arrow-up"
              backgroundColor="#3b5998"
              style={[CommonStyles.font18,CommonStyles.mL10,CommonStyles.defaultTextblue,CommonStyles.mTP5]} />
          :
            null
          }
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>this.setAscendingFlag2(this.state.column2Select)}
          style={[CommonStyles.flatListSubHeaderStyle]}>
          <View style={{justifyContent:"flex-end", flex:1, flexDirection:"row"}}>
          {
            this.state.isAscendingCol2 === 1
          ?
            <Icon name="ios-arrow-down"
              backgroundColor="#3b5998"
              style={[CommonStyles.font18,
                      CommonStyles.fontBold,
                      CommonStyles.textRight,
                      CommonStyles.mR10,
                      CommonStyles.defaultTextblue,
                      CommonStyles.mTP5]} />
          :
            this.state.isAscendingCol2 === 2
          ?
            <Icon name="ios-arrow-up"
              backgroundColor="#3b5998"
              style={[CommonStyles.font18,
                      CommonStyles.textRight,
                      CommonStyles.mR10,
                      CommonStyles.defaultTextblue,
                      CommonStyles.fontBold,
                      CommonStyles.mTP5]} />
          :
            null
          }
          </View>
          {
            this.state.column2Select ==="Total"
            ?
              <Text allowFontScaling ={false}
                style={[CommonStyles.font18,CommonStyles.fontBold,CommonStyles.mR10,
                        CommonStyles.defaultTextblue]}>
                {I18n.t('Total')}{"\n"}{I18n.t('Time')}
              </Text>
            :
            this.state.column2Select ==="Car"
            ?
              <Text allowFontScaling ={false}
                style={[CommonStyles.font18,CommonStyles.fontBold,
                        CommonStyles.textRight,CommonStyles.mR10,
                        CommonStyles.defaultTextblue]}>
                {I18n.t('Cars')}
              </Text>
            :
            null
          }
        </TouchableOpacity>
        <Menu style={[CommonStyles.threeDotWidth35]}>
          <MenuTrigger>
            <Icon name="md-more"  backgroundColor="#3b5998"
                  style={[CommonStyles.font20,
                          CommonStyles.mL15,
                          CommonStyles.paddingB20,
                          CommonStyles.defaultTextblue,
                          CommonStyles.mTP15]} />
          </MenuTrigger>
          <MenuOptions customStyles={customPopupStyle}>
            <MenuOption customStyles={customPopupOptionLabelStyle}
                        onSelect={this.changeDropDown2.bind(this)}
                        text={this.state.column2Select==="Car" ? I18n.t('Total')+" "+I18n.t('Time') : I18n.t("Cars")}  />
          </MenuOptions>
        </Menu>
          <View style={[CommonStyles.flex3By2,CommonStyles.rowFlexDir, CommonStyles.alignCenter,CommonStyles.justifyCenterContent]}>
            <Text allowFontScaling ={false}
              style={[CommonStyles.font18,CommonStyles.fontBold,
                      CommonStyles.defaultTextblue,CommonStyles.mR10]}>
              {I18n.t('Set')}{"\n"}{I18n.t('Alert')}
            </Text>
            {/*<StyleProvider style={getTheme(material)}>*/}
              <CheckBox checked={this.state.isCheckedAll}
                checkedColor={'#00bcd4'}
                size ={Platform.OS == "ios" ? 30 :35}
                containerStyle={{backgroundColor: 'transparent', borderWidth:0}}
                onIconPress={this.clickAllCheckBox}/>
            {/*</StyleProvider>*/}
          </View>
        </View>
    )
  }
  /************************************************************************************/

  /************************************************************************************/
  /*Setting the Ascending and Descending data according to the flags*/

  setAscendingFlag = (columnName) => {
      const {stores, column1Select} = this.state
      this.setState({isAscendingCol2:0})

      if(columnName == "StoreNumber") {
        if(this.state.isAscending===0) {
          this.setState({isAscending:1})
          this.setState({stores:stores.sort(function ( a, b ) { return b.StoreNumber - a.StoreNumber })})
        }
        if(this.state.isAscending===1) {
          this.setState({isAscending:2},()=>{
            this.setState({stores:stores.sort(function ( a, b ) { return b.StoreNumber - a.StoreNumber }).reverse()})
          })
        }
        if(this.state.isAscending===2) {
          this.setState({isAscending:1})
          this.setState({stores:stores.reverse()})
        }
      }
      else {
        if(this.state.isAscending===0) {
          this.setState({isAscending:1})
          this.setState({stores:stores.sort(function(a, b) {
            let nameA=a.StoreName.toLowerCase(), nameB=b.StoreName.toLowerCase()
            if (nameA < nameB)
                return -1
            if (nameA > nameB)
                return 1
            return 0
            }).reverse()
          })
        }
        if(this.state.isAscending===1) {
          this.setState({isAscending:2},() => {
            this.setState({stores:stores.sort(function(a, b) {
              let nameA=a.StoreName.toLowerCase(), nameB=b.StoreName.toLowerCase()
              if (nameA < nameB)
                  return -1
              if (nameA > nameB)
                  return 1
              return 0
              })
            })
          })

        }
        if(this.state.isAscending===2) {
          this.setState({isAscending:1})
          this.setState({stores:stores.reverse()})
        }
      }
  }

  setAscendingFlag2 = (columnName) => {
    const {stores, column2Select} = this.state
      this.setState({isAscending:0})
      if(this.state.isAscendingCol2===0) {
        this.setState({isAscendingCol2:1})
        this.setState({stores:stores.sort( function ( a, b ) { return b.Day[columnName] - a.Day[columnName] })})
      }
      if(this.state.isAscendingCol2===1) {
        this.setState({isAscendingCol2:2})
        this.setState({stores:stores.reverse()})
      }
      if(this.state.isAscendingCol2===2) {
        this.setState({isAscendingCol2:1})
        this.setState({stores:stores.sort( function ( a, b ) { return b.Day[columnName] - a.Day[columnName] })})
      }
	}
/************************************************************************************/
  /*
    On pull down refersh
    It resets the environment and calls the API
  */
  _onRefresh() {
    this.setState({isAscendingCol2:1,isAscending:0})
    this.getDayStoreData()
  }
/**********************************************************************/
  /*Function to change the column Name in three dot menu*/
  changeDropDown1() {
    this.setState({isAnimating:true})
    if(this.state.column1Select==="StoreNumber") {
      setStoreType(this.state.username, Platform.OS, STORE_NAME).then((res)=>{
        if(res.status==CODE_200) {
          this.setState({isAnimating:false})
          this.setState({column1Select:"StoreName",isAscending:0},()=>{
            AsyncStorage.setItem("col1", "StoreName").then((response)=>{
              this.props.setColumn(this.state.column1Select)
            })
          })
        }
      }).catch((err)=>{
        this.setState({isAnimating:false},()=>{
          Alert.alert(CATCH_ERROR_MSG())
        })
      })
    }
    else {
      setStoreType(this.state.username, Platform.OS, STORE_NUMBER).then((res)=>{
        if(res.status==CODE_200) {
          this.setState({isAnimating:false})
          this.setState({column1Select:"StoreNumber",isAscending:0},()=>{
            AsyncStorage.setItem("col1", "StoreNumber").then((response)=>{
              this.props.setColumn(this.state.column1Select)
            })
          })
        }
      }).catch((err)=>{
        this.setState({isAnimating:false},()=>{
          Alert.alert(CATCH_ERROR_MSG())
        })
      })
    }
  }

  changeDropDown2(){
    if(this.state.column2Select==="Car") {
      this.setState({column2Select:"Total",isAscendingCol2:0},()=>{
        AsyncStorage.setItem("col2", "Total")
      })
    }
    else {
      this.setState({column2Select:"Car",isAscendingCol2:0},()=>{
        AsyncStorage.setItem("col2", "Car")
      })
    }
  }
/**********************************************************************/
  /* It renders the whole UI*/
  render() {
  let {recorder} = this.state
  return (
      <View style={[CommonStyles.flexOne]}>
        <View style={[CommonStyles.bgWhite,
                      CommonStyles.flexOne]}>
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
          <View style={[CommonStyles.flexOne]}>
            { this.flatListHeader() }
            {/*Encapsulated Component to loop the list data*/
              this.state.stores!=""
              ?
                <FlatList
                  data={this.state.stores}
                  extraData={this.state}
                  refreshControl =
                  {
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this._onRefresh.bind(this)}
                    />
                  }
                  keyExtractor = {this._keyExtractor}
                  renderItem={({item, index}) => this.renderRow(item, index)} />
              :
                <View style={[CommonStyles.noDataTextStyle]}>
                  <Text  allowFontScaling ={false} style={[CommonStyles.font16,CommonStyles.fontBold]}>
                      {NO_DATA()}
                  </Text>
                </View>
              }
            </View>
          }

          <View style={[{flex:0.125}]}>

            <View style={[CommonStyles.flexOne]} />
            <View style={[CommonStyles.flexTwo,CommonStyles.rowFlexDir]}>

              <View style={[CommonStyles.flexOne]} />
              {
                isEmpty(recorder)
                 ?
              <View style={[CommonStyles.flexOne, CommonStyles.justifyCenterContent,
                CommonStyles.alignCenter,CommonStyles.disableColor,
                CommonStyles.rowFlexDir]}>
                <Text  allowFontScaling ={false}
                  style={[CommonStyles.font22, CommonStyles.blackText,
                  CommonStyles.fontBold]}>
                  PROCEED
                </Text>
                <Icon name="ios-arrow-forward-outline"
                  style={
                    Platform.OS=="ios"
                    ? [IosStyles.font22,CommonStyles.blackText,CommonStyles.mL10]
                    : [CommonStyles.font25,CommonStyles.blackText,CommonStyles.mL10]
                  } />
              </View>
              :
              <TouchableOpacity style={[CommonStyles.flexOne, CommonStyles.justifyCenterContent,
                CommonStyles.alignCenter,CommonStyles.blueHeaderColor,
                CommonStyles.rowFlexDir]} onPress={this.navigateStoreBoard}>
                <Text  allowFontScaling ={false}
                  style={[CommonStyles.font22, CommonStyles.textWhite,
                  CommonStyles.fontBold]}>
                  PROCEED
                </Text>
                <Icon name="ios-arrow-forward-outline"
                  style={
                    Platform.OS=="ios"
                    ? [IosStyles.font22,CommonStyles.textWhite,CommonStyles.mL10]
                    : [CommonStyles.font25,CommonStyles.textWhite,CommonStyles.mL10]
                  } />
              </TouchableOpacity>
              }
              <View style={[CommonStyles.flexOne]} />

            </View>

            <View style={[CommonStyles.flexOne]} />

          </View>

        </View>
      </View>
    )
  }
}
