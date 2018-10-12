import React from 'react';
import { TouchableOpacity, AsyncStorage, Keyboard, StatusBar, View, Text, ImageBackground } from 'react-native';
import CommonStyles from './../stylesheets/CommonStyles'
import {Actions} from 'react-native-router-flux'
import I18n from './../utilities/i18n'
import {PUSH_MANAGER} from "./PushManager"

export default class TimeFormat extends React.Component {
	constructor(props) {
    super(props)
    this.state = {
      timeFormat :""
    }
  }

	componentWillMount () {
		Keyboard.dismiss();
   	PUSH_MANAGER()
  }

	componentDidMount () {
		//when mounted internationalization will take place according the language
		I18n.locale = this.props.language
		//Fetching username and setting its value so that on navigation we receive the value
		AsyncStorage.getItem("uName").then((response)=>{
			this.setState({userName : response})
		})
		//Fetching time format and setting its value
    AsyncStorage.getItem("TF").then((response)=>{
			this.setState({timeFormat : response})
    })
  }

	//Setting Time format and navigating to dashboard
	setTimeFormat =()=>{
		AsyncStorage.setItem("TF", this.state.timeFormat).then((response)=>{
			Actions.leaderBoard({userName:this.state.userName})
		})
	}

	/*It renders the UI*/
	render() {
		return (
				<ImageBackground  source={require('./../assets/background.png')}
													style={[CommonStyles.backImage]}>
					<StatusBar barStyle='light-content' hidden={false} />
					<View style={CommonStyles.autoCenter}>
						<View style={[CommonStyles.centerlistLanguage,{height: 200,width: 250}]}>
							<Text allowFontScaling ={false} style={[CommonStyles.flatListRenderRowTextColor,CommonStyles.font20,CommonStyles.justifyCenterContent,CommonStyles.mB15,CommonStyles.textCenter]}>
									{I18n.t('Time Format')}
							</Text>
							<TouchableOpacity onPress={()=>{this.setState({timeFormat:"seconds"})}}>
								<Text allowFontScaling ={false} style={this.state.timeFormat == "seconds" ? [CommonStyles.timeTextSelected]:[CommonStyles.timeText]}>
									{I18n.t('Seconds')}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={()=>{this.setState({timeFormat:"minutes"})}}>
								<Text allowFontScaling ={false} style={this.state.timeFormat == "minutes" ? [CommonStyles.timeTextSelected]:[CommonStyles.timeText]}>
									{I18n.t('Minutes:Seconds')}
								</Text>
							</TouchableOpacity>
							<View style={{flexDirection:"row",justifyContent:"flex-end"}}>
						<TouchableOpacity style = {[{paddingBottom:20,paddingRight:20,}]}
															onPress={this.setTimeFormat}>
              <Text allowFontScaling ={false} style={[
                            CommonStyles.defaultTextblue,CommonStyles.textRight,
                            CommonStyles.font16]}>
                {I18n.t('OK')}
              </Text>
            </TouchableOpacity>
						<TouchableOpacity style = {[{paddingBottom:20,paddingRight:20,}]}
															onPress={() => { Actions.pop() }}>
              <Text allowFontScaling ={false} style={[
                            CommonStyles.defaultTextblue,CommonStyles.textRight,
                            CommonStyles.font16]}>
                {I18n.t('Cancel')}
              </Text>
            </TouchableOpacity>
						</View>
						</View>
					</View>
				</ImageBackground>
		);
	}
}
