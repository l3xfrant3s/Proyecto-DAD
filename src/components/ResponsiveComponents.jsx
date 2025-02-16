import { CounterWithHooks, FavoriteDog, SpeechRecog } from ".";
import { React, useState } from 'react'

export const ResponsiveComponents = () => {
  const [showCounter, toggleCounter] = useState(true);
  const [showDog, toggleDog] = useState(true);
  const [showRecog, toggleRecog] = useState(true);

  const handleToggleCounter = () => {
    toggleCounter(!showCounter)
  }

  const handleToggleDog = () => {
    toggleDog(!showDog)
  }

  const handleToggleRecog = () => {
    toggleRecog(!showRecog)
  }

  return (
    <div id="responsive-components">
      <div className="responsive-component">
        {showCounter && <CounterWithHooks/>}
        <button onClick={handleToggleCounter}>{showCounter? "Ocultar" : "Mostrar"} contador</button>
      </div>
      <div className="responsive-component">
        {showDog && <FavoriteDog/>}
        <button onClick={handleToggleDog}>{showDog? "Ocultar" : "Mostrar"} perro favorito</button>
      </div>
      <div className="responsive-component">
        {showRecog && <SpeechRecog/>}
        <button onClick={handleToggleRecog}>{showRecog? "Ocultar" : "Mostrar"} reconocimiento de voz</button>
      </div>
    </div>
  )
}
