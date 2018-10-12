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
import {hourSingleStoreData} from "./../utilities/GenericMessages"
import I18n from './../utilities/i18n'
let carCount ={}
let totalTime ={}
let detectorData ={}
let singleStore;

export default class HourStoreBoard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      carCount:{},
      totalTime:{},
      detectorData :{},
      refreshing:false
    }

  }
  componentWillMount () {
	   Keyboard.dismiss();

  }

  componentDidMount () {
    if(!isEmpty(this.props.singleStore.hour) )
    AsyncStorage.getItem("TF").then((response)=>{
      this.setState({timeFormat : response},()=>{
        this.refineData()
      })
    })
  }

  /*Pull down refresh functionality*/
  _onRefresh() {
    this.props.refreshData()
    this.setState({refreshing:false})
  }

  /*Managing the data received from Parent component to show on UI as per the alert functionality*/
  refineData = () =>{
    carCount = Object.assign({},this.props.singleStore.hour.CarCount)
    totalTime = Object.assign({},this.props.singleStore.hour.Total)
    detectorData = Object.assign({},this.props.singleStore.hour)
    // carCount = Object.assign({},hourSingleStoreData.hour.CarCount)
    // totalTime = Object.assign({},hourSingleStoreData.hour.Total)
    // detectorData = Object.assign({},hourSingleStoreData.hour)
    delete detectorData.CarCount
    delete detectorData.Total
    this.setState({carCount,totalTime,detectorData})
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
          <View style={[CommonStyles.flex7By2,CommonStyles.justifyCenterContent]}>
            <Text allowFontScaling={false}  style={[CommonStyles.textCenter,
                          CommonStyles.flatListRenderRowTextColor,
                          CommonStyles.mTP2,
                          CommonStyles.font18]}>
              {
                this.state.timeFormat == "seconds"
                ?
                Math.round(this.state.detectorData[x].avg)
                :
                Math.floor((Math.round(this.state.detectorData[x].avg)) / 60)+":"+(((Math.round(this.state.detectorData[x].avg))%60) >= 10 ? ((Math.round(this.state.detectorData[x].avg))%60) : "0"+((Math.round(this.state.detectorData[x].avg))%60))
              }

              {/*Math.round(this.state.detectorData[x].avg)*/}
            </Text>
          </View>
          <View style={[CommonStyles.flexTwo,CommonStyles.justifyCenterContent]}>
          {
            isEmpty(this.state.detectorData[x].alert)
            ?
            null
            :
            Math.round(this.state.detectorData[x].avg) > this.state.detectorData[x].alert['threshold']
            ?
            <Icon name="angle-right"
            style={[CommonStyles.font30,CommonStyles.textCenter,CommonStyles.defaultTextblue]} />
            :
            Math.round(this.state.detectorData[x].avg) < this.state.detectorData[x].alert['threshold']
            ?
            <Icon name="angle-left"
            style={[CommonStyles.font30,CommonStyles.textCenter,CommonStyles.defaultTextblue]} />
            :
            null
          }
          </View>
          <View style={[CommonStyles.flex7By2,CommonStyles.justifyCenterContent]}>
                {
                  isEmpty(this.state.detectorData[x].alert)
                  ?
                  <Icon name="gear"
                        onPress={()=>Actions.configAlert({tabType:"hour",
                                                          storeUID:this.props.storeUID,
                                                          rowData:this.props.rowData,
                                                          data:this.state.detectorData[x].alert,
                                                          alertType:x})}
                        style={[CommonStyles.font25,CommonStyles.textCenter,CommonStyles.warningColor]} />
                  :
                  <TouchableOpacity
                        style={[CommonStyles.blueHeaderColor,CommonStyles.paddingB4]}
                        onPress={()=>Actions.configAlert({tabType:"hour",
                                                    storeUID:this.props.storeUID,
                                                    rowData:this.props.rowData,
                                                    data:this.state.detectorData[x].alert,
                                                    alertType:x})} >
                    <Text allowFontScaling={false}  style={[CommonStyles.textCenter,
                                  CommonStyles.textWhite,
                                  CommonStyles.mTP2,
                                  CommonStyles.font18]}>

                      {
                        this.state.timeFormat == "seconds"
                        ?
                        this.state.detectorData[x].alert['threshold']
                        :
                        Math.floor(this.state.detectorData[x].alert['threshold'] / 60)+":"+((this.state.detectorData[x].alert['threshold'] % 60) >= 10 ? (this.state.detectorData[x].alert['threshold'] % 60) : "0"+(this.state.detectorData[x].alert['threshold'] % 60))
                      }
                      {/*this.state.detectorData[x].alert['threshold']*/}
                    </Text>
                  </TouchableOpacity>
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
                        CommonStyles.flex7By2,CommonStyles.justifyCenterContent]}>
            <Text allowFontScaling={false}  style={[CommonStyles.font18,CommonStyles.fontBold,
                          CommonStyles.textCenter,
                          CommonStyles.defaultTextblue]}>
              {AVG()}{"\n"}{TIME()}
            </Text>
          </View>
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
    return (
      <View style={[CommonStyles.flexOne,CommonStyles.bgWhite]}>
        {this.flatListHeader()}

        <View style={[CommonStyles.flexNine]}>
          <ScrollView refreshControl = {<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh.bind(this)} />}>
            {
            isEmpty(this.props.singleStore.hour) ?
            <View style={[CommonStyles.bgWhite,CommonStyles.flexOne,
                          CommonStyles.rowFlexDir,CommonStyles.justifyCenterContent,{marginTop:40}]}>
              <Text allowFontScaling={false}  style={[CommonStyles.font16,CommonStyles.fontBold]}>
                  {NO_DATA()}
              </Text>
            </View>
            :
            <View style={[CommonStyles.bgWhite,CommonStyles.flexOne]}>
              {/*Car Section Removed*/}

              <View style={
                    isEmpty(this.state.totalTime)
                    ? [CommonStyles.storeListRenderFirstRow]
                    : Math.round(this.state.totalTime.avg) > this.state.totalTime.alert.threshold
                    ? [CommonStyles.storeListRenderFirstRow,CommonStyles.borderBottom1,
                                  CommonStyles.borderGreySeparator,CommonStyles.highlightRowBgColor]
                    : [CommonStyles.storeListRenderFirstRow,CommonStyles.borderBottom1,
                                  CommonStyles.borderGreySeparator,]
                    }>
                <View style={[CommonStyles.flex11]}>
                  {
                    isEmpty(this.state.totalTime)
                    ?
                    null
                    :
                  <Text allowFontScaling={false}  style={[CommonStyles.flatListRenderRowTextColor,
                                CommonStyles.textLeft,
                                CommonStyles.font18,
                                CommonStyles.mL30]}>
                    {I18n.t('Lane Total')}
                  </Text>
                  }
                </View>
                <View style={[CommonStyles.flex7By2,CommonStyles.justifyCenterContent]}>
                  <Text allowFontScaling={false}  style={[CommonStyles.flatListRenderRowTextColor,CommonStyles.textCenter,
                                CommonStyles.font18]}>
                    {
                      isEmpty(this.state.totalTime.avg)
                      ?
                      null
                      :
                      this.state.timeFormat == "seconds"
                      ?
                      Math.round(this.state.totalTime.avg)
                      :
                      Math.floor((Math.round(this.state.totalTime.avg)) / 60)+":"+(((Math.round(this.state.totalTime.avg))%60) >= 10 ? ((Math.round(this.state.totalTime.avg))%60) : "0"+((Math.round(this.state.totalTime.avg))%60))
                    }
                  </Text>
                </View>
                <View style={[CommonStyles.flexTwo,CommonStyles.justifyCenterContent]}>
                  {
                  isEmpty(this.state.totalTime.alert)
                  ?
                  null
                  :
                  Math.round(this.state.totalTime.avg) > this.state.totalTime.alert.threshold
                  ?
                  <Icon name="angle-right"
                  style={[CommonStyles.font30,CommonStyles.textCenter,CommonStyles.defaultTextblue]} />
                  :
                  Math.round(this.state.totalTime.avg) < this.state.totalTime.alert.threshold
                  ?
                  <Icon name="angle-left"
                  style={[CommonStyles.font30,CommonStyles.textCenter,CommonStyles.defaultTextblue]} />
                  :
                  null
                  }
                </View>
                <View style={[CommonStyles.flex7By2,CommonStyles.justifyCenterContent]}>
                    {
                      isEmpty(this.state.totalTime.alert)
                      ?
                      (this.state.totalTime).hasOwnProperty("alert")
                      ?
                      <Icon name="gear"
                      onPress={()=>Actions.configAlert({tabType:"hour",
                                                        storeUID:this.props.storeUID,
                                                        rowData:this.props.rowData,
                                                        data:this.state.totalTime.alert,
                                                        alertType:"Total"})}
                      style={[CommonStyles.font25,CommonStyles.textCenter,CommonStyles.warningColor]} />
                      :
                      null
                      :
                      <TouchableOpacity style={[CommonStyles.blueHeaderColor,CommonStyles.paddingB4]}
                            onPress={()=>Actions.configAlert({tabType:"hour",
                                                        storeUID:this.props.storeUID,
                                                        rowData:this.props.rowData,
                                                        data:this.state.totalTime.alert,
                                                        alertType:"Total"})}>
                      <Text allowFontScaling={false}  style={[CommonStyles.textCenter,
                                    CommonStyles.textWhite,
                                    CommonStyles.mTP2,
                                    CommonStyles.font18]}>
                        {
                          isEmpty(this.state.totalTime.alert.threshold)
                          ?
                          "Loading"
                          :
                          this.state.timeFormat == "seconds"
                          ?
                          Math.round(this.state.totalTime.alert.threshold)
                          :
                          Math.floor((Math.round(this.state.totalTime.alert.threshold)) / 60)+":"+(((Math.round(this.state.totalTime.alert.threshold))%60) >= 10
                                                                                                  ?
                                                                                                  ((Math.round(this.state.totalTime.alert.threshold))%60)
                                                                                                  :
                                                                                                  "0"+((Math.round(this.state.totalTime.alert.threshold))%60))
                        }
                      </Text>
                      </TouchableOpacity>
                    }
                </View>
                <View style={[CommonStyles.flex3By2]}/>
              </View>
              {this.renderDetectData()}
              {/*Car Section Start*/}
              <View style={[CommonStyles.justifyCenterContent,CommonStyles.mTP22,CommonStyles.mB22]}>
                <View style={[CommonStyles.alignCenter,CommonStyles.rowFlexDir]}>
                  <View style={[CommonStyles.flex3By2]} />
                  <View style={
                    isEmpty(this.state.carCount)
                    ? [CommonStyles.flexTwo,CommonStyles.blueHeaderColor,CommonStyles.pTB11]
                    : Math.round(this.state.carCount.avg) > this.state.carCount.alert.threshold
                    ? [CommonStyles.flexTwo,CommonStyles.blueHeaderColor,CommonStyles.pTB11,CommonStyles.greenColor]
                    : [CommonStyles.flexTwo,CommonStyles.blueHeaderColor,CommonStyles.pTB11]}>
                    <Text allowFontScaling={false}  style={[CommonStyles.textWhite,
                                  CommonStyles.fontBold,
                                  CommonStyles.textCenter,
                                  CommonStyles.font30]}>
                      {I18n.t('Total')}{"\n"}{I18n.t('Cars')}
                    </Text>
                    {
                      isEmpty(this.state.carCount.avg)
                      ?
                      <Text allowFontScaling={false}  style={[CommonStyles.textWhite,
                                    CommonStyles.fontBold,
                                    CommonStyles.textCenter,
                                    CommonStyles.font20]}>
                        Loading

                      </Text>
                      :
                      <Text allowFontScaling={false}  style={[CommonStyles.textWhite,
                                    CommonStyles.fontBold,
                                    CommonStyles.textCenter,
                                    CommonStyles.font50]}>
                        {Math.round(this.state.carCount.avg)}

                      </Text>
                    }
                  </View>

                  <View style={[CommonStyles.flex3By2]}>
                    {
                    isEmpty(this.state.carCount.alert)
                    ?
                    <Icon name="gear"
                    onPress={()=>Actions.configAlert({tabType:"hour",
                                                      storeUID:this.props.storeUID,
                                                      rowData:this.props.rowData,
                                                      data:this.state.carCount.alert,
                                                      alertType:"CarCount"})}
                    style={[CommonStyles.font25,CommonStyles.textCenter,CommonStyles.warningColor]} />
                    :
                    <View style={[CommonStyles.rowFlexDir]}>
                    <View style={[CommonStyles.flex5By10]}/>
                    <TouchableOpacity
                          style={[CommonStyles.flexOne,CommonStyles.blueHeaderColor,
                          CommonStyles.paddingB4]}
                          onPress={()=>Actions.configAlert({tabType:"hour",
                                                      storeUID:this.props.storeUID,
                                                      rowData:this.props.rowData,
                                                      data:this.state.carCount.alert,
                                                      alertType:"CarCount"})}>
                    <Text allowFontScaling={false}  style={[CommonStyles.textCenter,
                                  CommonStyles.textWhite,
                                  CommonStyles.fontBold,
                                  CommonStyles.mTP2,
                                  CommonStyles.font18]}>
                      {
                        isEmpty(this.state.carCount.alert.threshold)
                        ?
                        "Loading"
                        :
                        this.state.carCount.alert.threshold
                      }
                    </Text>
                    </TouchableOpacity>
                    <View style={[CommonStyles.flex5By10]}/>
                    </View>
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
