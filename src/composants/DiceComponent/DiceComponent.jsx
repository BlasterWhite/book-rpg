import './DiceComponent.scss';
import { useEffect, useRef, useState } from 'react';

export function DiceComponent({ numberOfDices = 2, numberOfFaces = 6, sendResultsToParent }) {
  const isMounted = useRef(false);
  const [hasDiceResults, setHasDiceResults] = useState(false);
  const [results, setResults] = useState([]);

  const dices = useRef([]);

  if (!isMounted.current) {
    for (let i = 0; i < numberOfDices; i++) {
      for (let j = 0; j < numberOfFaces; j++) {
        if (!dices.current[i]) {
          dices.current[i] = [];
        }
        dices.current[i][j] = j;
      }
    }
  }

  useEffect(() => {
    isMounted.current = true;
  }, []);

  function throwDices() {
    setResults([]);
    let immediateResults = [];
    for (let i = 0; i < numberOfDices; i++) {
      immediateResults[i] =
        dices.current[i][Math.floor(Math.random() * dices.current[i].length)] + 1;
      setResults((results) => [...results, immediateResults[i]]);
    }
    sendResultsToParent(immediateResults);
    if (!hasDiceResults) {
      setHasDiceResults(true);
    }
  }

  return (
    <div className={'dice-component-container'}>
      <button onClick={throwDices}>Roll dices</button>
      {hasDiceResults && (
        <div className={'dice-container'}>
          {dices.current.map((dice, index) => (
            <div key={index} className={'dice'}>
              <img src="/Dice-square.png"></img>
              <h3>{results[index]}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
