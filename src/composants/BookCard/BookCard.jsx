import './BookCard.scss';
import fullStar from '@/assets/icons/FullStarIcon.svg';
import emptyStar from '@/assets/icons/EmptyStarIcon.svg';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export function BookCard({ book, handleFavourite, books, favourites }) {
  const { titre, image, fav } = book;
  const [isFav, setIsFav] = useState(fav);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClickFavourite = (e) => {
    e.stopPropagation();

    handleFavourite(book.id);
    setIsFav(!isFav);
    const apiURL = import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000';
    if (isFav) {
      fetch(`${apiURL}/users/favoris/${book.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: user.token
        }
      }).catch((error) => console.error('Error fetching books', error));
    } else {
      fetch(`${apiURL}/users/favoris/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: user.token
        },
        body: JSON.stringify({ id_livre: book.id })
      }).catch((error) => console.error('Error fetching books', error));
    }
  };

  const handleClick = () => {
    navigate(`/book/${book.id}`);
  };

  let imageSrc = image?.image || null;
  if (image && image.image && image.image.startsWith('Pas')) {
    imageSrc = image.image;
  }
  if (!(image && image.image)) {
    imageSrc = 'https://placehold.co/270x500.png';
  }

  useEffect(() => {
    if (books && user && favourites.length > 0) {
      let isFavoritFromDb = false;
      for (const f of favourites) {
        if (f.id_livre === book.id) {
          isFavoritFromDb = true;
          break;
        }
      }
      setIsFav(isFavoritFromDb);
    }
  }, [book.id, books, favourites, user]);

  if (book)
    return (
      <div className={'book-card'} onClick={handleClick}>
        <div className={'book-card-favourite-overlay'}>
          <img
            src={isFav ? fullStar : emptyStar}
            alt={'Favourite'}
            className={fav ? 'favourite' : ''}
            onClick={(e) => handleClickFavourite(e)}
          />
        </div>
        <img src={imageSrc} alt={'Book cover'} />
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
    image: PropTypes.object,
    fav: PropTypes.bool
  }).isRequired,
  handleFavourite: PropTypes.func,
  books: PropTypes.array,
  favourites: PropTypes.array
};
