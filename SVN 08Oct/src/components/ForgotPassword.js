import React from 'react';
import {TouchableOpacity,ImageBackground,StatusBar,Image,KeyboardAvoidingView, Keyboard , Text, View, Alert, TextInput  } from 'react-native';
import CommonStyles from './../stylesheets/CommonStyles'
import {Actions} from "react-native-router-flux";
import {forgetPassword} from "./../services/webServices"
import {BG_URL,  HME_F_LOGO, HME_S_LOGO} from "./../utilities/HelperLabels"
import I18n from './../utilities/i18n'
import {CODE_200, CODE_498, CODE_500, CODE_401} from "./../utilities/GenericMessages"

export default class ForgotPassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isUserValid:true,
      userName:"",
      isDefaultRender : true,
    }
  }

  componentWillMount () {
    //On mounting internationalization will take place according the language
    I18n.locale = this.props.language
    //Keyboard dismisses
    Keyboard.dismiss();
  }

  /* Set the value username input value*/
  handleUserName = (text) => {
    this.setState({userName: text})
  }

  /*Web service called for Handling forget password API*/
  handleForgetPasswordAPI = () => {
    forgetPassword(this.state.userName, this.props.language)
    .then((response)=>{
      if(response.status==CODE_200) {
        this.setState({isAnimating:false,isDefaultRender:false,isUserValid:true})
      }
    })
    .catch((error)=>{
      this.setState({isAnimating:false,isDefaultRender:true,isUserValid:false})
    })
  }

  /*validate email as per the requirement*/
  validateEmail = (username) => {
    var emailCheck = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailCheck.test(username);
  };

  /*On Pressing Reset Password Button*/
  handleResetPwd =()=>{
    Keyboard.dismiss();
    if(this.state.userName==""){
      this.setState({isUserValid:false,isDefaultRender:true})
    }
    else {
      if (!this.validateEmail(this.state.userName)) {
        this.setState({isUserValid:false,isDefaultRender:true})
      } else {
        this.handleForgetPasswordAPI()
      }
    }
  }

  /*it Renders the UI*/
  render() {
    return (
    <ImageBackground source={BG_URL} style={{height:"100%"}}>
    <StatusBar barStyle='dark-content'  hidden={false}/>
    {
      this.state.isDefaultRender
      ?
      <View style={[{flex:20}]}>
        <View style= {[,CommonStyles.flexFour,CommonStyles.alignCenter]} >
          <View style= {[CommonStyles.flexFour]}>
            {
              /*Extra Gap managed*/
            }
          </View>
          <View style= {[CommonStyles.flexTwo,CommonStyles.alignCenter]} >
            <Image source={HME_F_LOGO} resizeMode="contain" style={[CommonStyles.flexThree]}/>
          </View>
          <View style= {[CommonStyles.flex4By10]}>
            {
              /*Extra Gap managed*/
            }
          </View>
          <View style= {[CommonStyles.flexTwo]}>
            <Image source={HME_S_LOGO} resizeMode="contain" style={[CommonStyles.flex4By10]}/>
          </View>
        </View>
        <KeyboardAvoidingView style={[CommonStyles.alignCenter,CommonStyles.mTP20,CommonStyles.flexFive]}
          behavior={"padding"} keyboardVerticalOffset={50} >
          <View style={[CommonStyles.containerInput]}>
            <TextInput allowFontScaling= {false}
              onChangeText={this.handleUserName}
              placeholder={I18n.t('Username')}
              placeholderTextColor="#ffffff"
              underlineColorAndroid='transparent'
              value={this.state.userName.trim().toLowerCase()}
              style={[CommonStyles.containerInput,
                      CommonStyles.pL10,
                      CommonStyles.textWhite,
                      CommonStyles.height40,
                      CommonStyles.font16]} />
          </View>
          {
            !this.state.isUserValid
            ?
              <View style={[CommonStyles.mTP2,CommonStyles.customErrorTextView]}>
                <Text allowFontScaling= {false} style={[CommonStyles.fontBold,CommonStyles.errorColor,CommonStyles.font16,CommonStyles.mL5]}>
                  {I18n.t("Username is invalid")}
                </Text>
              </View>
            :
              null
          }
          <View>
            <TouchableOpacity onPress={this.handleResetPwd}
              style={[CommonStyles.mTP3,CommonStyles.resetButton]}>
              <Text allowFontScaling= {false}
                style={[CommonStyles.fontBold,
                        CommonStyles.font16,
                        CommonStyles.loginTextColor,
                        CommonStyles.boxWidth,
                        CommonStyles.textCenter]}>
                {I18n.t("reset password").toUpperCase()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>Actions.pop()}
              style={[CommonStyles.mTP3,CommonStyles.resetButton]}>
              <Text allowFontScaling= {false}
                style={[CommonStyles.fontBold,
                        CommonStyles.font16,
                        CommonStyles.loginTextColor,
                        CommonStyles.boxWidth,
                        CommonStyles.textCenter]}>
                {I18n.t("Cancel").toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
      :
      Alert.alert(
            I18n.t('Check Your email'),
            I18n.t("Password reset link has been sent")+".\n"+I18n.t("Please check your e-mail")+".",
            [
              {
                text:  I18n.t('OK'), onPress: () => {
                  this.setState({isDefaultRender:true},()=>{Actions.login({type:"reset",language:this.props.language})})
                  }
              }
            ]
          )
    }
    </ImageBackground>
	);
  }
}
