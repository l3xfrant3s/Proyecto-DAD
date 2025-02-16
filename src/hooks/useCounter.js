import { useState } from 'react'

export function useCounter(strike){
    const [counter, setCounter] = useState(strike);
    function increasingBy(value){
        setCounter(counter+value)
    }
    function reset(){
        setCounter(strike)
    }
    return {counter, increasingBy, reset}
}

export default useCounter
