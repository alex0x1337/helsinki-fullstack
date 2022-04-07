import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { goodIncrement, okIncrement, badIncrement, allReset } from './reducer'

const App = () => {
  const dispatch = useDispatch()
  return (
    <div>
      <button onClick={() => dispatch(goodIncrement())}>good</button> 
      <button onClick={() => dispatch(okIncrement())}>ok</button> 
      <button onClick={() => dispatch(badIncrement())}>bad</button>
      <button onClick={() => dispatch(allReset())}>reset stats</button>
      <div>good {useSelector(state => state.good)}</div>
      <div>ok {useSelector(state => state.ok)}</div>
      <div>bad {useSelector(state => state.bad)}</div>
    </div>
  )
}

export default App