import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import "./style.css";
import { getZoom } from "../../utils/search";

/* eslint-disable react/prop-types */
export default forwardRef(function Search(
  { candidates, strokesVar, makemeahanzi },
  ref
) {
  const rootRef = useRef(null);
  const handwriting = useRef(null);
  const [zoom, setZoom] = useState(1);

  const handleClear = () => {
    strokesVar.set([]);
    handwriting.current.clear();
  };

  const handleUndo = () => {
    strokesVar.pop();
    handwriting.current.undo();
  };

  useEffect(() => {
    const onRendered = function () {
      const element = rootRef.current.querySelector(".handwriting");
      element.find = (selector) => element.querySelectorAll(selector);
      const callback = strokesVar.push;
      strokesVar.set([]);
      setZoom(getZoom(rootRef.current));
      handwriting.current = new makemeahanzi.current.Handwriting(
        element,
        callback,
        zoom
      );
    };
    onRendered();
  }, []);

  useEffect(() => {
    if (handwriting.current)
      handwriting.current.set("callback", strokesVar.push);
  }, [strokesVar.get(), handwriting.current]);

  useEffect(() => {
    if (handwriting.current) handwriting.current.set("zoom", zoom);
  }, [zoom, handwriting.current]);

  useImperativeHandle(ref, () => rootRef, [rootRef.current]);

  return (
    <div ref={rootRef} id="search">
      <div
        id="wrapper"
        style={{
          transform: `scale(${zoom}) translate(-50%, -50%)`,
          WebkitTransform: `scale(${zoom}) translate(-50%, -50%)`,
        }}
      >
        <div className="handwriting"></div>
        <div className="controls">
          <a className="clear button" onClick={handleClear}>
            Clear
          </a>
          <a className="undo button" onClick={handleUndo}>
            Undo
          </a>
        </div>
        <div className="output">
          {candidates.map((candidate) => (
            <a
              key={candidate}
              className="candidate"
              href={(candidate) => `#/codepoint/${candidate.charCodeAt(0)}`}
            >
              {candidate}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
});
