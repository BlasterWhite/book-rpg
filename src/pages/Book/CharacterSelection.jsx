import { useAuth } from '@/contexts/AuthContext.jsx';
import { Dice } from '@/composants/Dice/Dice.jsx';
import { PropTypes } from 'prop-types';
import './CharacterSelection.scss';
import { useEffect, useState } from 'react';

export function CharacterSelection({ character, updateCharacterHandler }) {
  const { user } = useAuth();
  const [characterStats, setCharacterStats] = useState([0, 0, 0, 0, 0]);

  useEffect(() => {
    setCharacterStats([
      character.force,
      character.dexterite,
      character.endurance,
      character.psychisme,
      character.resistance
    ]);
  }, [character]);
  const API_URL = import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000';

  const handleDiceResult = (index, result) => {
    switch (index) {
      case 0:
        characterStats[0] += result;
        break;
      case 1:
        characterStats[1] += result;
        break;
      case 2:
        characterStats[2] += result;
        break;
      case 3:
        characterStats[3] += result;
        break;
      case 4:
        characterStats[4] += result;
        break;
      default:
        break;
    }
    setCharacterStats([...characterStats]);
  };

  const getAttributFromIndex = (index) => {
    switch (index) {
      case 0:
        return 'Strength';
      case 1:
        return 'Desxterity';
      case 2:
        return 'Stamina';
      case 3:
        return 'Psychisme';
      case 4:
        return 'Durability';
      default:
        return '';
    }
  };

  return characterStats && (
    <div className="character-selection">
      <h1>Character Statistique Génération </h1>
      <div className={'character-selection-all'}>
        {characterStats.map((stat, index) => (
          <div className={'character-selection-container'} key={index}>
            <span><span className={'character-selection-attributs'}>{getAttributFromIndex(index)}</span> : {stat}</span>
            <Dice onDiceResult={(result) => handleDiceResult(index, result)} />
          </div>
        ))}
      </div>

      <button className="submit-button" onClick={() => {
        const requestOptions = {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: user.token },
          body: JSON.stringify({
            force: characterStats[0],
            dexterite: characterStats[1],
            endurance: characterStats[2],
            psychisme: characterStats[3],
            resistance: characterStats[4],
            initialized: true
          })
        };
        fetch(`${API_URL}/personnages/${character.id}`, requestOptions).then((response) => {
          if (response.ok) {
            updateCharacterHandler()
          }
        });
      }}>Save
      </button>
    </div>
  );
}

CharacterSelection.propTypes = {
  character: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nom: PropTypes.string.isRequired,
    description: PropTypes.string,
    id_image: PropTypes.number,
    occupation: PropTypes.string,
    force: PropTypes.number,
    dexterite: PropTypes.number,
    endurance: PropTypes.number,
    psychisme: PropTypes.number,
    resistance: PropTypes.number,
    initialized: PropTypes.bool
  }).isRequired,
  updateCharacterHandler: PropTypes.func.isRequired
};