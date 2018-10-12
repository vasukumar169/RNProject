import React, { Component } from 'react';
/* CSS Design class */
import './../../App.css';
import { DATA_TIME_INTERVAL } from './../../utilities/constants';
import CustomTable from './../../components/customTable';
/*API services start*/
import { deviceSettingService } from './../../services/APIRequest';
import { updateConfigSettings } from './../../services/APIRequest';
/*API services end*/
import { ActivityLoader } from './../../utilities/activityLoader';

//Global Variable
let updateSettingsData = {}

export default class NodeStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data : [],
      isData : false,
      isAnimated : true,
      tabName : 'NodeStatus',
      isError : false,
      isErrorMsg :""
    }
  }

  componentWillMount() {}

  componentDidMount () {
    let { path, location, history, onClick } = this.props;  
    this.getDeviceSettings()
    if(history.action === 'POP') {
      if(location.pathname==`${path}/nodeStatus`) {
        onClick(3)
      }
    }
  }  
  
  /* Fetch Device Settings */
  getDeviceSettings = () => {
    this.setState({
      isAnimated : true
    })
    deviceSettingService().then((result) => {
      if(result.statusMessage === "Success") {
        this.setState({
          data : result.data,
          isAnimated : false,
          isData :true,
          isError : false,
          isErrorMsg :""
        })
      }
      else {
        this.setState({
          isData : false,
          isAnimated : false
        })
      }
    }).catch((er)=>{
      this.setState({
        isData : false,
        ErrorMessage : "Network Error",
        isAnimated : false
      })
    })
  }
  onDummyClick = (data) => {}
  
  /*Enter Text input value*/
  onChangeText = (event, rowData) => {
    var label = rowData.LabelName
    updateSettingsData[label] =  event.target.value
  }
  
  /*Click Update Button*/
  updateNodeSettings = () => {
    updateSettingsData['Cu50No'] = localStorage.getItem('serialNo')
    updateSettingsData['DeviceId'] = localStorage.getItem('nodeId')
    this.setState({isAnimated : true})
    updateConfigSettings(updateSettingsData).then((result)=>{
      if(result.statusMessage === "Success") {
        updateSettingsData = {}
        setTimeout(this.getDeviceSettings, DATA_TIME_INTERVAL)
        this.setState({
          isError : false,
          isErrorMsg :""
        })
      }
      else if(result == "Internal Server Error") {
        this.setState({
          isAnimated : false,
          isError : true,
          isErrorMsg : "CU-50 unable to respond. Try again Later"
        })
      }
      else {
        this.setState({
          isAnimated : false,
          isError : true,
          isErrorMsg : "Server Error."
        })
      }
    }).catch((err)=>{
      this.setState({
        isAnimated : false,
        isError : true,
        isErrorMsg : "Check Connection"
      })
    })
  }
  
  /*render function returns UI*/
  render() {
    let { data, isData, isAnimated, tabName, isErrorMsg, isError } = this.state
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
                      Settings
                      <span>
                      {
                        localStorage.getItem('nodeId') === null 
                        ?
                        "No Devices Connected."
                        :
                          localStorage.getItem('nodeId') == 0 
                          ? 
                          "Gateway" 
                          : 
                          "Node " + localStorage.getItem('nodeId') 
                      }
                      </span>
                    </h2>
                    <div className="col-md-2 col-sm-2 col-xs-12"></div>
                    <div className="col-md-8 col-sm-8 col-xs-12 lab-card">
                    { 
                      isData
                      ?
                      <CustomTable tabName = {tabName}
                        onChangeText = {this.onChangeText}
                        onClick = {this.onDummyClick} data = {data} />
                        :
                          localStorage.getItem("nodeId") === null
                          ?
                          "No Devices Connected."
                          :
                        "No Records Found. Refresh the page."
                    }
                    </div>
                    <div className="clear"></div>
                    <div className="col-md-12 col-sm-12 col-xs-12 mrtop" style={{paddingRight:197}}>
                    { 
                        isData
                        ?
                        <button className="btn btn-primary" 
                          onClick = {this.updateNodeSettings}
                          style={{float:"right"}}>
                          Update 
                        </button>
                        :
                        null
                      }
      							</div>
                    <div className="clear"></div>
                    <div className="col-md-12 col-sm-12 col-xs-12 mrtop" style={{paddingRight:197}}>
                    { 
                      isData
                      ?
                      <button className="btn btn-success"  style={{fontSize : 15,marginTop:10,float:"right"}} 
                        onClick = {this.getDeviceSettings} >
                        Refresh
                      </button>
                      :
                      null
                    }                                        
                      <p className= "errorNotification" style={{marginLeft :180}}>
                        {
                          isError ? isErrorMsg+"." : ""
                        }
                      </p>
      							</div>
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
