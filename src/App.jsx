import './App.css';
import { API, Chat, Login, NavBar, Profile, Report, ResponsiveComponents, SpeechRecog } from './components';
import { LoginProvider, FavoriteProvider, ThemeProvider } from './context';
import { Routes, Route } from "react-router-dom";

function App() {

  return (
    <div>
      <LoginProvider>
      <ThemeProvider>
        <NavBar/>
        <FavoriteProvider>
          <div className='container'>
            <Routes>
              <Route path='/api' element={<API/>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/responsive' element={<ResponsiveComponents/>}/>
              <Route path='/recog' element={<SpeechRecog/>}/>
              <Route path='/profile' element={<Profile/>}/>
              <Route path='/chat' element={<Chat/>}/>
              <Route path='/informes' element={<Report/>}/>
              <Route path='/*' element={<API/>}/>
            </Routes>
          </div>
          </FavoriteProvider>
        </ThemeProvider>
        </LoginProvider>
    </div>
  )
}

export default App
