import './LibraryView.scss';
import { useEffect, useState } from 'react';
import { BookCard } from '@/composants/BookCard/BookCard.jsx';
import { NavLink } from 'react-router-dom';

export function LibraryView() {
  const [, setSearch] = useState('');
  const [books, setBooks] = useState([]);

  const apiURL = import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000/';

  useEffect(() => {
    // Fetch books from the server
    if (!apiURL) return console.error('No API URL provided', apiURL);
    fetch(`${apiURL}/livres`).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setBooks(data);
        });
      } else {
        console.error('Error fetching books');
      }
    });
  }, []);

  function handleSearch(e) {
    setSearch(e.target.value);

    // Filter books by title or ID
    const filteredBooks = books.filter(
      (book) =>
        book.titre.toLowerCase().includes(e.target.value.toLowerCase()) ||
        book.id.toString().includes(e.target.value)
    );

    setBooks(filteredBooks);

    // If search is empty, show all books
    if (!e.target.value) {
      // Fetch books from the server
      console.log('fetching books for the search');
      fetch(`${apiURL}/livres`).then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setBooks(data);
          });
        } else {
          console.error('Error fetching books');
        }
      });
    }
  }

  return (
    <div className={'library-view'}>
      <div className={'library-view-content'}>
        <header className={'library-view-header'}>
          <h1>Library</h1>
          <form>
            <input type="text" placeholder="Search a title or a type" onChange={handleSearch} />
          </form>
        </header>
        <div className={'library-view-books'}>
          {books.map((book, index) => (
            <NavLink to={`/book/${book.id}`} key={index}>
              <BookCard book={book} handleFavourite={() => {}} key={index} />
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
