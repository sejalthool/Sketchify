import rough from 'roughjs'
import { Tools } from '../propTypes'
import { getStroke } from 'perfect-freehand'
import { getSvgPathFromStroke } from './path'

const generator = rough.generator()

const generateElement = (id, x1, y1, x2, y2, type) => {
  switch (type) {
    case Tools.line:
      const line = generator.line(x1, y1, x2, y2)
      return { id, x1, y1, x2, y2, type, roughElement: line }
    
    case Tools.rectangle:
      const rect = generator.rectangle(x1, y1, x2 - x1, y2 - y1)
      return { id, x1, y1, x2, y2, type, roughElement: rect }
    
    case Tools.pencil:
      return { id, type, points: [{ x: x1, y: y1 }] }
    
    case Tools.text:
      return { id, type, x1, y1, x2, y2, text: '' }
    
    default:
      throw new Error(`Type not recognised: ${type}`)
  }
}

const drawElement = (roughCanvas, context, element) => {
  switch (element.type) {
    case Tools.line:
    case Tools.rectangle:
      roughCanvas.draw(element.roughElement)
      break
    
    case Tools.pencil:
      const stroke = getStroke(element.points, {
        size: 3,
        thinning: 0.5,
        smoothing: 0.5,
        streamline: 0.5,
      })
      const pathData = getSvgPathFromStroke(stroke)
      const myPath = new Path2D(pathData)
      context.fill(myPath)
      break
    
    case Tools.text:
      context.textBaseline = 'top'
      context.font = '24px sans-serif'
      context.fillText(element.text, element.x1, element.y1)
      break
    
    default:
      throw new Error(`Type not recognised: ${element.type}`)
  }
}

export { generateElement, drawElement } 