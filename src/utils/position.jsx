import { Tools } from '../propTypes'

const distance = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))

const onLine = (x1, y1, x2, y2, x, y, maxDistance = 1) => {
  const a = { x: x1, y: y1 }
  const b = { x: x2, y: y2 }
  const c = { x, y }
  const offset = distance(a, b) - (distance(a, c) + distance(b, c))
  return Math.abs(offset) < maxDistance
}

const getElementAtPosition = (x, y, elements) => {
  return elements
    .map(element => ({
      ...element,
      position: positionWithinElement(x, y, element)
    }))
    .find(element => element.position !== null)
}

const positionWithinElement = (x, y, element) => {
  const { type, x1, x2, y1, y2, points } = element

  switch (type) {
    case Tools.line:
      const on = onLine(x1, y1, x2, y2, x, y)
      const start = Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5
      const end = Math.abs(x - x2) < 5 && Math.abs(y - y2) < 5
      if (start) return 'start'
      if (end) return 'end'
      if (on) return 'inside'
      return null

    case Tools.rectangle:
      const minX = Math.min(x1, x2)
      const maxX = Math.max(x1, x2)
      const minY = Math.min(y1, y2)
      const maxY = Math.max(y1, y2)
      const topLeft = Math.abs(x - minX) < 5 && Math.abs(y - minY) < 5
      const topRight = Math.abs(x - maxX) < 5 && Math.abs(y - minY) < 5
      const bottomLeft = Math.abs(x - minX) < 5 && Math.abs(y - maxY) < 5
      const bottomRight = Math.abs(x - maxX) < 5 && Math.abs(y - maxY) < 5
      const inside = x >= minX && x <= maxX && y >= minY && y <= maxY
      if (topLeft) return 'tl'
      if (topRight) return 'tr'
      if (bottomLeft) return 'bl'
      if (bottomRight) return 'br'
      if (inside) return 'inside'
      return null

    case Tools.pencil:
      if (!points) return null
      return points.some((point, index) => {
        const nextPoint = points[index + 1]
        if (!nextPoint) return false
        return onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y, 5)
      }) ? 'inside' : null

    case Tools.text:
      return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? 'inside' : null

    default:
      return null
  }
}

export { getElementAtPosition } 