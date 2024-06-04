import './TextPagination.scss';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const maxChar = 200;

export function TextPagination({ text }) {
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [textsArray, setTextsArray] = useState([]);

  useEffect(() => {
    setNumberOfPages(Math.ceil(text.length / maxChar));
    setTextsArray(text.match(new RegExp(`.{1,${maxChar}}`, 'g')));
    setCurrentPage(1);
  }, [text]);

  function handleNextPage() {
    setCurrentPage(currentPage + 1);
  }

  function handlePreviousPage() {
    setCurrentPage(currentPage - 1);
  }

  return (
    <div className={'text-pagination'}>
      <p>{textsArray[currentPage]}</p>
      <button onClick={handlePreviousPage} disabled={currentPage === 1}>
        Previous
      </button>
      <span>
        {currentPage}/{numberOfPages}
      </span>
      <button onClick={handleNextPage} disabled={currentPage === numberOfPages}>
        Next
      </button>
    </div>
  );
}

TextPagination.propTypes = {
  text: PropTypes.string
};
