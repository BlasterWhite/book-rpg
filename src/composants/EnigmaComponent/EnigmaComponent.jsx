import './EnigmaComponent.scss';
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '@/contexts/AuthContext.jsx';

export function EnigmaComponent({ currentSection, handleNextSection, section, characterId }) {
  const [feedback, setFeedback] = useState('');
  const [search, setSearch] = useState('');
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
    // on fait une requête put sur l'aventure
  }, [characterId, section, user]);

  useEffect(() => {
    if (eventIsDispatched.current) return;
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: user.token },
      body: JSON.stringify({ events: currentSection.events })
    };

    fetch(`${API_URL}/personnages/${characterId}/events`, requestOptions).then((response) =>
      response
        .json()
        .catch((error) => console.error(error))
    );

    currentSection.events;
    eventIsDispatched.current = true;
  }, [API_URL, characterId, currentSection.events, user.token]);

  async function handleResults() {
    const win = section.resultat.condition;
    const winDestination = section.resultat.gagne;
    const loseDestination = section.resultat.perd;
    let levenschteinResults = null;
    let finalDestination = null;

    try {
      if (!user) return;
    // on récupère la prochaine sections depuis sections
      await fetch(`${API_URL}/levenschtein`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: user.token
          },
          body: JSON.stringify({
            chaine1: win.trim().toLowerCase(),
            chaine2: search.trim().toLowerCase()
          })
        }
      ).then((response) =>
        response.json().then((data) => {
          if (!data.error) {
            levenschteinResults = data;

            if (levenschteinResults && levenschteinResults?.percent >= 50) {
              setFeedback(`That's the right answer! You are going to section ${winDestination}!`);
              finalDestination = winDestination;
            } else {
              setFeedback(`That's the wrong answer! You are going to section ${loseDestination}!`);
              finalDestination = loseDestination;
            }

            setTimeout(() => {
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
                response
                  .json()
                  .catch((error) => console.error(error))
              );
            }, 2000);
          } else {
            console.error('Could not get lenvenschtein results');
          }
        })
      );
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire de connexion:', error);
    }
  }

  function saveAnswer(e) {
    setSearch(e.target.value);
  }

  function submitAnswer(e) {
    e.preventDefault();
    handleResults(search);
  }

  return (
    <div>
      <h2>{feedback}</h2>
      <div>
        <form onSubmit={submitAnswer} className="enigma-answer-container">
          <input type="text" placeholder="Your answer" onChange={saveAnswer} />
          <button onClick={submitAnswer}>Submit Answer</button>
        </form>
      </div>
    </div>
  );
}

EnigmaComponent.propTypes = {
  currentSection: PropTypes.object.isRequired,
  section: PropTypes.shape({
    id: PropTypes.number.isRequired,
    texte: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    sections: PropTypes.array.isRequired,
    image: PropTypes.object,
    resultat: PropTypes.shape({
      condition: PropTypes.string,
      gagne: PropTypes.number,
      perd: PropTypes.number
    }).isRequired
  }).isRequired,
  handleNextSection: PropTypes.func,
  characterId: PropTypes.number.isRequired
};
