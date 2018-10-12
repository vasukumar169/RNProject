import React from 'react'
import {TouchableOpacity, Platform, Alert, Linking, StatusBar, WebView, Keyboard, AsyncStorage, KeyboardAvoidingView, View, Text, TextInput, ImageBackground} from 'react-native'
import CommonStyles from './../stylesheets/CommonStyles'
import IosStyles from './../stylesheets/IosStyles.ios'
import {Actions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/Ionicons'
import I18n from './../utilities/i18n'
import {PUSH_MANAGER} from "./PushManager"
import {FEEDBACK_URL_EN, FEEDBACK_URL_FR} from "./../utilities/HelperLabels"
import {TRY_AGN_LTR} from "./../utilities/GenericMessages"

export default class Feedback extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true
    }
  }

  /*Haltiing the Animation of Loader as the whole data loads*/
  onLoaded = () => {
    this.setState({isLoading:false})
  }

  /*while loading the form any error comes it will shows an error message*/
  onErrorWebView = () => {
    Alert.alert(I18n.t(TRY_AGN_LTR()))
  }

  componentWillMount () {
    /*Configured Push Notification*/
    PUSH_MANAGER()
  }

  /*It renders the UI*/
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
            <Text allowFontScaling= {false}
              style={[CommonStyles.textCenter,CommonStyles.font23,
                      CommonStyles.textWhite,CommonStyles.fontBold]}>
              {I18n.t('Feedback').toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={[CommonStyles.flex11]}>
          <WebView
          onError={this.onErrorWebView}
          onLoad={this.onLoaded}
          startInLoadingState={this.state.isLoading}
          source={this.props.language==="fr-FR" ? {uri: FEEDBACK_URL_FR} : {uri: FEEDBACK_URL_EN}} />
        </View>
      </View>
    )
  }
}
