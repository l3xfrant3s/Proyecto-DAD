import { React , useContext} from 'react'
import { LoginContext } from '../context';
import { NavLink } from 'react-router-dom';

export const Profile = () => {
  const {loginData} = useContext(LoginContext)
  return (
    <>
      <h3>¡Hola, {loginData.userName}!</h3>
      <NavLink to='/login' className="nav-link active">Si ese no es su nombre, haz clic aquí para volver a iniciar sesión</NavLink>
    </>
  )
}