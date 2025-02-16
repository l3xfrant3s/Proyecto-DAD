import { React, useContext, useState } from 'react';
import { LoginContext } from '../context';
import { NavLink } from 'react-router-dom';

export const Login = () => {
  const {loginData, setLoginData} = useContext(LoginContext)
  const [shownOnScreen, setShownOnScreen] = useState({
    userName:"",
    email:"", 
    password:"",
  })

  const handleChange = (e) => {
    setShownOnScreen({
      ...shownOnScreen,
      [e.target.name]: e.target.value,
    });
  };
    
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginData({
      userName: shownOnScreen.userName,
      email: shownOnScreen.email,
      password: shownOnScreen.password,
    })
    
  };
    
  return (
    <>
      <h3>Por favor, inicie sesión</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="userName">Nombre de usuario:</label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={shownOnScreen.userName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Correo electrónico:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={shownOnScreen.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={shownOnScreen.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>
        <button type="submit">Iniciar sesión</button>
      </form>
    </>
  );
}