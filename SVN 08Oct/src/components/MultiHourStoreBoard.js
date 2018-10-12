import React from 'react';
import {TouchableOpacity,
        StatusBar,
        RefreshControl,
        ScrollView,
        Dimensions,
        Image,
        AsyncStorage,
        FlatList,
        Keyboard,
        Text,
        View,
        Alert,
        TextInput} from 'react-native';
import CommonStyles from './../stylesheets/CommonStyles'
import {Actions} from "react-native-router-flux";
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty'
import {AVG, ALERT, SET, DETECTION, TIME} from "./../utilities/HelperLabels"
import {NO_DATA} from "./../utilities/GenericMessages"
import I18n from './../utilities/i18n'
import {CATCH_ERROR_MSG, NOT_VALID_MSG, OBJ_REF_ERROR} from "./../utilities/GenericMessages"
import {CODE_200, CODE_498, CODE_500, CODE_401} from "./../utilities/GenericMessages"
import { encrypt, decrypt } from 'react-native-simple-encryption';
import {Loader} from './ProgressLoader'
import {getMultiStoreData} from "./../services/webServices"
import {loginService} from "./../services/webServices"
let hourCarCount ={}
let hourTotalTime ={}
let detectorData ={}
let singleStore;

export default class MultiHourStoreBoard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      carCount:{},
      totalTime:{},
      singleStore:{},
      detectorData :{},
      refreshing:false,
      isAnimating : true
    }

  }
  componentWillMount () {
	   Keyboard.dismiss();

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
                this.setState({isAnimating:false})
                if(!isEmpty(this.props.storeUIDS) )

                this.setState({isAnimating:true})
                this.getMultiStoreDataForHour()

                AsyncStorage.getItem("TF").then((response)=>{
                  this.setState({timeFormat : response})
                })
              });
            })
          })
        })
      })
    })
  }

  /*Pull down refresh functionality*/
  _onRefresh() {
    this.setState({refreshing:true, isAnimating: true})
    this.getMultiStoreDataForHour()
  }

  /**API CALL*/

  getMultiStoreDataForHour = () => {
    getMultiStoreData(this.props.storeUIDS, this.state.uName, 'HOUR', this.state.JWT)
      .then((response) => {
        if((response.status==CODE_200) && response.body.length!==0) {
          singleStore = JSON.parse(response.body)
          this.setState({singleStore})
          this.setState({isAnimating:false})
          this.setState({refreshing:false})
          this.refineData()
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
                                  this.getMultiStoreDataForHour()
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

  /***/


  /*Managing the data received from Parent component to show on UI as per the alert functionality*/
  refineData = () =>{
      detectorData = Object.assign({},this.state.singleStore.hour)
      delete detectorData.CarCount
      delete detectorData.Total
      this.setState({detectorData})
  }

  /*Render the UI as multiple rows with different conditions*/
  renderDetectData =() =>{
    let a = []
    let i =0;
    for(let x in this.state.detectorData) {
      ++i
      a.push(
        <View key={i} style={
          Math.round(this.state.detectorData[x].avg) > this.state.detectorData[x].alert['threshold']
           ? [CommonStyles.rowFlexDir,CommonStyles.borderBottom1,
                         CommonStyles.borderGreySeparator,CommonStyles.highlightRowBgColor,{paddingTop: 14,
           paddingBottom: 14}]
           : [CommonStyles.rowFlexDir,CommonStyles.borderBottom1,
                         CommonStyles.borderGreySeparator,{paddingTop: 14,
           paddingBottom: 14}]}>
          <View style={[CommonStyles.flex11]}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <Text allowFontScaling={false}  allowFontScaling={false}  style={[CommonStyles.flatListRenderRowTextColor,
                          CommonStyles.textLeft,
                          CommonStyles.font18,
                          CommonStyles.mTP2,
                          CommonStyles.mL30]} >
                {x}&emsp;&emsp;&emsp;&emsp;&emsp;
            </Text>
          </ScrollView>
          </View>
          <View style={[CommonStyles.flex7By2,CommonStyles.justifyCenterContent]}/>
          <View style={[CommonStyles.flexTwo,CommonStyles.justifyCenterContent]}/>
          <View style={[CommonStyles.flex7By2,CommonStyles.justifyCenterContent]}>
          {
            isEmpty(this.state.detectorData[x].alert)
            ?
            <Icon name="gear"
                  onPress={()=>Actions.configAlert({tabType:"hour",
                                                    storeUID:this.props.storeUIDS,
                                                    data:this.state.detectorData[x].alert,
                                                    alertType:x})}
                  style={[CommonStyles.font25,CommonStyles.textCenter,CommonStyles.warningColor]} />
            :
            null
          }
          </View>
          <View style={[CommonStyles.flex3By2]}/>
        </View>
      )
    }
    return a
  }

  /*Header of the UI List*/
  flatListHeader = () =>{
    return(
        <View style={[CommonStyles.rowFlexDir,CommonStyles.justifyCenterContent,
                      CommonStyles.bgListHeaderColor,CommonStyles.flex27By20]}>
          <View style={[CommonStyles.rowFlexDir,
                        CommonStyles.alignCenter,CommonStyles.flex11]}>
            <Text allowFontScaling={false}  style={[CommonStyles.font18,
                              CommonStyles.fontBold,
                              CommonStyles.textLeft,
                              CommonStyles.mL30,CommonStyles.defaultTextblue]}>
                  {DETECTION()}{"\n"}Points
            </Text>
          </View>
          <View style={[CommonStyles.flatListSubHeaderStyle,
                        CommonStyles.flex7By2,CommonStyles.justifyCenterContent]} />
          <View style={[CommonStyles.flatListSubHeaderStyle,CommonStyles.flexTwo]}/>
          <View style={[CommonStyles.justifyCenterContent,
          CommonStyles.flatListSubHeaderStyle,CommonStyles.flex7By2]}>
            <Text allowFontScaling={false}  style={[CommonStyles.font18,CommonStyles.fontBold,
                          CommonStyles.textCenter,
                          CommonStyles.defaultTextblue]}>
              {SET()}{"\n"}{ALERT()}
            </Text>
          </View>
          <View style={[CommonStyles.flatListSubHeaderStyle,CommonStyles.flex3By2]}/>
        </View>
    )
  }

  /*It renders the UI*/
  render() {
    if(this.state.isAnimating) {
      return (
        <View style={[{ flex: 1,
                        justifyContent:"center",
                        alignContent:"center",
                        backgroundColor:"white"
                      }]}>
          <Loader isLoading = {this.state.isAnimating} />
        </View>
      )
    }
    return (
      <View style={[CommonStyles.flexOne,CommonStyles.bgWhite]}>
        {this.flatListHeader()}

        <View style={[CommonStyles.flexNine]}>
          <ScrollView refreshControl = {<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh.bind(this)} />}>
            {
            isEmpty(this.state.singleStore.hour) || isEmpty(this.state.singleStore)
            ?
            <View style={[CommonStyles.bgWhite,CommonStyles.flexOne,
                          CommonStyles.rowFlexDir,CommonStyles.justifyCenterContent,{marginTop:40}]}>
              <Text allowFontScaling={false}  style={[CommonStyles.font16,CommonStyles.fontBold]}>
                  {NO_DATA()}
              </Text>
            </View>
            :
            <View style={[CommonStyles.bgWhite,CommonStyles.flexOne]}>
              {/*Car Section Removed*/}
              {
                (this.state.singleStore.hour).hasOwnProperty("Total")
                ?
              <View style={[CommonStyles.storeListRenderFirstRow,CommonStyles.borderBottom1,
                            CommonStyles.borderGreySeparator]}>
                <View style={[CommonStyles.flex11]}>

                    <Text allowFontScaling={false}  style={[CommonStyles.flatListRenderRowTextColor,
                                  CommonStyles.textLeft,
                                  CommonStyles.font18,
                                  CommonStyles.mL30]}>
                      {I18n.t('Lane Total')}
                    </Text>

                </View>

                <View style={[CommonStyles.flex7By2,CommonStyles.justifyCenterContent]} />

                <View style={[CommonStyles.flexTwo,CommonStyles.justifyCenterContent]} />
                <View style={[CommonStyles.flex7By2,CommonStyles.justifyCenterContent]}>
                  {
                    (this.state.singleStore.hour).hasOwnProperty("Total")
                    ?
                    <Icon name="gear"
                      onPress={()=>Actions.configAlert({tabType:"hour",
                                                      storeUID:this.props.storeUIDS,
                                                      data:{},
                                                      alertType:"Total"})}
                      style={[CommonStyles.font25,CommonStyles.textCenter,CommonStyles.warningColor]} />
                    :
                    null
                  }
                </View>
                <View style={[CommonStyles.flex3By2]}/>
              </View>
              :
              null
              }
              {this.renderDetectData()}
              {/*Car Section Start*/}
              <View style={[CommonStyles.justifyCenterContent,
                            CommonStyles.mTP22,CommonStyles.mB22]}>
                <View style={[CommonStyles.alignCenter,CommonStyles.rowFlexDir]}>
                  <View style={[CommonStyles.flex3By2]} />
                  {
                    (this.state.singleStore.hour).hasOwnProperty("CarCount")
                    ?
                  <View style={[CommonStyles.flexTwo,CommonStyles.blueHeaderColor,CommonStyles.pTB11]}>
                      <Text allowFontScaling={false}
                        style={[CommonStyles.textWhite,
                                CommonStyles.fontBold,
                                CommonStyles.textCenter,
                                CommonStyles.font30]}>
                        {I18n.t('Total')}{"\n"}{I18n.t('Cars')}
                      </Text>

                  </View>
                  :
                  null
                }

                  <View style={[CommonStyles.flex3By2]}>
                    {
                    (this.state.singleStore.hour).hasOwnProperty("CarCount")
                    ?
                    <Icon name="gear"
                    onPress={()=>Actions.configAlert({tabType:"hour",
                                                      storeUID:this.props.storeUIDS,
                                                      data:{},
                                                      alertType:"CarCount"})}
                    style={[CommonStyles.font25,CommonStyles.textCenter,CommonStyles.warningColor]} />
                    :
                    null
                    }
                  </View>
                </View>
                </View>
              {/*Car Section*/}
            </View>
            }
          </ScrollView>
          </View>
      </View>
    )}
  }
