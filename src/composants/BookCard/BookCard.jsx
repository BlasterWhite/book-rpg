import './BookCard.scss';

import fullStar from '@/assets/icons/FullStarIcon.svg';
import emptyStar from '@/assets/icons/EmptyStarIcon.svg';
import { useState } from 'react';

export function BookCard({ book, handleFavourite }) {
  const { title, img, fav } = book;
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
      <img src={img} alt={'Book cover'} />
      <div className={'book-card-content'}>
        <h3>{title}</h3>
      </div>
    </div>
  );
}
