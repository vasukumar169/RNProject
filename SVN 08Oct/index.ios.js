import { AppRegistry, Text } from 'react-native';
import App from './App';
Text.defaultProps.allowFontScaling = false
AppRegistry.registerComponent('HM', () => App);
