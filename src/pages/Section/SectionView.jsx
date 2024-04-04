import PropTypes from 'prop-types';
import './SectionView.scss';
import { MultipleChoiceComponent } from '@/composants/MultipleChoiceComponent.jsx';

export function SectionView({section, handleSectionClicked}) {
    const {texte, sections} = section;



  let image;
  fetch('http://193.168.146.103:3000/images/2')
    .then((response) => response.json())
    .then((data) => (image = data));
  return (
    <div className={'section-view'}>
      <div className={'scenario'}>
        <p className={'text-scenario'}>{texte}</p>
        <img
          src={image != null ? image : '/src/assets/images/placeholder.png'}
          alt={'Section image'}
        />
      </div>
      <MultipleChoiceComponent
        sections={sections}
        handleSectionClicked={(e) => handleSectionClicked(e)}
      />
    </div>
  );
}

SectionView.propTypes = {
  section: PropTypes.shape({
    id: PropTypes.number.isRequired,
    texte: PropTypes.string.isRequired,
    sections: PropTypes.array.isRequired
  }).isRequired,
  handleSectionClicked: PropTypes.func.isRequired
};
