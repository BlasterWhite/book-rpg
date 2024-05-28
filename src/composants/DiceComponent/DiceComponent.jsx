import './DiceComponent.scss';
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '@/contexts/AuthContext.jsx';

export function DiceComponent({
  numberOfDices = 2,
  numberOfFaces = 6,
  handleNextSection,
  section,
  characterId
}) {
  const isMounted = useRef(false);
  const [hasDiceResults, setHasDiceResults] = useState(false);
  const [results, setResults] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [aventure, setAventure] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const API_URL = import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000';
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: user.token }
    };
    fetch(`${API_URL}/personnages/${characterId}/aventure`, requestOptions).then((response) =>
      response
        .json()
        .then((data) => setAventure(data))
        .catch((error) => console.error(error))
    );
    // on fait une requête put sur l'aventure
  }, [characterId, section, user]);

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

  function handleResults(results) {
    const win = section.resultat.condition?.['1'];
    const winDestination = section.resultat.gagne;
    const loseDestination = section.resultat.perd;
    const resultSum = results.reduce((acc, curr) => acc + curr, 0);
    let finalDestination = null;

    if (win && win.length > 0 && win.includes(resultSum)) {
      setFeedback(
        `You won ! with a score of ${resultSum}! You are going to section ${winDestination}!`
      );
      finalDestination = winDestination;
    } else {
      setFeedback(
        `You lost ! with a score of ${resultSum}! You are going to section ${loseDestination}!`
      );
      finalDestination = loseDestination;
    }

    setTimeout(() => {
      handleNextSection(finalDestination);

      if (!user) return;
      const API_URL = import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000';
      // on récupère la prochaine sections depuis sections
      if (!section) return;
      const statut = section.type === 'termine' ? 'termine' : 'en_cours';
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: user.token },
        body: JSON.stringify({ id_section_actuelle: section.id, statut: statut })
      };
      const newAventureID = Number.parseInt(aventure.id);
      fetch(`${API_URL}/aventures/${newAventureID}`, requestOptions).then((response) =>
        response
          .json()
          .then((data) => console.log(data))
          .catch((error) => console.error(error))
      );
    }, 2000);
  }

  function throwDices() {
    setResults([]);
    let immediateResults = [];
    for (let i = 0; i < numberOfDices; i++) {
      immediateResults[i] =
        dices.current[i][Math.floor(Math.random() * dices.current[i].length)] + 1;
      setResults((results) => [...results, immediateResults[i]]);
    }
    handleResults(immediateResults);
    if (!hasDiceResults) {
      setHasDiceResults(true);
    }
  }

  return (
    <div className={'dice-component-container'}>
      <button onClick={throwDices}>Roll dices</button>
      <h2>{feedback}</h2>
      {hasDiceResults && (
        <div className={'dice-container'}>
          {dices.current.map((dice, index) => (
            <div key={index} className={'dice'}>
              <img src="/Dice-square.png" alt={'dice square'}></img>
              <h3>{results[index]}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

DiceComponent.propTypes = {
  section: PropTypes.shape({
    id: PropTypes.number.isRequired,
    texte: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    sections: PropTypes.array.isRequired,
    image: PropTypes.object,
    resultat: PropTypes.shape({
      condition: PropTypes.object,
      gagne: PropTypes.number,
      perd: PropTypes.number
    }).isRequired
  }).isRequired,
  handleNextSection: PropTypes.func,
  numberOfDices: PropTypes.number,
  numberOfFaces: PropTypes.number,
  characterId: PropTypes.string.isRequired
};
