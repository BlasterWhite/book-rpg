import { useParams } from 'react-router-dom';
import { DiceComponent } from '../../composants/DiceComponent/DiceComponent';
import { useState } from 'react';

export function SingleBook() {
  const { bookId, characterId, sectionId } = useParams();
  const [results, setResults] = useState([]);

  // The results of the dices from DiceComponent.
  function handleResults(results) {
    setResults(results);
  }

  return (
    <div>
      <h1>Book {bookId}</h1>
      <h3>Character : {characterId}</h3>
      <h3>Section : {sectionId}</h3>
      <DiceComponent numberOfDices={2} sendResultsToParent={handleResults} />
    </div>
  );
}
