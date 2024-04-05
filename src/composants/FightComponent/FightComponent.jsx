import './FightComponent.scss';
import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from '@/composants/AuthContext/AuthContext.jsx';
import { BaseButton } from '@/composants/Base/BaseButton/BaseButton.jsx';

export function FightComponent({ handleNextSection, section, characterId }) {
  const [personnage, setPersonnage] = useState({});
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) return;

    const API_URL = `${import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000'}/personnages/${characterId}`;
    fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: user.token
      }
    }).then((response) =>
      response
        .json()
        .then((data) => {
          setPersonnage(data);
        })
        .catch((error) => console.log(error))
        .catch((error) => console.log(error))
    );
  }, [characterId, user]);

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
          handleNextSection(
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
  characterId: PropTypes.number
};
