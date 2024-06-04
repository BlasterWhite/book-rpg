import './FightComponent.scss';
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { BaseButton } from '@/composants/Base/BaseButton/BaseButton.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';

export function FightComponent({ currentSection, handleNextSection, section, characterId }) {
  const [personnage, setPersonnage] = useState({});
  const [aventure, setAventure] = useState({});
  const { user } = useAuth();
  const eventIsDispatched = useRef();

  const API_URL = import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000';

  useEffect(() => {
    if (!user) return;

    fetch(`${API_URL}/personnages/${characterId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: user.token
      }
    }).then((response) =>
      response
        .json()
        .then((data) => setPersonnage(data))
        .catch((error) => console.log(error))
        .catch((error) => console.log(error))
    );
  }, [characterId, user]);

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
  }, [characterId, user]);

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

  const handleClick = (id) => {
    handleNextSection(id);

    if (!user) return;
    if (!section) return;

    const statut = section.type === 'termine' ? 'termine' : 'en_cours';
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: user.token },
      body: JSON.stringify({ id_section_actuelle: id, statut: statut })
    };
    const newAventureID = Number.parseInt(aventure.id);
    fetch(`${API_URL}/aventures/${newAventureID}`, requestOptions).then((response) =>
      response
        .json()
        .catch((error) => console.error(error))
    );
  };

  return (
    <div className={'fight-component-container'}>
      <div className={'fight-component-text'}>
        <span>
          Votre attribut de {section.resultat.condition} : {section.resultat.type_condition}{' '}
        </span>
        <strong>
          (
          {personnage[section.resultat.type_condition] >= section.resultat.condition
            ? 'Vous avez perdu'
            : 'Vous avez gagné'}
          )
        </strong>
      </div>
      <BaseButton
        text={
          personnage[section.resultat.type_condition] >= section.resultat.condition
            ? 'Perdu'
            : 'Gagné'
        }
        onClick={() =>
          handleClick(
            personnage[section.resultat.type_condition] >= section.resultat.condition
              ? section.resultat.perd
              : section.resultat.gagne
          )
        }
      />
    </div>
  );
}

FightComponent.propTypes = {
  currentSection: PropTypes.object.isRequired,
  section: PropTypes.shape({
    id: PropTypes.number.isRequired,
    texte: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    sections: PropTypes.array.isRequired,
    image: PropTypes.object,
    resultat: PropTypes.shape({
      condition: PropTypes.string,
      type_condition: PropTypes.string,
      gagne: PropTypes.number,
      perd: PropTypes.number
    }).isRequired
  }).isRequired,
  handleNextSection: PropTypes.func,
  characterId: PropTypes.string.isRequired
};
