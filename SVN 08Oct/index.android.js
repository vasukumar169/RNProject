import { AppRegistry, Text, TextInput } from 'react-native';
import App from './App';
Text.defaultProps.allowFontScaling = false
AppRegistry.registerComponent('HM', () => App);
