
const WEB_API_URL = "http://23.100.64.56:8001/"

/*API END POINTS*/

const LOGIN_API_ENDPOINT = "login"
const ACTIVE_DEVICES_API_ENDPOINT = "activeDevices"
const DEVICE_SETTINGS_API_ENDPOINT = "deviceSettings"
const SURVEY_API_ENDPOINT = "packetSurvey"
const GET_SURVEY_API_ENDPOINT = "getPacketSurvey"
const UPDATE_CONFIG_SETTINGS_API_ENDPOINT = "saveSettings"
const CONNECT_CU50_API_ENDPOINT = "connectCu50"
const MODCMND_API_ENDPOINT = "sendControlCode"
const MODCMND_GET_API_ENDPOINT = "getControlStatus"

/*STATUS CODES*/

const STATUS_CODES = [200, 401, 400, 404, 422, 500]

/* SESSION TIMEOUT PERIOD */

const AUTO_LOGOUT_TIME = 900000

/* UPDATING DATA TIME INTERVAL  */
const DATA_TIME_INTERVAL = 30000
let deviceCount = localStorage.getItem('countActiveNodes') == null ? 2 : localStorage.getItem('countActiveNodes')
const DATA_TIME_INTERVAL_SURVEY = deviceCount*60000

const MOD_CMD_OPTIONS = [
  {
    name : "Counter Enable",
    value : "Counter Enable"
  },
  {
    name : "Default Value",
    value : "Default Value"
  },
  {
    name : "Delta",
    value : "Delta"
  },
  {
    name : "Duty Cycle",
    value : "Duty Cycle"
  },
  {
    name : "Enable Flag",
    value : "Enable Flag"
  },
  {
    name : "I/O Config",
    value : "I/O Config"
  },
  {
    name : "I/O Type",
    value : "I/O Type"
  },
  {
    name : "Invert Flag",
    value : "Invert Flag"
  },
  {
    name : "Power Supply #",
    value : "Power Supply"
  },
  {
    name : "Pulse Width",
    value : "Pulse Width"
  },
  {
    name : "Report Type",
    value : "Report Type"
  },
  {
    name : "Serial Address",
    value : "Serial Address"
  },
  {
    name : "Switch Power Voltage",
    value : "Switch Power Voltage"
  },
  {
    name : "Units",
    value : "Units"
  },
  {
    name : "Warm-up Time",
    value : "Warm-up Time"
  },
  {
    name: "Baseline Node",
    value: "Baseline Node",
  },
  {
    name: "Reset Node",
    value: "Reset Node"
  }
]

const EXTENDED_CTRL_MSG = "Update in progress or no data available."
export {
  AUTO_LOGOUT_TIME, DATA_TIME_INTERVAL, MOD_CMD_OPTIONS,
  WEB_API_URL, LOGIN_API_ENDPOINT, DATA_TIME_INTERVAL_SURVEY,
  STATUS_CODES, ACTIVE_DEVICES_API_ENDPOINT,
  DEVICE_SETTINGS_API_ENDPOINT, SURVEY_API_ENDPOINT,
  UPDATE_CONFIG_SETTINGS_API_ENDPOINT,
  CONNECT_CU50_API_ENDPOINT,EXTENDED_CTRL_MSG,
  MODCMND_API_ENDPOINT, GET_SURVEY_API_ENDPOINT, MODCMND_GET_API_ENDPOINT
}
