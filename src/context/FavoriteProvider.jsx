import { FavoriteContext } from "./FavoriteContext";
import { useState } from "react";

export const FavoriteProvider = ( {children} ) => {
  const [favoriteURL, setFavoriteURL] = useState();
  const updateFavoriteURL = (data) => {
    setFavoriteURL(data);
  };
  return (
    <FavoriteContext.Provider value={{ favoriteURL, updateFavoriteURL }}>
      {children}
    </FavoriteContext.Provider>
  );
};