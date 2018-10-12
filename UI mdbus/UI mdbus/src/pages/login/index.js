import React, { Component } from 'react';
import './../../App.css';
import './index.css';
import logo from './../../assets/images/logo.png';
import hme_cloud_pulse_Logo from './../../assets/images/hme_cloud_pulse_Logo.png';
import { loginService } from './../../services/APIRequest';
import { getFieldError } from './../../utilities/getFieldError';

import { ActivityLoader } from './../../utilities/activityLoader';
import { TIMEOUT_ID } from './../../utilities/sessionTimeout';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailId : "",
      pwd : "",
      isEmptyInput : false,
      isEmptyInputMessage : "",
      isAnimated : false,
    }
  }

  componentDidMount () {
    let { path, location, history } = this.props;
    if(history.action === 'POP') {
      if(location.pathname===`/login`) {
        history.push('/home/storeSelect')
      }
    }
    // SESSION_TIMEOUT()
  }
  
  componentWillUnMount () {
    window.clearTimeout(TIMEOUT_ID);  
  }
  
  /*Enter Text input Field*/
  handleInputField = (e) => {
    if (e.target.id === 'email') {
      this.setState({emailId : e.target.value})
    }
    if (e.target.id === 'password') {
      this.setState({pwd : e.target.value})
    }
  }

  /*On Clicking Login Button*/
  
  handleSubmit = () => {
    let { emailId, pwd, isAnimated } = this.state
    if(emailId === "" || pwd === "") {
      this.setState({
        isEmptyInput : true,
        isEmptyInputMessage : "Please Fill the Details"
      })
    }
    if(emailId !== "" && pwd !== "")
    {
      this.setState({
        isAnimated : true
      })
      loginService (emailId, pwd).then((result)=>{
        if(result.statusMessage === "Logged in successfully") {
          localStorage.setItem("jwtToken", result.jwtToken);
          this.setState({
            isEmptyInput : false,
            isEmptyInputMessage : "",
            isAnimated : false
          })
          this.props.history.push('/home/storeSelect')
        }
        else {
          this.setState({
            isEmptyInput : true,
            isEmptyInputMessage : result,
            isAnimated : false
          })
          localStorage.clear()
        }
      }).catch((er)=>{
        this.setState({
          isEmptyInput : true,
          isEmptyInputMessage : "Network Error",
          isAnimated : false
        })
      })
    }
  }


  /*Setting credentials in cookie*/
  setCookie = (cname, cvalue, cpass, cpvalue, exdays) => {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + "," + expires + ";path=/";
    document.cookie = cpass + "=" + cpvalue + "," + expires + ";path=/";
  }

  renderLoginUI = () => {
    let { emailId, pwd, isEmptyInputMessage, isAnimated } = this.state
    let uname = "email"
    let pass = "password"
    return (
      <div className="panel panel-info loginbox">
        <div className="panel-body formpaddingtop">
          <div style={{display:"none"}} id="login-alert" className="alert alert-danger col-sm-12">
          </div>
          <div>
            <img alt = "Logo" id="logo-img" className="logo-card" src={logo} />
          </div>
          <div className="clear">
          </div>
          <div>
            <img alt = "HME Pulse Logo" id="logo-img-logotype" className="logo-type" src={hme_cloud_pulse_Logo}/>
          </div>
          <div className="clear">
          </div>
          <div id="loginform" className="form-horizontal">
            <div className="input-group checkboxes textboxes">
              <span className="input-group-addon input-group-addon_new">
                <i className="fa fa-envelope-o"></i>
              </span>
              <input onChange = {(e)=>this.handleInputField(e)} id="email"
                type="text" value = {emailId}
                className="form-control textinput-control_pass"
                name="email" placeholder="EMAIL" />
            </div>
            <div className="clear">
            </div>
            <div className="input-group checkboxes textboxes">
              <span className="input-group-addon input-group-addon_new">
                <i className="fa fa-unlock-alt"></i>
              </span>
              <input onChange = {(e)=>this.handleInputField(e)}
                id="password" type="password" value = {pwd}
                className="form-control textinput-control_pass"
                name="password" placeholder="PASSWORD" />
            </div>
            <div className="clear">
            </div>

            <div className="input-group textboxes remember mrtop">
              <div className="checkbox">
                <label>
                  <input id="login-remember"
                    type="checkbox"
                    onClick ={()=>{this.setCookie(uname,emailId,pass,pwd,4)}}
                    name="remember"
                    value="1" /> Remember me
                </label>
              </div>
            </div>
            {/*
            <div className="input-group textboxes forgetpassword mrtop">
              <span className="forget">
                <a href="" target="_blank"/>Forget Password ?
              </span>
            </div>
            */}
            <div className="clear">
            </div>
            <div className="form-group">
              <div className="col-sm-12 controls">
                <div onClick = {this.handleSubmit} id="btn-fblogin" className="btn btn-default btn-lg btn-block login_btn">
                  LOGIN
                </div>
                <div className="text-center mTop10">
                  <span className="font16">
                    {getFieldError(isEmptyInputMessage)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

/*render function returns UI*/

  render() {
    let { isAnimated } = this.state
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-4 col-sm-2 col-xs-12"></div>
          <div id="loginbox" className="mainbox col-md-4 col-sm-8 col-xs-12 topmargin">
          {
            isAnimated
            ?
            <ActivityLoader/>
            :
            this.renderLoginUI()
          }
          </div>
          <div className="col-md-4 col-sm-2 col-xs-12"></div>
        </div>
      </div>
    );
  }
}
