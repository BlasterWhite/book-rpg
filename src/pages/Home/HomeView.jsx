import './HomeView.scss';
import newIcon from '@/assets/icons/newIcon.svg';
import stonksIcon from '@/assets/icons/StonksIcon.svg';
import { useNavigate } from 'react-router-dom';
import { BookCard } from '@/composants/BookCard/BookCard.jsx';
import { useEffect, useState } from 'react';

export function HomeView() {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);

  const [newBooks, setNewBooks] = useState([]);

  const apiURL = import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000';

  useEffect(() => {
    // Fetch books from the server
    if (!apiURL) return console.error('No API URL provided', apiURL);
    fetch(`${apiURL}/livres`).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          // Set the first 4 books as new books
          setNewBooks(data.slice(0, 4));
        });
      } else {
        console.error('Error fetching books');
      }
    });
  }, [apiURL]);

  function handleClick() {
    navigate('/book');
  }

  const handleFavourite = (id) => {
    const newBooks = books.map((book) => {
      if (book.id === id) {
        book.fav = !book.fav;
      }
      return book;
    });
    setBooks(newBooks);
  };

  return (
    <div className={'home-view'}>
      <h1 className={'company'}>Book RPG</h1>
      <div className={'home-content'}>
        <div className={'home-header'}>
          <div className={'left'}>
            <h2>
              Create your own <span className={'text-gradient'}>Adventure</span>
            </h2>
            <button className={'btn'} onClick={handleClick}>
              Discover our library
            </button>
          </div>
          <div className={'right'}>
            <img src="/test.png" alt={'Home page'} className={'home-image'} />
          </div>
        </div>
        <p>
          Welcome to Book RPG, where every reader becomes the hero of their own adventure! Our
          online library is a treasure trove of immersive stories spanning genres from fantasy to
          science fiction, mystery to romance, where readers are not just spectators but active
          participants in the narrative. Dive into our vast collection and embark on epic quests,
          solve perplexing mysteries, and experience thrilling adventures, all from the comfort of
          your favorite reading spot. With Book RPG, the power to shape your own destiny is at your
          fingertips. Join us and let your imagination soar as you become the hero of your own tale!
        </p>
        <div className={'home-popular-books'}>
          <h3 className={'popular-title'}>
            <img src={stonksIcon} alt="Popular icon" />
            Popular adventures
          </h3>
          <div className={'popular-books'}>
            {newBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                handleFavourite={() => handleFavourite(book.id)}
              />
            ))}
          </div>
        </div>
        <div className={'home-new-books'}>
          <h3 className={'new-title'}>
            <img src={newIcon} alt="New icon" />
            New adventures
          </h3>
          <div className={'new-books'}>
            {newBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                handleFavourite={() => handleFavourite(book.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
