import React from 'react'
import {ActivityIndicator, View, Text, AsyncStorage} from 'react-native'
import CommonStyles from './../stylesheets/CommonStyles'
import I18n from './../utilities/i18n'

/*This is animating indicator to be used on basis of flag*/

const Loader = (props) => {
  AsyncStorage.getItem('languageFormat').then((response) => {
    I18n.locale = response
  })
  return (
    <View style={[CommonStyles.progressLoaderViewStyle]}>
      <ActivityIndicator
        animating={props.isLoading}
        style={[CommonStyles.activityIndicatorStyle]}
        size='large' />
      <Text  allowFontScaling ={false} style={[{ lineHeight: 30 }, CommonStyles.font20]}> {I18n.t('Loading')} </Text>
    </View>
  )
}

export {Loader}
