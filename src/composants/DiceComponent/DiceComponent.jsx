import './DiceComponent.scss';
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Dice } from '../Dice/Dice';

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

  const dicesRef = useRef([]);
  const rollDicesButtonRef = useRef([]);
  const dices = useRef([]);
  const continueButtonRef = useRef([]);

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

  /*
  async function throwDices() {

    rollDicesButtonRef.current[0].style.display = 'None';

    setResults([]);
    let immediateResults = [];
    for (let i = 0; i < numberOfDices; i++) {
      immediateResults[i] =
        dices.current[i][Math.floor(Math.random() * dices.current[i].length)] + 1;

      if(i%2 == 0) {
        dicesRef.current[i].style.animation = 'rolling1 3s';
      } else {
        dicesRef.current[i].style.animation = 'rolling2 3s';
      }

      setTimeout(() => {

        switch (immediateResults[i]) {
          case 1:
            dicesRef.current[i].style.transform = 'rotateX(0deg) rotateY(0deg)';
            break;
          case 6:
            dicesRef.current[i].style.transform = 'rotateX(180deg) rotateY(0deg)';
            break;
          case 2:
            dicesRef.current[i].style.transform = 'rotateX(-90deg) rotateY(0deg)';
            break;
          case 5:
            dicesRef.current[i].style.transform = 'rotateX(90deg) rotateY(0deg)';
            break;
          case 3:
            dicesRef.current[i].style.transform = 'rotateX(0deg) rotateY(90deg)';
            break;
          case 4:
            dicesRef.current[i].style.transform = 'rotateX(0deg) rotateY(-90deg)';
            break;
          default:
            break;
        }

        dicesRef.current[i].style.animation = 'none';

      }, 3050);
    
      await sleep(4000);
      setResults((results) => [...results, immediateResults[i]]);
    }
    
    handleResults(immediateResults);
    if (!hasDiceResults) {
      setHasDiceResults(true);
    }

    continueButtonRef.current[0].style.display = 'block';

  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  */

  const [diceResults, setDiceResults] = useState(Array(numberOfDices).fill(null));
  const [finalDestination, setFinalDestination] = useState(null);
  const [resetDice, setResetDice] = useState(false);
  const feedbackRef = useRef([]);
  const dicesContainerRef = useRef([]);

  const resetComponent = () => {
    console.log('resetComponent');
    setDiceResults(Array(numberOfDices).fill(null));
    setFinalDestination(null);
    setFeedback('');
    continueButtonRef.current[0].style.opacity = 0;
    continueButtonRef.current[0].style.visibility = 'hidden';
    continueButtonRef.current[0].style.animation = 'none';
    dicesContainerRef.current[0].style.animation = 'none';
    feedbackRef.current[0].style.animation = 'none';
    setResetDice(true);
  };

  const handleDiceResult = (index, result) => {
    setDiceResults(prevResults => {
      const newResults = [...prevResults];
      newResults[index] = result;
      return newResults;
    });
  };

  useEffect(() => {
    setResetDice(false);
    if (diceResults.every(result => result !== null)) {

      const win = section.resultat.condition?.['1'];
      const winDestination = section.resultat.gagne;
      const loseDestination = section.resultat.perd;

      const total = diceResults.reduce((acc, result) => acc + result, 0);
      
      if (win && win.length > 0 && win.includes(total)) {
        setFeedback(
          `You have made ${total}, you’ve won`
        );
        setFinalDestination(winDestination);
      } else {
        setFeedback(
          `You have made ${total}, you’ve lost`
        );
        setFinalDestination(loseDestination);
      }

      dicesContainerRef.current[0].style.animation = 'slideLeft 2s ease forwards';
      feedbackRef.current[0].style.animation = 'appear 2s ease forwards';
      setTimeout(() => {
        continueButtonRef.current[0].style.visibility = 'visible';
        continueButtonRef.current[0].style.animation = 'appear 2s ease forwards';
      }, 1000);

    }
  }, [diceResults, section, setFinalDestination]);

  const continueToNextSection = () => {
    if(finalDestination !== null) {
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
      resetComponent();
    }
  };

  return (
    <div className={'dice-component-container'}>
      <div ref={(el) => dicesContainerRef.current[0] = el} className={'dices'}>
        {
          dices.current.map((dice, index) => (
            <Dice key={index} onDiceResult={(result) => handleDiceResult(index, result)} resetDice={resetDice} />
          ))
        }
        <h2 ref={(el) => feedbackRef.current[0] = el}>{feedback}</h2>
      </div>
      <button className='continue' ref={(el) => continueButtonRef.current[0] = el} onClick={() => continueToNextSection()}>Continue</button>
    </div>
  );
}

{/*(
        <div className={'container'}>
          {dices.current.map((dice, index) => (
            <div ref={(el) => (dicesRef.current[index] = el)} key={index} className={'dice'}>
              <div className={'face front'}></div>
              <div className={'face back'}></div>
              <div className={'face top'}></div>
              <div className={'face bottom'}></div>
              <div className={'face right'}></div>
              <div className={'face left'}></div>
            </div>
          ))}
        </div>
      )*/}
      {
        /*
        <button ref={(el) => rollDicesButtonRef.current[0] = el} onClick={throwDices}>Roll dices</button>
        */
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
