import { useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import rough from 'roughjs';
import { generateElement, drawElement } from '../../utils/element';
import { Tools } from '../../propTypes';
import { getElementAtPosition } from '../../utils/position';

export function Canvas({ 
  elements = [],
  panOffset, 
  zoom,
  tool,
  setElements,
  selectedElement,
  setSelectedElement,
  action,
  setAction,
  pencilPoints,
  setPencilPoints,
  setPanOffset
}) {
  const canvasRef = useRef(null);
  const lastOffsetRef = useRef(null);
  const textAreaRef = useRef(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const roughCanvas = rough.canvas(canvas);

    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    context.save();
    context.translate(panOffset.x, panOffset.y);
    context.scale(zoom, zoom);

    elements.forEach(element => {
      drawElement(roughCanvas, context, element);
    });

    context.restore();
  }, [elements, panOffset, zoom]);

  const getMouseCoordinates = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left - panOffset.x) / zoom,
      y: (event.clientY - rect.top - panOffset.y) / zoom
    };
  };

  const handleTextArea = (event) => {
    const { id } = selectedElement;
    const elementsCopy = [...elements];
    elementsCopy[id] = {
      ...elementsCopy[id],
      text: event.target.value
    };
    setElements(elementsCopy);
  };

  const handleMouseDown = (event) => {
    const { x, y } = getMouseCoordinates(event);

    if (tool === Tools.selection || tool === Tools.pan || tool === Tools.delete) {
      const element = getElementAtPosition(x, y, elements);
      if (element) {
        if (tool === Tools.selection) {
          if (element.type === Tools.pencil) {
            const xOffsets = element.points.map(point => x - point.x);
            const yOffsets = element.points.map(point => y - point.y);
            setSelectedElement({ ...element, xOffsets, yOffsets });
          } else {
            const offsetX = x - element.x1;
            const offsetY = y - element.y1;
            setSelectedElement({ ...element, offsetX, offsetY });
          }
          setAction('moving');
        } else if (tool === Tools.delete) {
          const elementsCopy = elements.filter(el => el.id !== element.id);
          setElements(elementsCopy);
        }
      }
      if (tool === Tools.pan) {
        setAction('panning');
        lastOffsetRef.current = { x: event.clientX, y: event.clientY };
      }
      return;
    }

    if (tool === Tools.text) {
      const element = generateElement(elements.length, x, y, x + 20, y + 20, tool);
      setElements([...elements, element]);
      setSelectedElement(element);
      setAction('writing');
      return;
    }

    setElements([...elements]);
    const element = generateElement(elements.length, x, y, x, y, tool);
    setElements([...elements, element]);
    setSelectedElement(element);
    setAction('drawing');
  };

  const handleMouseMove = (event) => {
    const { x, y } = getMouseCoordinates(event);

    if (action === 'panning' && lastOffsetRef.current) {
      const deltaX = event.clientX - lastOffsetRef.current.x;
      const deltaY = event.clientY - lastOffsetRef.current.y;
      lastOffsetRef.current = { x: event.clientX, y: event.clientY };
      setPanOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      return;
    }

    if (action === 'drawing') {
      const index = elements.length - 1;
      const { id, type } = elements[index];

      if (type === Tools.pencil) {
        const newPoints = [...elements[index].points, { x, y }];
        const elementsCopy = [...elements];
        elementsCopy[index] = { ...elementsCopy[index], points: newPoints };
        setElements(elementsCopy);
      } else {
        const elementsCopy = [...elements];
        elementsCopy[index] = generateElement(id, elementsCopy[index].x1, elementsCopy[index].y1, x, y, type);
        setElements(elementsCopy);
      }
    } else if (action === 'moving' && selectedElement) {
      const { id, type, offsetX, offsetY } = selectedElement;
      
      if (type === Tools.pencil) {
        const { points, xOffsets, yOffsets } = selectedElement;
        const newPoints = points.map((_, index) => ({
          x: x - (xOffsets[index] || 0),
          y: y - (yOffsets[index] || 0)
        }));
        const elementsCopy = [...elements];
        elementsCopy[id] = { ...selectedElement, points: newPoints };
        setElements(elementsCopy);
      } else {
        const width = selectedElement.x2 - selectedElement.x1;
        const height = selectedElement.y2 - selectedElement.y1;
        const newX = x - (offsetX || 0);
        const newY = y - (offsetY || 0);
        const elementsCopy = [...elements];
        
        if (type === Tools.text) {
          elementsCopy[id] = {
            ...generateElement(id, newX, newY, newX + width, newY + height, type),
            text: selectedElement.text || ''
          };
        } else {
          elementsCopy[id] = generateElement(id, newX, newY, newX + width, newY + height, type);
        }
        
        setElements(elementsCopy);
      }
    }
  };

  const handleMouseUp = () => {
    if (action === 'writing') {
      setTimeout(() => {
        const textArea = document.createElement('textarea');
        textArea.style.position = 'fixed';
        textArea.style.left = `${selectedElement.x1 + panOffset.x}px`;
        textArea.style.top = `${selectedElement.y1 + panOffset.y}px`;
        textArea.style.font = '24px sans-serif';
        textArea.style.margin = '0';
        textArea.style.padding = '0';
        textArea.style.border = '0';
        textArea.style.outline = '0';
        textArea.style.resize = 'none';
        textArea.style.background = 'transparent';
        textArea.style.overflow = 'hidden';
        textArea.addEventListener('blur', () => {
          const elementsCopy = [...elements];
          elementsCopy[selectedElement.id] = {
            ...elementsCopy[selectedElement.id],
            text: textArea.value
          };
          setElements(elementsCopy);
          document.body.removeChild(textArea);
          setAction('none');
          setSelectedElement(null);
        });
        document.body.appendChild(textArea);
        textArea.focus();
      }, 0);
    } else if (action === 'drawing' || action === 'moving') {
      setElements([...elements]);
    }
    lastOffsetRef.current = null;
    setAction('none');
    setSelectedElement(null);
  };

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 touch-none cursor-crosshair"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
}

Canvas.propTypes = {
  elements: PropTypes.arrayOf(PropTypes.object).isRequired,
  panOffset: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired,
  setPanOffset: PropTypes.func.isRequired,
  zoom: PropTypes.number.isRequired,
  tool: PropTypes.oneOf(Object.values(Tools)).isRequired,
  setElements: PropTypes.func.isRequired,
  selectedElement: PropTypes.object,
  setSelectedElement: PropTypes.func.isRequired,
  action: PropTypes.string.isRequired,
  setAction: PropTypes.func.isRequired,
  pencilPoints: PropTypes.array.isRequired,
  setPencilPoints: PropTypes.func.isRequired
}; 