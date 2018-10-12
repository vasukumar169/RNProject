import I18n from 'react-native-i18n'
I18n.fallbacks = true

/* Including Internationalisation Config Files */
I18n.translations = {
  'en': require('./../translations/en'),
  'fr-FR': require('./../translations/fr-FR')
}

export default I18n
