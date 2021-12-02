import { createI18n } from "vue-i18n";

import en from './en'
import cn from './cn'

const messages = {
    'en-US': en,
    'zh-CN': cn
};

const defaultLanguage = 'en-US';

let currentLanguage = defaultLanguage;

if (navigator.language.toLowerCase().includes('zh')){
    currentLanguage = 'zh-CN';
}


const i18n = createI18n({
    locale: localStorage.getItem('locale') || currentLanguage,
    messages
});

export default i18n;