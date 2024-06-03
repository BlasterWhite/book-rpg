import PropTypes from 'prop-types';
import './SectionView.scss';
import { MultipleChoiceComponent } from '@/composants/MultipleChoiceComponent.jsx';
import { DiceComponent } from '@/composants/DiceComponent/DiceComponent.jsx';
import { EnigmaComponent } from '../../composants/EnigmaComponent/EnigmaComponent';
import { FightComponent } from '@/composants/FightComponent/FightComponent.jsx';
import { ProtectedRoute } from '@/pages/ProtectedRoute.jsx';
import { Inventory } from '@/composants/Inventory/Inventory.jsx';

export function SectionView({ section, handleNextSection, characterId }) {
  const { texte, sections, image, type } = section;

  function interactivity() {
    if (type) {
      if (type === 'choix')
        return (
          <MultipleChoiceComponent
            currentSection={section}
            sections={sections}
            handleSectionClicked={(e) => handleNextSection(e)}
            characterId={characterId}
          />
        );
      if (type === 'combat')
        return (
          <FightComponent
            currentSection={section}
            handleNextSection={handleNextSection}
            section={section}
            characterId={characterId}
          />
        );
      if (type === 'enigme')
        return (
          <EnigmaComponent
            currentSection={section}
            handleNextSection={handleNextSection}
            section={section}
            characterId={characterId}
          />
        );
      if (type === 'des')
        return (
          <DiceComponent
            currentSection={section}
            numberOfDices={2}
            numberOfFaces={6}
            handleNextSection={handleNextSection}
            section={section}
            characterId={characterId}
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
      <Inventory characterId={characterId} />
      <div className={'scenario'}>
        <div className={'text-scenario'}>
          <p>{texte}</p>
        </div>
        <div className={'image-scenario'} style={{ backgroundImage: `url('${imageSrc}')` }} />
      </div>
      <div className={'interactivity'}>{interactivity()}</div>
      <ProtectedRoute permissions={['admin']}>
        <div className={'admin'}>
          <details>
            <summary>Debug ADMIN ONLY</summary>
            <pre>{JSON.stringify(section, null, 2)}</pre>
          </details>
        </div>
      </ProtectedRoute>
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
  characterId: PropTypes.string
};
