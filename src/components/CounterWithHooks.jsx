import { useCounter } from '../hooks'

export const CounterWithHooks = () => {
  const {counter, increasingBy, reset} = useCounter(0);

  function BotonRestar() {
    return (
      <button type="button" onClick={() => increasingBy(-1)} id="restar">-1</button>
    );
  }

  function BotonSumar() {
    return (
      <button type="button" onClick={() => increasingBy(1)} id="sumar">+1</button>
    );
  }

  function Resetear() {
    return (
      <button type="button" onClick={() => reset()} id="resetear">Resetear</button>
    );
  }

  return (
    <>
      <h3>Contador: {counter}</h3>
      <div id="botones">
        {BotonRestar()}
        {Resetear()}
        {BotonSumar()}
      </div>
    </>
  )
}

export default CounterWithHooks