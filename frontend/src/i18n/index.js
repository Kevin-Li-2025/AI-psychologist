// 国际化系统
import zh from './locales/zh.json';
import en from './locales/en.json';

const translations = {
  zh,
  en
};

class I18n {
  constructor() {
    this.currentLanguage = localStorage.getItem('language') || 'zh';
    this.translations = translations;
  }

  // 获取当前语言
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  // 设置语言
  setLanguage(language) {
    if (this.translations[language]) {
      this.currentLanguage = language;
      localStorage.setItem('language', language);
      // 触发语言变更事件
      window.dispatchEvent(new CustomEvent('languageChange', { detail: language }));
    }
  }

  // 获取翻译文本
  t(key, params = {}) {
    const keys = key.split('.');
    let value = this.translations[this.currentLanguage];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (!value) {
      console.warn(`Translation missing for key: ${key} in language: ${this.currentLanguage}`);
      return key;
    }
    
    // 替换参数
    let result = value;
    Object.keys(params).forEach(param => {
      result = result.replace(new RegExp(`{{${param}}}`, 'g'), params[param]);
    });
    
    return result;
  }

  // 获取所有可用语言
  getAvailableLanguages() {
    return [
      { code: 'zh', name: '中文', nativeName: '中文' },
      { code: 'en', name: 'English', nativeName: 'English' }
    ];
  }
}

export const i18n = new I18n();
export default i18n;
