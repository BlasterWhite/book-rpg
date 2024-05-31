import './MultipleChoiceComponent.scss';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';

export function MultipleChoiceComponent({ currentSection, sections, handleSectionClicked, characterId }) {
  const [aventure, setAventure] = useState([]); // [section, setSection
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
  }, [characterId, sections, user]);

+  useEffect(() => {
    if (eventIsDispatched.current) return;
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: user.token },
      body: JSON.stringify({ events: currentSection.events })
    };

    fetch(`${API_URL}/personnages/${characterId}/events`, requestOptions, ).then((response) =>
      response
        .json()
        .catch((error) => console.error(error))
    );

    currentSection.events;
    eventIsDispatched.current = true;
  }, [API_URL, characterId, currentSection.events, user.token]);


  const getNextSection = (id) => {
    handleSectionClicked(id);

    if (!user) return;
    const API_URL = import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000';
    // on récupère la prochaine sections depuis sections
    const section = sections.find((section) => section.id === id);
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
        .then((data) => console.log(data))
        .catch((error) => console.error(error))
    );
  };
  return (
    <div className={'multiple-choice'}>
      {sections.map((choice, index) => {
        return (
          <div className={'choice'} key={index}>
            <button
              type={'button'}
              onClick={() =>
                getNextSection(choice?.association_liaison_section?.id_section_destination)
              }
            >
              Aller à la section {choice.numero_section}
            </button>
          </div>
        );
      })}
    </div>
  );
}

MultipleChoiceComponent.propTypes = {
  currentSection: PropTypes.object.isRequired,
  sections: PropTypes.array.isRequired,
  handleSectionClicked: PropTypes.func.isRequired,
  characterId: PropTypes.string.isRequired
};
