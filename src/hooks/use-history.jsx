import { useState } from 'react'

export const useHistory = (initialState) => {
  const [index, setIndex] = useState(0)
  const [history, setHistory] = useState([initialState])

  const setState = (action) => {
    const newState = typeof action === 'function' ? action(history[index]) : action
    const historyCopy = [...history].slice(0, index + 1)
    historyCopy.push(newState)
    setHistory(historyCopy)
    setIndex(historyCopy.length - 1)
  }

  const undo = () => index > 0 && setIndex(prevState => prevState - 1)
  const redo = () => index < history.length - 1 && setIndex(prevState => prevState + 1)

  return {
    elements: history[index],
    setElements: setState,
    undo,
    redo
  }
} 