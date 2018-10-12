import React from 'react'
import {TouchableOpacity, AsyncStorage, Alert,StatusBar, ScrollView, Platform, View, Text} from 'react-native'
import CommonStyles from './../stylesheets/CommonStyles'
import {Actions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/Ionicons'
import IosStyles from './../stylesheets/IosStyles.ios'
import I18n from './../utilities/i18n'
import {PUSH_MANAGER} from "./PushManager"

export default class Settings extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      timeFormat :"",
      language : this.props.language
    }
  }

  componentWillMount () {
    PUSH_MANAGER()
  }

  componentDidMount () {
    //when mounted internationalization will take place according the language
    I18n.locale = this.props.language
    //Fetching time format and setting its value
    AsyncStorage.getItem("TF").then((response)=>{
			this.setState({timeFormat : response})
    })
    //Fetching lang format and setting its value
    AsyncStorage.getItem("languageFormat").then((response)=>{
			this.setState({language : response})
    })
  }

  /*It renders the whole UI*/
  render () {
    return (
      <View style={Platform.OS=="ios" ? [CommonStyles.backGroundContainer,IosStyles.mTP35] : [CommonStyles.backGroundContainer]} >
        <StatusBar  barStyle={Platform.OS=="ios" ? 'dark-content' : 'light-content'}  hidden={false}/>
        <View style={[CommonStyles.settingHeader,CommonStyles.blueHeaderColor]}>
          <TouchableOpacity style={Platform.OS=="ios" ? [CommonStyles.pL10, CommonStyles.flex4By10] : [CommonStyles.padding20,CommonStyles.flex4By10]}
              onPress={() => Actions.pop()}>
            <Icon name="ios-arrow-back-outline"  backgroundColor="#3b5998"
              style={[CommonStyles.font30,CommonStyles.textWhite,CommonStyles.textLeft]} />
          </TouchableOpacity>
          <View style={Platform.OS=="ios" ? [CommonStyles.flex11,CommonStyles.pL0] : [CommonStyles.padding20,CommonStyles.flex11,CommonStyles.pL0]}>
            <Text allowFontScaling ={false}
              style={[CommonStyles.textCenter,CommonStyles.font23,CommonStyles.fontBold,
                      CommonStyles.textWhite]}>
              {I18n.t('Settings').toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={[CommonStyles.flex11,CommonStyles.bgWhite]}>
          <TouchableOpacity onPress={()=>{Actions.language({language:this.props.language})}}
            style={[CommonStyles.settingsBodyView, CommonStyles.pT10]}>
            <View style={[CommonStyles.setrowView,
                          CommonStyles.mB5,
                          CommonStyles.pL20,
                          CommonStyles.borderbtmWidthOne,
                          CommonStyles.borderGreySeparator]}>
              <Text allowFontScaling ={false}
                style={[CommonStyles.font18,
                        CommonStyles.flatListRenderRowTextColor,
                        CommonStyles.fontBold,
                        CommonStyles.mB10]}>
                  {I18n.t('Language')} : {this.state.language == "fr-FR" ? "French" : "English"}
              </Text>
              <Text allowFontScaling ={false}
                style={[CommonStyles.font16,
                        CommonStyles.setngColor,
                        CommonStyles.mB10]}>
                {I18n.t('Select your navigation language')}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={CommonStyles.settingsBodyView}
            onPress={()=>{Actions.timeFormat({language:this.props.language})}}>
            <View style={[CommonStyles.setrowView,
                          CommonStyles.mB5,
                          CommonStyles.pL20,
                          CommonStyles.borderbtmWidthOne,
                          CommonStyles.borderGreySeparator]}>
              <Text allowFontScaling ={false}
                style={[CommonStyles.font18,
                        CommonStyles.setngColor,
                        CommonStyles.fontBold,
                        CommonStyles.mB10]}>
                  {I18n.t('Time Format')}: {this.state.timeFormat == "seconds" ? I18n.t('Seconds') : I18n.t('Minutes:Seconds')}
              </Text>
              <Text allowFontScaling ={false}
                style={[CommonStyles.font16,
                        CommonStyles.setngColor,
                        CommonStyles.mB10]}>
                {I18n.t('Select your time format')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
