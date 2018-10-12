import React, { Component } from 'react';
/* CSS Design class */
import './../../App.css';
import logo from './../../assets/images/logo.png';
/* hme-cloud-pulse-logo */
import hme_cloud_pulse_Logo from './../../assets/images/hme_cloud_pulse_Logo.png';
/* dynamic field error */
import {getFieldError} from './../../utilities/getFieldError';
import {EXTENDED_CTRL_MSG} from './../../utilities/constants';
/* Footer */
import Footer from './../../components/footer';
/* Custom Table */
import CustomTable from './../../components/customTable';

/* API Services start*/
import { modCommandService } from './../../services/APIRequest';
import { getModCmdService } from './../../services/APIRequest';
/* API Services end */

/* Progress Loader */
import { ActivityLoader } from './../../utilities/activityLoader';

/* Drop Down Mod cmd  options */
import { MOD_CMD_OPTIONS } from './../../utilities/constants';

/* Data time interval */
import { DATA_TIME_INTERVAL } from './../../utilities/constants';

let modComndObject = {}

export default class Cmd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isData : false,
      isAnimated : false,
      tabName : "CMD",
      Register : "",
      Control : "Counter Enable",
      DataValue :"",
      isSent : false,
      isEmpty : false
    }
  }

  componentWillMount() {
  }

  componentDidMount () {
    let { path, location, history, onClick } = this.props;
    if(history.action === 'POP') {
      if(location.pathname==`${path}/cmd`) {
        onClick(5)
      }
    }
  }

  WriteControlCode = () => {
    let {Control, DataValue } = this.state
    modComndObject["ControlCode"] = Control
    if(localStorage.getItem('nodeId') ==  null) {
      
      this.setState({
        isEmpty : true
      })
      alert("Node Id Required")
    }
    else {
      if(DataValue=="") {
        this.setState({
          isEmpty : true
        })
        this.getExtendedControlData()
      }
      else {
        modComndObject["Cu50No"] = localStorage.getItem('serialNo')
        modComndObject["DeviceId"] = localStorage.getItem('nodeId')
        this.setState({
          isAnimated : true,
          isEmpty : false
        })
        modCommandService(modComndObject).then((result)=>{
          if(result.statusMessage === "Success") {
            this.setState({
              isSent : true,
              isEmpty : false
            })
            setTimeout(this.getExtendedControlData,DATA_TIME_INTERVAL)
          }
          else {
            this.setState({
              isAnimated : false,
              isSent : false,
              isEmpty : false
            })
            console.log(result)
          }
        }).catch((err)=>{
          this.setState({
            isAnimated : false,
            isSent : false,
            isEmpty : false
          })
          console.log(err)
        })
      }
    }
  }

  onDummyClick = (dummyData) => {}

  getExtendedControlData = () => {
    let { Control } = this.state
    this.setState({
      isAnimated : true
    })
  getModCmdService(Control).then((result) => {
    if(result.statusMessage === "Success") {
      this.setState({
        data : result.data,
        isAnimated : false,
        isError : false,
        isData : true,
        isErrorMsg :""
      })
    }
    else {
      this.setState({
        isAnimated : false,
        isData : false
      })
    }
  }).catch((er)=>{
    this.setState({
      ErrorMessage : "Network Error",
      isAnimated : false,
      isData : false
    })
  })  
  }
  
  /*Enter Text input Field*/
  handleInputField = (e) => {
    if (e.target.id === 'DataValue') {
      this.setState({DataValue : e.target.value},()=>{
        modComndObject["Data"] = this.state.DataValue
      })
    }
  }
  /*Enter Drop down Field*/
  handleSelectField = (e) => {
    this.setState({Control : e.target.value},()=>{
        modComndObject["ControlCode"] = this.state.Control
    })
  }
  
  render() {
    let { isAnimated, tabName, isData, isSent, Control, DataValue, data } = this.state
    let customStyles = {marginTop:"25%", marginLeft:"50%"}
    return (
      <div>
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
                    <h2 className="boxheader">
                      Extended Controls
                      <span>
                        {localStorage.getItem('nodeId') == 0 ? "Gateway" : "Node "+localStorage.getItem('nodeId')}
                      </span>
                    </h2>
                  {
                      localStorage.getItem("serialNo") === null
                      ?
                      "No Store Connected."
                      :
                      localStorage.getItem('nodeId') == null 
                      ?
                      "No Device Connected."
                      :
                    <div className="lab-card">
                      <div className="col-md-1 col-sm-1 col-xs-12" />
                      <div className="col-md-10 col-sm-10 col-xs-12">
                        <div className="col-md-4 col-sm-4 col-xs-12">
                          <div className="inputsection">
                            <h4>Control Code</h4>
                            <div className="clear" />
                            <select className="form-control"
                              value={Control}  
                              style={{marginTop:8}}
                              onChange={(e) => this.handleSelectField(e)}>
                            { MOD_CMD_OPTIONS.map((value, index)=>{
                              return(
                                <option key={index} value={value.value}>
                                  {value.name}
                                </option>  
                              )
                            })                              
                            }
                            </select>
                          </div>
                        </div>
                        <div className="col-md-4 col-sm-4 col-xs-12">
                          <div className="inputsection">
                            <h4>Data</h4>
                            <div className="clear"/>
                            <input type="text"
                              onChange = {(e)=>this.handleInputField(e)}
                              id="DataValue"
                              value={DataValue}
                              className="form-control" />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-1 col-sm-1 col-xs-12" />
                      <div className="clear" />
                      <div className="col-md-1 col-sm-1 col-xs-12" />
                      <div className="col-md-10 col-sm-10 col-xs-12 mrtop">
                        <button className="btn btn-primary"
                          onClick = {this.WriteControlCode}
                          style={{marginTop : 10, marginBottom : 10}}>
                          Send
                        </button>
                      </div>
                      <div className="col-md-1 col-sm-1 col-xs-12" />
                      <div className="clear"/>
                      <div className="col-md-1 col-sm-1 col-xs-12" />
                      <div className="col-md-10 col-sm-10 col-xs-12 mrtop">
                        <p>
                          <strong>
                          Results
                          </strong>
                        </p>
                        <div className="col-md-11 col-sm-10 col-xs-12" style={{width:"98%"}}>
                          <div style={{paddingTop:10,borderWidth : 1, borderStyle : "solid", borderColor :"#ccc", borderRadius : 5}}>
                              <p>
                              {
                                isData ?
                                data.ControlCode+" : "+data.Data+" for CU-50 — "+data.Cu50No 
                                :
                                EXTENDED_CTRL_MSG
                              }
                              </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-1 col-sm-1 col-xs-12" />
                      <div className="clear"/>
                      <div className="col-md-12 col-sm-12 col-xs-12 mrtop"/>
                    </div>
                  }
                  </div>
                </div>
              </div>
            }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
