import {AsyncStorage} from 'react-native'
import I18n from './i18n'

// Wrapper function to set language for messages
setLanguage = () => {
  AsyncStorage.getItem('languageFormat').then((response) => {
    I18n.locale = response
  })
}


// Constant error and Success Messages

const RECOMMENDATION_MSG = () => {
  this.setLanguage()
  return I18n.t('Would you recommend this app to your friends and co-workers ?')
}

const CATCH_ERROR_MSG = () => {
  this.setLanguage()
  return I18n.t('Sorry, there was a problem with your request')
}

const NOT_VALID_MSG = () => {
  this.setLanguage()
  return I18n.t('Not Valid')
}

const NO_DATA = () => {
  this.setLanguage()
  return I18n.t('No Data Available')
}

const FORGET_PWD = () => {
  return 'Forgot Password?'
}

const INVALID_UNAME_PWD = () => {
  return 'Invalid username or password'
}

const SERVER_ERROR_MSG = () => {
  return 'Sorry there was problem with your request'
}

const OBJ_REF_ERROR = () => {
  this.setLanguage()
  return I18n.t('Object reference not set to an instance of an object')
}

const INVALID_CRED = () => {
  return 'Invalid credentials'
}

const TRY_AGN_LTR = () => {
  return "Try again Later"
}

const FILL_RELVNT_DETAILS = () => {
  return "Please fill the relevant details"
}

const NO_DECIMAL = () => {
  return "Decimal not allowed"
}

const NO_NEGATIVE = () => {
  return "Negative number not allowed"
}

const NO_COMMA = () => {
  return "Comma not allowed"
}


const NO_PARENTHISIS = () => {
  return "Parenthesis not allowed"
}


const NO_PLUS = () => {
  return "Positive Sign not allowed"
}


const NO_ASTERIKS = () => {
  return "Asteriks not allowed"
}

const NO_HASH = () => {
  return "Hash not allowed"
}


const NO_DOLLAR = () => {
  return "Dollar not allowed"
}

const NO_P = () => {
  return "P not allowed"
}

const NO_W = () => {
  return "W not allowed"
}
const NO_SPACE = () => {
  return "Please remove the space"
}

// Constant error and Success http Codes

const CODE_200 = 200
const CODE_498 = 498
const CODE_401 = 401
const CODE_500 = 500

const APP_VERSION = 1.3

const storeVasu = [
{
    "Daypart": {
        "StartTime": 72000,
        "EndTime": 367200,
        "Car": 330,
        "Total": 89,
        "DetectorData": "{\"MenuBoard\":28.5090909090909,\"Service\":27.2878787878788,\"Greet\":28.5090909090909}"
    },
    "StoreUID": "407653BFBB1F42108B77D22BB5FD9DB6",
    "GroupID": 0,
    "GroupName": null,
    "StoreNumber": "9989",
    "StoreName": "CU50(DUAL)",
    "CompanyUID": "MO16B7Y2BNV2A6XFB8UXAXOQLHY97X9F",
    "TimeZone": null,
    "IsSimulated": false
},
{
    "Daypart": {
        "StartTime": 72000,
        "EndTime": 367200,
        "Car": 280,
        "Total": 223,
        "DetectorData": "{\"Cashier\":18.525,\"Presenter\":17.85,\"Order Point 1\":10.625,\"Order Point 2\":7.91428571428571}"
    },
    "StoreUID": "E932B20793CA47E0AB7D160EE3464EB9",
    "GroupID": 0,
    "GroupName": null,
    "StoreNumber": "55555",
    "StoreName": "'Até ™®©ÈÉËÀëæåäãóõöè",
    "CompanyUID": "MO16B7Y2BNV2A6XFB8UXAXOQLHY97X9F",
    "TimeZone": null,
    "IsSimulated": false
},
{
    "Daypart": {
        "StartTime": 72000,
        "EndTime": 367200,
        "Car": 164,
        "Total": 171,
        "DetectorData": "{\"Cashier\":27.1951219512195,\"MenuBoard\":29.4634146341463,\"Greet 1\":29.4634146341463}"
    },
    "StoreUID": "47305B8DBBB245D199E693C28DD5F366",
    "GroupID": 0,
    "GroupName": null,
    "StoreNumber": "767",
    "StoreName": "This is My Name",
    "CompanyUID": "MO16B7Y2BNV2A6XFB8UXAXOQLHY97X9F",
    "TimeZone": null,
    "IsSimulated": false
},
{
    "Daypart": {
        "StartTime": 21600,
        "EndTime": 343800,
        "Car": 959,
        "Total": 88,
        "DetectorData": "{\"MenuBoard\":28.400417101147,\"Service\":27.8978102189781,\"Greet\":28.400417101147}"
    },
    "StoreUID": "C12BF7E3C4014717BE831F7C65E6586C",
    "GroupID": 0,
    "GroupName": null,
    "StoreNumber": "1589",
    "StoreName": "Big Fat Zero",
    "CompanyUID": "MO16B7Y2BNV2A6XFB8UXAXOQLHY97X9F",
    "TimeZone": null,
    "IsSimulated": false
}
]

const daypartMultiData = {
  "dayPart":{
    "Total": {
      "avg":"87.80952",
      "alert":{}
    },
    "CarCount":{
      "avg":"21",
      "alert":{}
    }
  }
}

const dayPSingleStoreData = {
  dayPart:
	{ CarCount:
		{ avg: '0',
		 alert:
			{ threshold: '23',
				isOn: 'False',
				HowOften: '2',
				RepeatAlert: 'True',
				Dndfrom:"08.30",
				Dndto:"09.30",
				listTimeRange:[
					{ TimeRangeFrom: '00:00', TimeRangeTo: '22:00' },
					{ TimeRangeFrom: '22:00', TimeRangeTo: '00:00' }
				]
			}
		},
	Total:
	{ avg: '0',
	 alert:
			{ threshold: '13',
				isOn: 'True',
				HowOften: '1',
				RepeatAlert: 'False',
				Dndfrom:"08.30",
				Dndto:"09.30",
				listTimeRange:[
					{ TimeRangeFrom: '00:00', TimeRangeTo: '22:00' },
					{ TimeRangeFrom: '22:00', TimeRangeTo: '00:00' }
				]
			} },
	Service:
	{ avg: null,
	 alert:
			{ threshold: '43',
				isOn: 'True',
				HowOften: '4',
				RepeatAlert: 'True',
				Dndfrom:"",
				Dndto:"",
				listTimeRange:[
					{ TimeRangeFrom: '00:00', TimeRangeTo: '22:00' },
					{ TimeRangeFrom: '22:00', TimeRangeTo: '00:00' }
				]
			} },
	Menu1:
	{ avg: null,
    alert:
			{ threshold: '53',
				isOn: 'True',
				HowOften: '8',
				RepeatAlert: 'True',
				Dndfrom:"08.30",
				Dndto:"13.30",
				listTimeRange:[
					{ TimeRangeFrom: '00:00', TimeRangeTo: '22:00' },
					{ TimeRangeFrom: '22:00', TimeRangeTo: '00:00' }
				]
			} } } }


const hourSingleStoreData = {
        hour:
      	{ CarCount:
      		{ avg: '0',
      		 alert:
      			{ threshold: '23',
      				isOn: 'False',
      				HowOften: '2',
      				RepeatAlert: 'True',
      				Dndfrom:"08.30",
      				Dndto:"09.30",
      				listTimeRange:[
      					{ TimeRangeFrom: '00:00', TimeRangeTo: '22:00' },
      					{ TimeRangeFrom: '22:00', TimeRangeTo: '00:00' }
      				]
      			}
      		},
      	Total:
      	{ avg: '0',
      	 alert:
      			{ threshold: '13',
      				isOn: 'True',
      				HowOften: '1',
      				RepeatAlert: 'False',
      				Dndfrom:"08.30",
      				Dndto:"09.30",
      				listTimeRange:[
      					{ TimeRangeFrom: '00:00', TimeRangeTo: '22:00' },
      					{ TimeRangeFrom: '22:00', TimeRangeTo: '00:00' }
      				]
      			} },
      	Services:
      	{ avg: null,
      	 alert:
      			{ threshold: '43',
      				isOn: 'True',
      				HowOften: '4',
      				RepeatAlert: 'True',
      				Dndfrom:"",
      				Dndto:"",
      				listTimeRange:[
      					{ TimeRangeFrom: '00:00', TimeRangeTo: '22:00' },
      					{ TimeRangeFrom: '22:00', TimeRangeTo: '00:00' }
      				]
      			} },
      	Menus:
      	{ avg: null,
          alert:
      			{ threshold: '53',
      				isOn: 'True',
      				HowOften: '8',
      				RepeatAlert: 'True',
      				Dndfrom:"08.30",
      				Dndto:"13.30",
      				listTimeRange:[
      					{ TimeRangeFrom: '00:00', TimeRangeTo: '22:00' },
      					{ TimeRangeFrom: '22:00', TimeRangeTo: '00:00' }
      				]
      			} } } }



const daySingleStoreData = {
        day:
      	{ CarCount:
      		{ avg: '0',
      		 alert:
      			{ threshold: '23',
      				isOn: 'False',
      				HowOften: '2',
      				RepeatAlert: 'True',
      				Dndfrom:"08.30",
      				Dndto:"09.30",
      				listTimeRange:[
      					{ TimeRangeFrom: '00:00', TimeRangeTo: '22:00' },
      					{ TimeRangeFrom: '22:00', TimeRangeTo: '00:00' }
      				]
      			}
      		},
      	Total:
      	{ avg: '0',
      	 alert:
      			{ threshold: '13',
      				isOn: 'True',
      				HowOften: '1',
      				RepeatAlert: 'False',
      				Dndfrom:"08.30",
      				Dndto:"09.30",
      				listTimeRange:[
      					{ TimeRangeFrom: '00:00', TimeRangeTo: '22:00' },
      					{ TimeRangeFrom: '22:00', TimeRangeTo: '00:00' }
      				]
      			} },
      	Services:
      	{ avg: null,
      	 alert:
      			{ threshold: '43',
      				isOn: 'True',
      				HowOften: '4',
      				RepeatAlert: 'True',
      				Dndfrom:"",
      				Dndto:"",
      				listTimeRange:[
      					{ TimeRangeFrom: '00:00', TimeRangeTo: '22:00' },
      					{ TimeRangeFrom: '22:00', TimeRangeTo: '00:00' }
      				]
      			} },
      	Menus:
      	{ avg: null,
          alert:
      			{ threshold: '53',
      				isOn: 'True',
      				HowOften: '8',
      				RepeatAlert: 'True',
      				Dndfrom:"08.30",
      				Dndto:"13.30",
      				listTimeRange:[
      					{ TimeRangeFrom: '00:00', TimeRangeTo: '22:00' },
      					{ TimeRangeFrom: '22:00', TimeRangeTo: '00:00' }
      				]
      			} } } }


export {
        CODE_200, CODE_498, CODE_500, CODE_401,
        NO_DOLLAR, NO_P, NO_W,
        NO_NEGATIVE, NO_PLUS,
        NO_ASTERIKS, NO_SPACE,
        NO_DECIMAL, NO_PARENTHISIS, NO_HASH,
        FILL_RELVNT_DETAILS, NO_COMMA,
        TRY_AGN_LTR,
        RECOMMENDATION_MSG,
        OBJ_REF_ERROR,
        CATCH_ERROR_MSG,
        NOT_VALID_MSG,
        NO_DATA, storeVasu, daypartMultiData, dayPSingleStoreData, hourSingleStoreData, daySingleStoreData,
        FORGET_PWD,APP_VERSION,
        INVALID_UNAME_PWD,
        SERVER_ERROR_MSG, INVALID_CRED }
