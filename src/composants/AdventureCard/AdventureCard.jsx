import './AdventureCard.scss';
import PropTypes from 'prop-types';
import PlayIcon from '@/assets/icons/PlayIcon.svg';
import DeleteIcon from '@/assets/icons/DeleteIcon.svg';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

export function AdventureCard({ adventure, book, deleteFn }) {
  function redirect(e) {
    e.stopPropagation();
    window.location.href = `/book/${book.id}/${adventure.id_personnage}/${adventure.id_section_actuelle}`;
  }

  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (adventure?.statut === 'termine') {
      setIsFinished(true);
    }
  }, [adventure, setIsFinished]);

  return (
    <div className={'adventure-card'}>
      <div className={'adventure-card-left'}>
        <div className={'adventure-card-title'}>
          Adventure {dayjs(adventure.updated_at).format('D MMM YYYY')}
        </div>
        <div className={'adventure-card-description'}>
          {isFinished
            ? 'Finished'
            : 'Current section: ' + adventure.section.numero_section + ' - ' + 'In progress'}
        </div>
      </div>
      <div className={'adventure-card-right'} onClick={() => deleteFn(adventure.id)}>
        <div className={'adventure-card-button delete'}>
          <img src={DeleteIcon} alt={'delete'} />
        </div>
        {isFinished ? null : (
          <div className={'adventure-card-button play'} onClick={(e) => redirect(e)}>
            <img src={PlayIcon} alt={'play'} />
          </div>
        )}
      </div>
    </div>
  );
}

AdventureCard.propTypes = {
  adventure: PropTypes.shape({
    id: PropTypes.number.isRequired,
    id_personnage: PropTypes.number.isRequired,
    id_section_actuelle: PropTypes.number.isRequired,
    statut: PropTypes.string
  }).isRequired,
  book: PropTypes.shape({
    id: PropTypes.number.isRequired
  }).isRequired,
  deleteFn: PropTypes.func
};
