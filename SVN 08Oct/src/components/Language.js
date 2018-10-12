import React from 'react';
import { TouchableOpacity, Keyboard, AsyncStorage, StatusBar, View, Text, ImageBackground } from 'react-native';
import CommonStyles from './../stylesheets/CommonStyles'
import {Actions} from 'react-native-router-flux'
import I18n from './../utilities/i18n'
import {PUSH_MANAGER} from "./PushManager"

export default class Language extends React.Component {
	constructor(props) {
    super(props)
    this.state = {
      language :props.language
    }
  }

	componentWillMount () {
		//On mounting internationalization will take place according the language
		I18n.locale = this.state.language
		//Keyboard dismisses
    Keyboard.dismiss()
		PUSH_MANAGER()
	}

	/*Selecting English language*/
	onEnglish = () => {
		I18n.locale = "en-GB"
		this.setState({language:"en-GB"})
	}

	/*Selecting French language*/
	onFrench = () => {
		I18n.locale = "fr-FR"
		this.setState({language:"fr-FR"})
	}

	/*Navigating to Leader Board*/
	navigateLeaderBoard =()=>{
		AsyncStorage.setItem("languageFormat", this.state.language).then((response)=>{
			Actions.leaderBoard({language : this.state.language})
		})
	}

	/*It renders the UI*/
	render() {
		return (
			<ImageBackground source={require('./../assets/background.png')}
				style={[CommonStyles.backImage]}>
				<StatusBar barStyle='light-content' hidden={false} />
				<View style={CommonStyles.autoCenter}>
					<View style={CommonStyles.centerlistLanguage}>
						<Text allowFontScaling ={false}
							style={[CommonStyles.userColor,CommonStyles.font20,CommonStyles.justifyCenterContent,CommonStyles.mB15,CommonStyles.textCenter]}>
								{I18n.t('Navigation Language')}
						</Text>
						<TouchableOpacity onPress = {this.onEnglish}>
							<Text allowFontScaling ={false}
								style={this.state.language =="en-GB" ? [CommonStyles.timeTextSelected]:[CommonStyles.timeText]}>
								English
							</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress = {this.onFrench}>
							<Text allowFontScaling ={false}
								style={this.state.language =="fr-FR" ? [CommonStyles.timeTextSelected]:[CommonStyles.timeText]}>
								French
							</Text>
						</TouchableOpacity>
						<View style={{flexDirection:"row",justifyContent:"flex-end"}}>
							<TouchableOpacity style = {[{paddingBottom:20,paddingRight:20,}]}
								onPress={this.navigateLeaderBoard}>
	              <Text allowFontScaling ={false}
									style={[CommonStyles.defaultTextblue,CommonStyles.textRight,
	                        CommonStyles.font16]}>
	                {I18n.t('OK')}
	              </Text>
	            </TouchableOpacity>
							<TouchableOpacity style = {[{paddingBottom:20,paddingRight:20,}]}
								onPress={() => { Actions.pop() }}>
	              <Text allowFontScaling ={false}
									style={[CommonStyles.defaultTextblue,CommonStyles.textRight,
	                        CommonStyles.font16]}>
	                {I18n.t('Cancel')}
	              </Text>
	            </TouchableOpacity>
						</View>
					</View>
				</View>
			</ImageBackground>
		)
	}
}
