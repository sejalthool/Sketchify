import { useState } from 'react'

export const usePencil = (initialState) => {
  const [points, setPoints] = useState(initialState)

  const handlePoints = (newPoints) => {
    setPoints(newPoints)
  }

  return [points, handlePoints]
} 