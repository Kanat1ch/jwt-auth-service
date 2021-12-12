import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enLanguage from '../locales/en.json'
import ruLanguage from '../locales/ru.json'

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: enLanguage },
            ru: { translation: ruLanguage }
        },
        lng: localStorage.getItem('lang') || 'en',
        fallbackLng: localStorage.getItem('lang') || 'en',
        interpolation: { escapeValue: false }
    })
    
export default i18n