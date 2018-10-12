import React, { Component } from 'react';
import './../../App.css';
/* CSS Design */
import CustomTable from './../../components/customTable';

/* API Services Start */
import { activeDeviceService } from './../../services/APIRequest';
/* API Services End */

/* Progress Bar */
import { ActivityLoader } from './../../utilities/activityLoader';

export default class StoreStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data : [],
      isData : true,
      isAnimated:true
    }
  }

  componentWillMount() {
    // CHECK_VALID_USER(this.props);
  }

  /*Fetch Active Devices*/
  getActiveNodes = () => {
    activeDeviceService().then((result)=>{
      if(result.statusMessage === "Success") {
        this.setState({
          data : result.data,
          isAnimated : false,
          isData : true,          
        },()=>{
          let count = this.state.data.length -  1
          localStorage.setItem("countActiveNodes",count)
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
  
  componentDidMount () {
    let { path, location, history, onClick } = this.props;  
    this.getActiveNodes()
    if(history.action === 'POP') {
      if(location.pathname==`${path}/storeStatus`) {
        onClick(2)
      }
    }  
  }
  
  /*Call back to click a table row*/
  onTableRowClick = (nodeId) => {
    let { onClick } = this.props;
    localStorage.setItem("nodeId",nodeId.DeviceId)
    this.props.history.push('/home/nodeStatus')
    onClick(3)
  }

  render () {
    
    let { data, isAnimated, isData } = this.state
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
                      Store Status
                      <span>Serial : {localStorage.getItem('serialNo')}</span>
                    </h2>
                    <div className="col-md-2 col-sm-2 col-xs-12"></div>
                    <div className="col-md-8 col-sm-8 col-xs-12 lab-card">
                      {
                        isData
                        ?  
                        <CustomTable onClick = {this.onTableRowClick} data = {data} />
                        :
                          localStorage.getItem("serialNo") === null
                          ?
                          "No Store Connected."
                          :
                        "No Devices Found for this CU-50. Connect to a different Store"
                      }
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-12"></div>
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
