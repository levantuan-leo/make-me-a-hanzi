import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Search from "./components/Search";
import useReactiveVar from "./hooks/useReactiveVar";
import { decodeMedians, loadBinaryData } from "./utils/medians";
import { Matcher } from "./utils/matcher";
import { Handwriting } from "./utils/handwriting";
import "./App.css";

function App() {
  const makemeahanzi = useRef({});
  const matcher = useRef(null);
  const [candidates, setCandidates] = useState([]);
  const strokesVar = useReactiveVar([]);

  useLayoutEffect(() => {
    // Returns a Promise that resolves to a list of [character, medians] pairs,
    // where [medians] is a preprocessed Matcher entry for that character.
    makemeahanzi.current.mediansPromise = loadBinaryData("medians.bin")
      .then(decodeMedians)
      .catch(console.err);
    makemeahanzi.current.Matcher = Matcher;
    makemeahanzi.current.Handwriting = Handwriting;
  }, []);

  useEffect(() => {
    makemeahanzi.current.mediansPromise
      .then((medians) => {
        matcher.current = new makemeahanzi.current.Matcher(medians);
      })
      .catch(console.error.bind(console));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (matcher.current)
      setCandidates(matcher.current.match(strokesVar.get(), 8));
  }, [strokesVar.get(), matcher.current]);

  return (
    <>
      <Search
        candidates={candidates}
        makemeahanzi={makemeahanzi}
        strokesVar={strokesVar}
      />
    </>
  );
}

export default App;
