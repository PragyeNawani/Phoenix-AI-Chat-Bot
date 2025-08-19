import React, { createContext, useState } from 'react';
export const sidebarcontext = createContext();

export const  Sidebarctxprovider = ({ children }) => {
  const [sidebaropen, setSidebaropen] = useState(false);

  return (
    <sidebarcontext.Provider value={{ sidebaropen, setSidebaropen }}>
      {children}
    </sidebarcontext.Provider>
  );
};