import React, { Component } from 'react';
import './../../App.css';
import logo from './../../assets/images/logo.png';
/* hme-cloud-pulse-logo */
import hme_cloud_pulse_Logo from './../../assets/images/hme_cloud_pulse_Logo.png';
/* Footer Component */
import Footer from './../../components/footer';

/* Header Component */
import Header from './../../components/header';

/* Progress Loader */
import { ActivityLoader } from './../../utilities/activityLoader';

/* API Services start*/
import { connectCU50Service } from './../../services/APIRequest';
/* API Services End*/

/* Auto Logout */
import { SESSION_TIMEOUT } from './../../utilities/sessionTimeout';

export default class ConnectCU50 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serialNumber: "",
      showError: false,
      isEmptyInputMessage: "",
      isAnimated : false
    }
  }

  componentWillMount() {
    // CHECK_VALID_USER(this.props);
  }

  componentDidMount () {
    let { path, location, history, onClick } = this.props;   
    if(history.action === 'POP') {
      if(location.pathname==`${path}/storeSelect`) {
        onClick(1)
      } 
    }
    SESSION_TIMEOUT()
  }

  componentWillReceiveProps(nextProps) {}


  /*Enter text input Field*/
  handleInputField = (e) => {
    if (e.target.id === 'serialno') {
      this.setState({
        serialNumber : e.target.value.trim(),
        showError : false
      })
    }
  }

  /*On clicking Connect button*/
  onConnectClick = () => {
    let { serialNumber } = this.state
    let { onClick } = this.props;
    if(serialNumber=="") {
      this.setState({
        showError : true,
        isEmptyInputMessage : "Please Fill the Serial Number.",
        isAnimated : false
      })
    }
    else {
      this.setState({
        showError : false,
        isEmptyInputMessage : "",
        isAnimated : true
      })
      connectCU50Service(serialNumber).then((result) => {
        this.setState({
          isAnimated : false
        })
        if(result === "Success") {
          this.setState({
            showError : false,
            isEmptyInputMessage : "",
            isAnimated : false
          })
          localStorage.setItem("serialNo", serialNumber);
          this.props.history.push('/home/storeStatus')
          onClick(2)
        }
        else {
          localStorage.setItem("serialNo", null);
          this.setState({
            showError : true,
            isEmptyInputMessage : "CU - 50 Serial # "+result+".",
          })
        }
      }).catch((err)=>{
        this.setState({
          showError : true,
          isEmptyInputMessage : err,
          isAnimated : false
        })                 
      })      
    }
  }
  /*render function returns UI*/
  render() {
    let { serialNumber, showError, isEmptyInputMessage, isAnimated } = this.state
    
    let customStyles = {marginTop:"25%", marginLeft:"50%"}
    return (
      <div>
        {/*Body Starts*/}
        <div className="clear"></div>

        <div className="services-section spad">
          <div className="container">
            <div className="row rowmargin">
            {
                isAnimated
                ?
                  <ActivityLoader customStyles ={customStyles}  />
                :
                
              <div className="col-md-12 col-sm-12 col-xs-12 lab-card">
                <div className="service">
                  <div className="service-text">
                    <h2 className="boxheader">Select Store</h2>
                    <div className="lab-card">
                      <div className="col-md-1 col-sm-1 col-xs-12"></div>
                        <div className="col-md-10 col-sm-10 col-xs-12">
                            <div className="col-md-4 col-sm-4 col-xs-12">
                              <div className="inputsection">
                                <h4>Serial#</h4>
                              </div>
                            </div>
                            <div className="col-md-4 col-sm-4 col-xs-12">
                              <div className="inputsection">
                                <input onChange={(e)=>this.handleInputField(e)}
                                  type="text" id ="serialno"
                                  value={serialNumber}
                                  className="form-control" />
                              </div>
                            </div>
                            <div className="col-md-4 col-sm-4 col-xs-12">
                              <div className="inputsection">
                                <button onClick = {this.onConnectClick}
                                  className="btn btn-primary">Connect</button>
                              </div>
                            </div>
                          </div>
                      <div className="col-md-1 col-sm-1 col-xs-12"></div>
                      <div className="clear"></div>
                      <div className="col-md-1 col-sm-1 col-xs-12"></div>

                      <div className="col-md-10 col-sm-10 col-xs-12 mrtop">
                        <p className="font16 errorNotification">
                          {
                          showError ?
                          isEmptyInputMessage :
                          ""
                          }
                        </p>
                        <p className="font16" style={{color:"blue"}}>
                          {
                            localStorage.getItem('serialNo') == null || localStorage.getItem('serialNo') == "null" 
                            ?
                            "" 
                            :
                            <b>
                              Status : We are connected to Serial# {localStorage.getItem('serialNo')}.
                            </b>
                          }
                        </p>
                      </div>

                      <div className="col-md-1 col-sm-1 col-xs-12"></div>
                      <div className="clear"></div>
                      <div className="col-md-1 col-sm-1 col-xs-12"></div>
                      <div className="col-md-10 col-sm-10 col-xs-12 mrtop"></div>
                      <div className="col-md-1 col-sm-1 col-xs-12"></div>
                      <div className="clear"></div>

                    </div>
                  </div>
                </div>
              </div>
            }
            </div>
          </div>
        </div>
        {/*Body Ends*/}
      </div>
    );
  }
}
