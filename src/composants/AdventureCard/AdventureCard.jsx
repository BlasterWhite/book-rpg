import './AdventureCard.scss';
import PropTypes from 'prop-types';
import DeleteIcon from '@/assets/icons/DeleteIcon.svg';


export function AdventureCard({ adventure, book, handleDelete }) {
  function redirect() {
    window.location.href = `/book/${book.id}/${adventure.id_personnage}/${adventure.id_section_actuelle}`;
  }

  return (
    <div onClick={() => redirect()} className={'adventure-card'}>
      <div className={'adventure-card-content'}>
        <h3>Adventure {adventure.id}</h3>
      </div>
      <img className={'icon delete'} src={DeleteIcon} alt="Delete" onClick={(e) => handleDelete(e, adventure)} />
    </div>
  );
}

AdventureCard.propTypes = {
  adventure: PropTypes.shape({
    id: PropTypes.number.isRequired,
    id_personnage: PropTypes.number.isRequired,
    id_section_actuelle: PropTypes.number.isRequired
  }).isRequired,
  book: PropTypes.shape({
    id: PropTypes.number.isRequired
  }).isRequired,
  handleDelete: PropTypes.func.isRequired
};
