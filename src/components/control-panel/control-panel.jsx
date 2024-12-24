import PropTypes from 'prop-types';
import { FiMinus, FiPlus } from "react-icons/fi";
import { IoArrowUndoOutline, IoArrowRedoOutline } from "react-icons/io5";

export function ControlPanel({ undo, redo, zoom, setZoom }) {
  return (
    <div className="w-[300px] flex gap-5 fixed z-[2] bottom-5 left-5">
      <div className="rounded-lg flex bg-panel-bg">
        <button
          className="border-none text-primary-text text-sm bg-transparent p-2.5 first:rounded-l-lg last:rounded-r-lg hover:bg-hover-bg"
          onClick={undo}
        >
          <IoArrowUndoOutline className="w-5 h-5 text-primary-text" />
        </button>
        <button
          className="border-none text-primary-text text-sm bg-transparent p-2.5 first:rounded-l-lg last:rounded-r-lg hover:bg-hover-bg"
          onClick={redo}
        >
          <IoArrowRedoOutline className="w-5 h-5 text-primary-text" />
        </button>
      </div>

      <div className="rounded-lg flex bg-panel-bg">
        <button
          className="border-none text-primary-text text-sm bg-transparent p-2.5 first:rounded-l-lg last:rounded-r-lg hover:bg-hover-bg"
          onClick={() => setZoom(zoom - 0.1)}
        >
          <FiMinus className="w-5 h-5 text-primary-text" />
        </button>
        <button
          className="border-none text-primary-text text-sm bg-transparent p-2.5 first:rounded-l-lg last:rounded-r-lg hover:bg-hover-bg"
          onClick={() => setZoom(zoom + 0.1)}
        >
          <FiPlus className="w-5 h-5 text-primary-text" />
        </button>
      </div>
    </div>
  );
}

ControlPanel.propTypes = {
  undo: PropTypes.func.isRequired,
  redo: PropTypes.func.isRequired,
  zoom: PropTypes.number.isRequired,
  setZoom: PropTypes.func.isRequired
};
