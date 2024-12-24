import PropTypes from 'prop-types';
import { Tools } from '../../propTypes';
import { LuPencil } from "react-icons/lu";
import { FiMinus, FiMousePointer, FiSquare, FiTrash2 } from "react-icons/fi";
import { IoHandRightOutline, IoText } from "react-icons/io5";

export function ActionBar({ tool, setTool }) {
  return (
    <div className="fixed bottom-5 z-[2] p-2.5 bg-primary-bg left-1/2 flex gap-5 justify-center -translate-x-1/2 border border-border rounded-lg shadow-md">
      {Object.values(Tools).map((t, index) => (
        <div
          className={`cursor-pointer relative rounded border border-transparent p-2.5 bg-primary-bg transition-colors duration-300 hover:bg-secondary-bg ${
            tool === t ? 'bg-selected-bg' : ''
          }`}
          key={t}
          onClick={() => setTool(t)}
        >
          <input
            type="radio"
            id={t}
            checked={tool === t}
            onChange={() => setTool(t)}
            readOnly
            className="cursor-pointer w-5 h-5 absolute opacity-0"
          />
          <label
            htmlFor={t}
            className="cursor-pointer absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0"
          >
            {t}
          </label>
          <div className={`text-primary-text transition-colors duration-300 ${
            tool === t ? 'text-highlight' : ''
          }`}>
            {t === "pan" && <IoHandRightOutline className="w-6 h-6" />}
            {t === "selection" && <FiMousePointer className="w-6 h-6" />}
            {t === "rectangle" && <FiSquare className="w-6 h-6" />}
            {t === "line" && <FiMinus className="w-6 h-6" />}
            {t === "pencil" && <LuPencil className="w-6 h-6" />}
            {t === "text" && <IoText className="w-6 h-6" />}
            {t === "delete" && <FiTrash2 className="w-6 h-6" />}
          </div>
          <span className="absolute bottom-0 right-0.5 text-xs text-secondary-text">
            {index + 1}
          </span>
        </div>
      ))}
    </div>
  );
}

ActionBar.propTypes = {
  tool: PropTypes.oneOf(Object.values(Tools)).isRequired,
  setTool: PropTypes.func.isRequired
};