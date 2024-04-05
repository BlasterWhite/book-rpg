import PropTypes from 'prop-types';
import './SectionView.scss';
import { MultipleChoiceComponent } from '@/composants/MultipleChoiceComponent.jsx';
import { DiceComponent } from '@/composants/DiceComponent/DiceComponent.jsx';
import { EnigmaComponent } from '../../composants/EnigmaComponent/EnigmaComponent';
import { FightComponent } from '@/composants/FightComponent/FightComponent.jsx';

export function SectionView({ section, handleNextSection, characterId }) {
  const { texte, sections, image, type } = section;

  function interracivity() {
    if (type) {
      if (type === 'choix')
        return (
          <MultipleChoiceComponent
            sections={sections}
            handleSectionClicked={(e) => handleNextSection(e)}
          />
        );
      if (type === 'combat')
        return (
          <FightComponent
            handleNextSection={handleNextSection}
            section={section}
            characterId={characterId}
          />
        );
      if (type === 'enigme')
        return <EnigmaComponent handleNextSection={handleNextSection} section={section} />;
      if (type === 'des')
        return (
          <DiceComponent
            numberOfDices={2}
            numberOfFaces={6}
            handleNextSection={handleNextSection}
            section={section}
          />
        );
      if (type === 'termine') return <h2>Fin</h2>;
      if (type === 'none') return <h2>None</h2>;
    }
  }

  let imageSrc = image.image;
  if (image && image.image && image.image.startsWith('Pas')) {
    imageSrc = 'https://placehold.co/500x500.png';
  }

  return (
    <div className={'section-view'}>
      <div className={'scenario'}>
        <p className={'text-scenario'}>{texte}</p>
        <img src={imageSrc} alt={'Section image'} />
      </div>
      {interracivity()}
    </div>
  );
}

SectionView.propTypes = {
  section: PropTypes.shape({
    id: PropTypes.number.isRequired,
    texte: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    sections: PropTypes.array.isRequired,
    image: PropTypes.object
  }).isRequired,
  handleNextSection: PropTypes.func.isRequired,
  characterId: PropTypes.number
};
