import { LoginContext } from ".";
import { useState } from "react";
export const LoginProvider = ( {children} ) => {
  const [loginData, setLoginData] = useState({
    userName: null,
    email: null,
    password: null,
  });
  return (
    <LoginContext.Provider value={{ loginData, setLoginData }}>
      {children}
    </LoginContext.Provider>
  );
};