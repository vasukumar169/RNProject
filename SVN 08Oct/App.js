import React from 'react';
/***********************************************************/
/*Including the whole screens Components for routes*/
import ForgotPassword from './src/components/ForgotPassword';
import LeaderBoard from './src/components/LeaderBoard';
import ConfigAlert from './src/components/ConfigAlert';
import About from './src/components/About';
import Feedback from './src/components/Feedback';
import Userguide from './src/components/Userguide';
import Settings from './src/components/Settings';
import Language from './src/components/Language';
import TimeFormat from './src/components/TimeFormat';
import Login from './src/components/Login';
import StoreBoard from './src/components/StoreBoard';
import MultiStoreBoard from './src/components/MultiStoreBoard';
import {PUSH_MANAGER} from "./src/components/PushManager"
/***********************************************************/
/*RN Library for routing*/
import {Scene, Router, Stack, Actions} from 'react-native-router-flux'

import {AsyncStorage, Alert} from 'react-native'
import DeviceInfo from 'react-native-device-info'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      logged: false,
      loading: true,
    }
  }

  componentDidMount() {
    /*Manangement of route by checking the availablity of JWT and setting the status to redirect to particular screen*/
    AsyncStorage.getItem("JWT").then((response)=>{
			if (response != null) {
				this.setState({logged: true, loading: false},()=>{
          PUSH_MANAGER()
        });

      }
			else {
        this.setState({logged: false, loading: false},()=>{
          PUSH_MANAGER()
        });
			}
		}).catch((error)=>{
			this.setState({logged: false, loading: false});
		})
  }

  render() {
    if (this.state.loading) {
      return null;
    }
    return (
			<Router>
      <Stack key="root"  hideNavBar={true} panHandlers={null}>
        {
          this.state.logged
          ?

            <Scene initial={true} key="leaderBoard" component={LeaderBoard} />

          :
  					<Scene initial={true} key="login" component={Login} />

        }
          <Scene key="login" component={Login} />
          <Scene key="forgotpassword" component={ForgotPassword} />
          <Scene key="leaderBoard" component={LeaderBoard} />
          <Scene key="about" component={About} />
          <Scene key="feedback" component={Feedback} />
          <Scene key="userguide" component={Userguide} />
          <Scene key="setting" component={Settings} />
          <Scene key="storeBoard" component={StoreBoard} />
          <Scene key="multiStoreBoard" component={MultiStoreBoard} />
          <Scene key="language" component={Language} />
          <Scene key="configAlert" component={ConfigAlert} />
          <Scene key="timeFormat" component={TimeFormat} />
        </Stack>
			</Router>
    );
  }
}
