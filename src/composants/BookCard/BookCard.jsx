import './BookCard.scss';
import fullStar from '@/assets/icons/FullStarIcon.svg';
import emptyStar from '@/assets/icons/EmptyStarIcon.svg';
import PropTypes from 'prop-types';

export function BookCard({ book, handleFavourite }) {
  const { titre, image, fav } = book;
  const handleClick = () => {
    handleFavourite(book.id);
  };

  return (
    <div className={'book-card'}>
      <div className={'book-card-favourite-overlay'}>
        <img
          src={fav ? fullStar : emptyStar}
          alt={'Favourite'}
          className={fav ? 'favourite' : ''}
          onClick={() => handleClick()}
        />
      </div>
      <img src={image.image || 'https://placehold.co/270x500.png'} alt={'Book cover'} />
      <div className={'book-card-content'}>
        <h3>{titre}</h3>
      </div>
    </div>
  );
}

BookCard.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.number.isRequired,
    titre: PropTypes.string.isRequired,
    image: PropTypes.string,
    fav: PropTypes.bool
  }).isRequired,
  handleFavourite: PropTypes.func
};
