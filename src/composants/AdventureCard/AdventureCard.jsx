import './AdventureCard.scss';
import PropTypes from 'prop-types';

export function AdventureCard({ adventure, book, handleFavourite }) {

  function redirect() {
    window.location.href = `/book/${book.id}/${adventure.id_personnage}/${adventure.id_section_actuelle}`;
  }

  return (
    <div onClick={() => redirect()} className={'adventure-card'}>
      <div className={'adventure-card-content'}>
        <h3>Adventure {adventure.id}</h3>
      </div>
    </div>
  );
}

AdventureCard.propTypes = {
  adventure: PropTypes.shape({
    id: PropTypes.number.isRequired
  }).isRequired
};
