import { ThemeContext } from "./ThemeContext";
import { useState } from "react";

export const ThemeProvider = ( {children} ) => {
  const [theme, setTheme] = useState("light");
  const changeTheme = (data) => {
    setTheme(data);
  };
  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};