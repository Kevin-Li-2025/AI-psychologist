import { useState, useEffect } from 'react';
import { i18n } from '../i18n';

export const useTranslation = () => {
  const [language, setLanguage] = useState(i18n.getCurrentLanguage());

  useEffect(() => {
    const handleLanguageChange = (event) => {
      setLanguage(event.detail);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);

  const changeLanguage = (newLanguage) => {
    i18n.setLanguage(newLanguage);
  };

  const t = (key, params) => {
    return i18n.t(key, params);
  };

  return {
    language,
    changeLanguage,
    t,
    availableLanguages: i18n.getAvailableLanguages()
  };
};
