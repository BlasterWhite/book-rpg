import './MultipleChoiceComponent.scss';
import PropTypes from 'prop-types';

export function MultipleChoiceComponent({ sections, handleSectionClicked }) {
  const getNextSection = (id) => {
    handleSectionClicked(id);
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
              Aller à la section {choice?.association_liaison_section?.id_section_destination}
            </button>
          </div>
        );
      })}
    </div>
  );
}

MultipleChoiceComponent.propTypes = {
  sections: PropTypes.array.isRequired,
  handleSectionClicked: PropTypes.func.isRequired
};
