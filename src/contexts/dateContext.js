import React, { createContext, useEffect, useState } from 'react';

export const DateContext = createContext();

export const DateProvider = ({ children }) => {
  const [date, setDate] = useState(() => {
    return localStorage.getItem("tDate") || new Date().toISOString().split("T")[0];
  });

  useEffect(() => {
    localStorage.setItem("tDate", date);
  }, [date]);

  return (
    <DateContext.Provider value={{ date, setDate }}>
      {children}
    </DateContext.Provider>
  );
};

