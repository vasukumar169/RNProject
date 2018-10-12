import React, { Component } from 'react';
import './../../App.css';
/* CSS Design */
import CustomTable from './../../components/customTable';

/* API Services Start */
import { surveyService } from './../../services/APIRequest';
import { getSurveyService } from './../../services/APIRequest';
/* API Services End */

/* Progress Bar */
import { ActivityLoader } from './../../utilities/activityLoader';
/* TIME-INTERVAL FOR SURVEY */
import { DATA_TIME_INTERVAL_SURVEY } from './../../utilities/constants';

export default class Survey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data : [],
      isData : false,
      isAnimated : true,
      tabName : "Survey"
    }
  }

  componentWillMount() {
    // CHECK_VALID_USER(this.props);
  }

  componentDidMount () {
    let { path, location, history, onClick } = this.props;
    this.getSurveyData()
    if(history.action === 'POP') {
      if(location.pathname==`${path}/survey`) {
        onClick(4)
      }
    }
  }

  /*FETCH SURVEY DATA*/
  getSurveyData = () => {
    getSurveyService().then((result)=>{
      if(result.statusMessage === "Success") {
        let newData = result.data.filter(e => e.DeviceId !== '0')
        this.setState({
          data : newData,
          isAnimated : false,
          isData : true,
          isLoadTime : false
        })
      }
      else {
        this.setState({
          isData : false,
          isAnimated : false,
          isLoadTime : false
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

  /*START SURVEY SERVICE*/
  runSurveyService = () => {
    this.setState({
      isAnimated : true,
      isLoadTime : true
    })
    surveyService().then((result)=>{
      if(result.statusMessage === "Success") {
        // this.getSurveyService
        setTimeout(this.getSurveyData, DATA_TIME_INTERVAL_SURVEY)
      }
      else {
        this.setState({
          isData : false,
          isAnimated : false,
          isLoadTime : false
        })
      }
    }).catch((er)=>{
      this.setState({
        isData : false,
        ErrorMessage : "Network Error",
        isAnimated : false,
        isLoadTime : false
      })
    })
  }

  onDummyClick = (data) => {}

  render() {
    let { data, isAnimated, tabName, isData, isLoadTime } = this.state
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
              <div>
                <ActivityLoader customStyles ={customStyles}  />
                <p style = {{textAlign : "center", color :"white"}}>
                  { isLoadTime 
                    ? 
                    "The page might take "+DATA_TIME_INTERVAL_SURVEY/60000+" minutes or more to load."
                    :
                    null
                  }
                </p>
              </div>
              :
              <div className="col-md-12 col-sm-12 col-xs-12 lab-card">
                <div className="service">
                  <div className="service-text">
                    <h2 className="boxheader">
                      Survey
                      <span>Serial : {localStorage.getItem('serialNo')}</span>
                    </h2>
                    <div className="clear"></div>
                    <div className="col-md-2 col-sm-2 col-xs-12 mrtop">
    						      <button className="btn btn-primary" onClick={this.runSurveyService}>
                        Run Site Survey
                      </button>
                    </div>
                    <div className="clear"></div>
	                  <div className="col-md-2 col-sm-2 col-xs-12"></div>
                    <div className="col-md-8 col-sm-8 col-xs-12 lab-card">
                      {
                        isData
                        ?
                        <CustomTable onClick = {this.onDummyClick}
                          tabName = {tabName} data = {data} />
                        :
                          localStorage.getItem("serialNo") === null
                          ?
                          "No Store Connected."
                          :
                        "No Survey Found. Try after sometime."
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
