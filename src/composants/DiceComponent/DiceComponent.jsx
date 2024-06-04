import './DiceComponent.scss';
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Dice } from '../Dice/Dice';

export function DiceComponent({
  currentSection,
  numberOfDices = 2,
  numberOfFaces = 6,
  handleNextSection,
  section,
  characterId
}) {
  const isMounted = useRef(false);
  const [feedback, setFeedback] = useState('');
  const [aventure, setAventure] = useState([]);
  const { user } = useAuth();
  const eventIsDispatched = useRef();

  const API_URL = import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000';

  useEffect(() => {
    if (!user) return;
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
  }, [characterId, section, user]);

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

  useEffect(() => {
    if (eventIsDispatched.current) return;
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: user.token },
      body: JSON.stringify({ events: currentSection.events })
    };

    fetch(`${API_URL}/personnages/${characterId}/events`, requestOptions).then((response) =>
      response.json().catch((error) => console.error(error))
    );
    eventIsDispatched.current = true;
  }, [API_URL, characterId, currentSection.events, user.token]);

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
    setDiceResults((prevResults) => {
      const newResults = [...prevResults];
      newResults[index] = result;
      return newResults;
    });
  };

  useEffect(() => {
    setResetDice(false);
    if (diceResults.every((result) => result !== null)) {
      const win = section.resultat.condition?.['1'];
      const winDestination = section.resultat.gagne;
      const loseDestination = section.resultat.perd;

      const total = diceResults.reduce((acc, result) => acc + result, 0);

      if (win && win.length > 0 && win.includes(total)) {
        setFeedback(`You have made ${total}, you’ve won`);
        setFinalDestination(winDestination);
      } else {
        setFeedback(`You have made ${total}, you’ve lost`);
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
    if (finalDestination !== null) {
      handleNextSection(finalDestination);

      if (!user) return;
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
        response.json().catch((error) => console.error(error))
      );
      resetComponent();
    }
  };

  return (
    <div className={'dice-component-container'}>
      <div ref={(el) => (dicesContainerRef.current[0] = el)} className={'dices'}>
        {dices.current.map((dice, index) => (
          <Dice
            key={index}
            onDiceResult={(result) => handleDiceResult(index, result)}
            resetDice={resetDice}
          />
        ))}
        <h2 ref={(el) => (feedbackRef.current[0] = el)}>{feedback}</h2>
      </div>
      <button
        className="continue"
        ref={(el) => (continueButtonRef.current[0] = el)}
        onClick={() => continueToNextSection()}>
        Continue
      </button>
    </div>
  );
}

DiceComponent.propTypes = {
  currentSection: PropTypes.object.isRequired,
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
