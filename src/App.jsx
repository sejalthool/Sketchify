import { useState, useEffect } from 'react'
import { ActionBar } from './components/action-bar/action-bar'
import { Canvas } from './components/canvas/canvas'
import { ControlPanel } from './components/control-panel/control-panel'
import { useHistory } from './hooks/use-history'
import { usePencil } from './hooks/use-pencil'
import { useZoom } from './hooks/use-zoom'
import { Tools } from './propTypes'
import { generateElement } from './utils/element'
import { getElementAtPosition } from './utils/position'

function App() {
  const { elements, setElements, undo, redo } = useHistory([])
  const [tool, setTool] = useState(Tools.selection)
  const [selectedElement, setSelectedElement] = useState(null)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [startPanOffset, setStartPanOffset] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useZoom(1)
  const [action, setAction] = useState('none')
  const [pencilPoints, setPencilPoints] = usePencil([])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key >= '1' && event.key <= '7') {
        const index = parseInt(event.key) - 1
        const tools = Object.values(Tools)
        if (index < tools.length) {
          setTool(tools[index])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div>
      <ActionBar tool={tool} setTool={setTool} />
      <ControlPanel 
        undo={undo} 
        redo={redo} 
        zoom={zoom}
        setZoom={setZoom}
      />
      <Canvas 
        elements={elements || []}
        panOffset={panOffset}
        setPanOffset={setPanOffset}
        zoom={zoom}
        tool={tool}
        setElements={setElements}
        selectedElement={selectedElement}
        setSelectedElement={setSelectedElement}
        action={action}
        setAction={setAction}
        pencilPoints={pencilPoints}
        setPencilPoints={setPencilPoints}
      />
    </div>
  )
}

export default App
