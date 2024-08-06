import i18n from 'i18next'
import { en } from './modules/en'
import { zh } from './modules/zh'

i18n
    .init({
        fallbackLng: 'en',
        debug: false,
        interpolation: {
            escapeValue: false,
        },
        resources: {
            en,
            zh,
        },
    })

export default i18n
