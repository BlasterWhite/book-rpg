import PropTypes from 'prop-types';
import './SectionView.scss';
import { MultipleChoiceComponent } from '@/composants/MultipleChoiceComponent.jsx';

export function SectionView({ section, handleSectionClicked }) {
  const { texte, sections, image, type } = section;

  function interracivity() {
    if (type) {
      if (type === 'choix')
        return (
          <MultipleChoiceComponent
            sections={sections}
            handleSectionClicked={(e) => handleSectionClicked(e)}
          />
        );
      if (type === 'combat') return <h2>Combat</h2>;
      if (type === 'enigme') return <h2>Enigme</h2>;
      if (type === 'des') return <h2>Des</h2>;
      if (type === 'termine') return <h2>Fin</h2>;
      if (type === 'none') return <h2>None</h2>;
    }
  }

  return (
    <div className={'section-view'}>
      <div className={'scenario'}>
        <p className={'text-scenario'}>{texte}</p>
        <img
          src={image?.image ? image.image : '/src/assets/images/placeholder.png'}
          alt={'Section image'}
        />
      </div>
      {interracivity()}
    </div>
  );
}

SectionView.propTypes = {
  section: PropTypes.shape({
    id: PropTypes.number.isRequired,
    texte: PropTypes.string.isRequired,
    sections: PropTypes.array.isRequired,
    image: PropTypes.object
  }).isRequired,
  handleSectionClicked: PropTypes.func.isRequired
};
