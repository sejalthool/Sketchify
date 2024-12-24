import PropTypes from 'prop-types';

export const Tools = {
  pan: "pan",
  selection: "selection",
  rectangle: "rectangle",
  line: "line",
  pencil: "pencil",
  text: "text",
  delete: "delete"
};

export const elementPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  x1: PropTypes.number.isRequired,
  y1: PropTypes.number.isRequired,
  x2: PropTypes.number.isRequired,
  y2: PropTypes.number.isRequired,
  type: PropTypes.oneOf(Object.values(Tools)).isRequired,
  roughElement: PropTypes.any,
  offsetX: PropTypes.number,
  offsetY: PropTypes.number,
  position: PropTypes.string,
  points: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  })),
  text: PropTypes.string
}); 