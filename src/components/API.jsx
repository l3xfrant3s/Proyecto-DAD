import {React, useContext, useEffect, useRef, useState} from 'react'
import { FavoriteContext } from '../context'

export const API = () => {
  const selectedBreed = useRef(null); // Referencia al selector de razas
  const [dogBreedsAPI, setDogBreedsAPI] = useState([]); // Lista de las razas de perro en formato correcto para la api (raza/subraza)
  //const [dogSubreedsAPI, setDogSubreedsAPI] = useState([]);
  const [dogBreedsSelect, setDogBreedsSelect] = useState([]); // Lista de las razas de perros para ser mostradas en el selector de razas (Raza Subraza)
  //const [dogSubreedsSelect, setDogSubreedsSelect] = useState([]);
  const {favoriteURL, updateFavoriteURL} = useContext(FavoriteContext)
  const [imageUrl, setImageUrl] = useState(favoriteURL); // Enlace a la imagen obtenida de la API

  useEffect(() => {
    fetch("https://dog.ceo/api/breeds/list/all")
      .then((response) => response.json())
      .then((listOfBreeds) => {
        let theBreedsForTheAPI = [] // Al trabajar con estados, guardo
        //let theSubreedsForTheAPI = [] // las listas temporalmente en otra lista
        let theBreedsForTheSelector = [] // para actualizar el estado una sola vez
        //let theSubreedsForTheSelector = []
        for(var breed in listOfBreeds.message) {
          if(listOfBreeds.message[breed].length == 0){ // Si la raza no tiene subrazas
            theBreedsForTheAPI.push(breed)
            theBreedsForTheSelector.push(breed.charAt(0).toUpperCase() + breed.slice(1))
          }
          else {
            for(var subbreed in listOfBreeds.message[breed]) {
              theBreedsForTheAPI.push(breed + "/" + listOfBreeds.message[breed][subbreed])
              theBreedsForTheSelector.push(breed.charAt(0).toUpperCase() + breed.slice(1) + " " + listOfBreeds.message[breed][subbreed].charAt(0).toUpperCase() + listOfBreeds.message[breed][subbreed].slice(1))
            }
          }
          setDogBreedsAPI(theBreedsForTheAPI)
          setDogBreedsSelect(theBreedsForTheSelector)
        }
      });
  }, []);



  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("https://dog.ceo/api/breed/" + selectedBreed.current.value + "/images/random")
      .then((response) => response.json())
      .then((dog) => {
        setImageUrl(dog.message);
      });
  }

  const handleFavorite = () => {
    if(imageUrl != favoriteURL){
      updateFavoriteURL(imageUrl);
    }
    else{
      updateFavoriteURL(null);
    }
  }

  return (
    <div id="api">
      <div>
        <form onSubmit={handleSubmit}>
          <select name="dogBreedsAPI" id="dogBreedsAPI" ref={selectedBreed}>
            {dogBreedsAPI.map((breedAPI, index) =>
              <option value={breedAPI}>{dogBreedsSelect[index]}</option>
            )}
          </select>
          <button type="submit">¡Busca!</button>
        </form>
      </div>
      <img src={imageUrl} alt="Imagen de perrito aleatoria" width="512px"/>
      <button onClick={handleFavorite}>{favoriteURL == imageUrl && favoriteURL != null? "❤️": "🤍"}</button>
    </div>
  );
}