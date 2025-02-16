import { React, useContext } from 'react'
import { FavoriteContext } from '../context'
import { NavLink } from 'react-router-dom'

export const FavoriteDog = () => {
  const {favoriteURL} = useContext(FavoriteContext)
  console.log(favoriteURL)
  return (
    <NavLink to='/api' className="nav-link active">
     {favoriteURL? <img id="favorite" src={favoriteURL}/> : <p>¡Todavía no has marcado ningún favorito!</p>}
    </NavLink>
  )
}
