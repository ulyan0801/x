import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import zhCN from './locales/zh_CN.json';
import enUS from './locales/en_US.json';
import ruRU from './locales/ru_RU.json'

// 初始化i18n配置
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      zh_CN: { translation: zhCN },
      en_US: { translation: enUS },
      ru_RU: { translation:ruRU}
    },
    fallbackLng: 'zh_CN',
    interpolation: {
      escapeValue: false
    },
    ns: ['translation'],
    defaultNS: 'translation'
  });

export default i18n;
