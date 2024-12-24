import { useState } from 'react'

export const useZoom = (initialZoom) => {
  const [zoom, setZoom] = useState(initialZoom)

  const handleZoom = (newZoom) => {
    setZoom(Math.min(Math.max(0.1, newZoom), 2))
  }

  return [zoom, handleZoom]
} 