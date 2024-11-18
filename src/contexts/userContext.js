import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [userName, setUserName] =useState(() => {
    return localStorage.getItem("uname") || "";
  });
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem("uid") || "";
  });

  useEffect(() => {
    localStorage.setItem("uname", userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem("uid", userId);
  }, [userId]);


  return (
    <UserContext.Provider value={{userName, setUserName, userId, setUserId}}>
      {children}
    </UserContext.Provider>
  );
};

