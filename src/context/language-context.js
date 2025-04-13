import React, { createContext, useContext, useState } from "react";

// 1. Context erstellen
export const LanguageContext = createContext();

// 2. Custom Hook zum Zugriff auf den Context
export const useLanguage = () => useContext(LanguageContext);

// 3. Provider-Komponente
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("de"); // Standard: Deutsch

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
