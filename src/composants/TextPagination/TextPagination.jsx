import './TextPagination.scss';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const maxChar = 700;

export function TextPagination({ text }) {
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [textsArray, setTextsArray] = useState([]);

  function splitText(text) {
    const words = text.split(' ');
    const pages = [];
    let currentPage = '';
    words.forEach((word) => {
      if (currentPage.length + word.length < maxChar) {
        currentPage += word + ' ';
      } else {
        pages.push(currentPage);
        currentPage = word + ' ';
      }
    });
    pages.push(currentPage);
    return pages;
  }

  useEffect(() => {
    setTextsArray(splitText(text));
    setNumberOfPages(splitText(text).length);
    setCurrentPage(0);
  }, [text]);

  function handleNextPage() {
    if (currentPage <= numberOfPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  function handlePreviousPage() {
    if (currentPage >= 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  return (
    <div className={'text-pagination'}>
      <p>{textsArray[currentPage]}</p>
      {numberOfPages > 1 ? (
        <div className={'actions'}>
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            className={'previous-page'}>
            <img src={'/icons/pagination_left.svg'} alt={'previous'} />
          </button>
          <span>
            {currentPage + 1} / {numberOfPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === numberOfPages - 1}
            className={'next-page'}>
            <img src={'/icons/pagination_right.svg'} alt={'next'} />
          </button>
        </div>
      ) : null}
    </div>
  );
}

TextPagination.propTypes = {
  text: PropTypes.string
};
