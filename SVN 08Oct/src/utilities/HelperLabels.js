import {AsyncStorage} from 'react-native'
import I18n from './i18n'

// Wrapper function to set language for Screen Labels
setLanguage = () => {
  AsyncStorage.getItem('languageFormat').then((response) => {
    I18n.locale = response
  })
}

// Constant Screen Labels

const AVG = () => {
  this.setLanguage()
  return I18n.t('Avg')
}

const ALERT = () => {
  this.setLanguage()
  return I18n.t('Alert')
}

const SET = () => {
  this.setLanguage()
  return I18n.t('Set')
}

const DETECTION = () => {
  this.setLanguage()
  return I18n.t('Detection')
}

const TIME = () => {
  this.setLanguage()
  return I18n.t('Time')
}

const OK = () => {
  this.setLanguage()
  return I18n.t('OK')
}

const CANCEL = () => {
  this.setLanguage()
  return I18n.t('Cancel')
}

// Constant FEEDBACK URL

const FEEDBACK_URL_EN = "https://docs.google.com/forms/d/e/1FAIpQLScRMEUdnByw3lUQgVYhnDyzXwyAro04cFjfwon-uf6-2MCcvg/viewform"
const FEEDBACK_URL_FR = "https://docs.google.com/forms/d/e/1FAIpQLSduac7dZ84Qo1YKySq6NxXYVM03jjUUtuoT1IuKuWfNfREatA/viewform"

// Constant USER GUIDE URL
const USER_GUIDE_URL_EN = "https://www.hme.com/techPDFs/400G781A/400G781A.html"
const USER_GUIDE_URL_FR = "https://www.hme.com/techPDFs/400G781FA/400G781FA.html"

// Constant IMAGE LOGO URL
const BG_URL = require('./../assets/background.png')
const HME_S_LOGO = require('./../assets/HME_Sub_Logo.png')
const HME_F_LOGO = require('./../assets/HME_Logo.png')

const STORE_NUMBER = 'storenumber'
const STORE_NAME = 'storename'

const TOTAL = 'total'
const CAR_COUNT = 'carcount'

export {
        AVG, ALERT, SET, TOTAL, CAR_COUNT,
        DETECTION, TIME, STORE_NAME, STORE_NUMBER,
        FEEDBACK_URL_FR, FEEDBACK_URL_EN, OK, CANCEL,USER_GUIDE_URL_EN,
        BG_URL, HME_S_LOGO, HME_F_LOGO,
        USER_GUIDE_URL_FR
      }
