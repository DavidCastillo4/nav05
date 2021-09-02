//Global.js
import { useState, createContext } from "react";

export let GlobalContext = createContext();

export let GlobalProvider = ({ children }) => {
 let [Authenticated, setAuthenticated] = useState(0);
 return (
  <GlobalContext.Provider value={{ Authenticated, setAuthenticated }}>
   {children}
  </GlobalContext.Provider>
 )
};
