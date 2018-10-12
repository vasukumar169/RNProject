import React from 'react'
import {TouchableOpacity, Keyboard, AsyncStorage, StatusBar, ImageBackground, View, Text} from 'react-native'
import CommonStyles from './../stylesheets/CommonStyles'
import {Actions} from 'react-native-router-flux'
import I18n from './../utilities/i18n'
import {PUSH_MANAGER} from "./PushManager"
import {APP_VERSION} from "./../utilities/GenericMessages"

import DeviceInfo from 'react-native-device-info'

export default class About extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      JWT: '',
      userId: ''
    }
  }
  componentWillMount () {


    PUSH_MANAGER()
    //On mounting internationalization will take place according the language
    I18n.locale = this.props.language
    //Keyboard dismisses
    Keyboard.dismiss()
  }

  componentDidMount () {
    //Fetching the credenatials and data from Local Storage

    AsyncStorage.getItem('JWT').then((response) => {
      this.setState({JWT: response}, () => {
        AsyncStorage.getItem('uName').then((response) => {
          this.setState({userId: response})
        })
      })
    })
  }
  render () {
    return (
      <ImageBackground source={require('./../assets/background.png')} style={CommonStyles.backImage}>
        <StatusBar barStyle='light-content' hidden={false} />
        <View style={CommonStyles.autoCenter}>
          <View style={CommonStyles.centerView}>
            <Text allowFontScaling= {false} style={[CommonStyles.userColor, CommonStyles.font18, CommonStyles.mB15]}>
              {this.state.userId}
            </Text>
            <Text allowFontScaling= {false} style={[CommonStyles.thankColor, CommonStyles.font16, CommonStyles.mB25]}>
              {I18n.t('Thank you for choosing HME')}
            </Text>
            <Text allowFontScaling= {false} style={[CommonStyles.thankColor, CommonStyles.font16]}>
              {I18n.t('HME Sales & Service')}
            </Text>
            <Text allowFontScaling= {false} style={[CommonStyles.thankColor, CommonStyles.font16, CommonStyles.mB25]}>
              1-800-848-4468
            </Text>
            <Text allowFontScaling= {false} style={[CommonStyles.thankColor, CommonStyles.font16, CommonStyles.mB15]}>
              Version {/*DeviceInfo.getVersion()*/APP_VERSION}
            </Text>
            <TouchableOpacity style={[CommonStyles.mTN15, { paddingBottom: 20, paddingRight: 20 }]} onPress={() => { Actions.leaderBoard() }}>
              <Text allowFontScaling= {false} style={[CommonStyles.defaultTextblue, CommonStyles.textRight, CommonStyles.font16]}>
                {I18n.t('OK')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    )
  }
}
