import './EnigmaComponent.scss';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

export function EnigmaComponent({ handleNextSection, section }) {
  const [feedback, setFeedback] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {}, []);

  async function handleResults(results) {
    const win = section.resultat.condition;
    const winDestination = section.resultat.gagne;
    const loseDestination = section.resultat.perd;
    let levenschteinResults = null;
    let finalDestination = null;
    let token = Cookies.get('token');

    try {
      await fetch(
        (import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000') + '/levenschtein',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token
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
          } else {
            console.error('Could not get lenvenschtein results');
          }
        })
      );
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire de connexion:', error);
    }

    if (levenschteinResults && levenschteinResults?.percent >= 50) {
      setFeedback(`That's the right answer! You are going to section ${winDestination}!`);
      finalDestination = winDestination;
    } else {
      setFeedback(`That's the wrong answer! You are going to section ${loseDestination}!`);
      finalDestination = loseDestination;
    }

    setTimeout(() => {
      handleNextSection(finalDestination);
    }, 2000);
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
  handleNextSection: PropTypes.func
};
