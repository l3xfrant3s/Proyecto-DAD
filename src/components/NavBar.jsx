import { React, useContext } from 'react';
import { LoginContext, ThemeContext } from '../context';
import { NavLink } from 'react-router-dom';


export const NavBar = () => {
  const {loginData} = useContext(LoginContext)
  const {theme, changeTheme} = useContext(ThemeContext)

  const onThemeChange = () => {
    if(theme == "light"){
      changeTheme("dark");
    }
    else {
      changeTheme("light");
    }
  }

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme={theme}>
      <div className="container-fluid">
        <div className="navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to='/responsive' className="nav-link active">Componentes Responsive</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to='/api' className="nav-link active">API</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to='/chat' className="nav-link active">SandalIA</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to='/informes' className="nav-link active">Informes</NavLink>
            </li>
            {/* <li className="nav-item">
              <NavLink to='/recog' className="nav-link active">Reconocimiento de voz</NavLink>
            </li> */}
            <p onClick={onThemeChange} className="nav-link active">Cambiar a tema {theme == "light"? "oscuro": "claro"}</p>
            {loginData.userName != null?
              <NavLink to='/profile' className="nav-link active">
                Hola, {loginData.userName}
              </NavLink>:
              <NavLink to='/login' className="nav-link active">
                Inicia sesión
              </NavLink>
            }
          </ul>
        </div>
      </div>
    </nav>
  );
}