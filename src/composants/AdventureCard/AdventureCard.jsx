import './AdventureCard.scss';
import PropTypes from 'prop-types';

export function AdventureCard({ adventure, handleFavourite }) {
  return (
    <div className={'adventure-card'}>
      <div className={'adventure-card-content'}>
        <h3>Adventure {adventure.id}</h3>
      </div>
    </div>
  );
}

AdventureCard.propTypes = {
  adventure: PropTypes.shape({
    id: PropTypes.number.isRequired
  }).isRequired,
  handleFavourite: PropTypes.func.isRequired
};
