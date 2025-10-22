'use client';

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type SupportedLanguage = 'en' | 'te' | 'hi';

type GoogleTranslateContextValue = {
  currentLanguage: SupportedLanguage;
  translate: (language: SupportedLanguage) => void;
};

const GoogleTranslateContext = createContext<GoogleTranslateContextValue>({
  currentLanguage: 'en',
  translate: () => {},
});

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

const LANGUAGE_TO_GOOGLE_MAP: Record<SupportedLanguage, string> = {
  en: 'en',
  te: 'te',
  hi: 'hi',
};

function triggerSelectLanguage(targetLang: string) {
  const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
  if (!combo) {
    return;
  }

  if (combo.value === targetLang) {
    combo.dispatchEvent(new Event('change'));
    return;
  }

  combo.value = targetLang;
  combo.dispatchEvent(new Event('change'));
}

export function GoogleTranslateProvider({ children }: { children: React.ReactNode }) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');

  useEffect(() => {
    if (scriptLoaded) {
      return;
    }

    const existingScript = document.getElementById('google-translate-script');
    if (existingScript) {
      setScriptLoaded(true);
      return;
    }

    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: Object.values(LANGUAGE_TO_GOOGLE_MAP).join(','),
            layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
            autoDisplay: false,
          },
          'google_translate_element'
        );
        setScriptLoaded(true);
      }
    };

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.type = 'text/javascript';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      delete window.googleTranslateElementInit;
    };
  }, [scriptLoaded]);

  useEffect(() => {
    document.documentElement.setAttribute('lang', currentLanguage);
  }, [currentLanguage]);

  const contextValue = useMemo(
    () => ({
      currentLanguage,
      translate: (language: SupportedLanguage) => {
        setCurrentLanguage(language);
        const target = LANGUAGE_TO_GOOGLE_MAP[language];
        if (!target) {
          return;
        }

        if (!scriptLoaded) {
          console.warn('Google Translate script not ready yet.');
          return;
        }

        triggerSelectLanguage(target);
      },
    }),
    [currentLanguage, scriptLoaded]
  );

  return (
    <GoogleTranslateContext.Provider value={contextValue}>
      <div id="google_translate_element" className="hidden" />
      {children}
    </GoogleTranslateContext.Provider>
  );
}

export function useGoogleTranslate() {
  return useContext(GoogleTranslateContext);
}
