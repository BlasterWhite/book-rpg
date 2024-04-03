import './AdminBookListView.scss';
import EditIcon from '@/assets/icons/EditIcon.svg';
import DeleteIcon from '@/assets/icons/DeleteIcon.svg';
import NodeIcon from '@/assets/icons/BookIcon.svg';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import AddIcon from '@/assets/icons/AddIcon.svg';

export function AdminBookListView() {
  const [, setSearch] = useState('');
  const [books, setBooks] = useState([]);

  const apiURL = import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000';

  useEffect(() => {
    // Fetch books from the server
    fetch(`${apiURL}/livres`).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setBooks(data);
        });
      } else {
        console.error('Error fetching books');
      }
    });
  }, [apiURL]);

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

  async function handleDeleteBook(id) {
    console.log('Delete book', id);
    await fetch(`${apiURL}/livres/${id}`, {
      method: 'DELETE'
    }).then((response) => {
      if (response.ok) {
        // Remove the book from the list
        setBooks(books.filter((book) => book.id !== id));
      } else {
        console.error('Error deleting book');
      }
    });
  }

  async function handleCreateBook() {
    console.log('Create a book');
    let book = {
      titre: 'New book',
      id_image: 1,
      resume: '',
      date_sortie: new Date().toISOString().split('T')[0],
      tag: 'Book'
    };

    // TODO: Implement the API call to create a new book
    // Post the new book to the server
    const response = await fetch(`${apiURL}/livres`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(book)
    });
    const resData = await response.json();

    // Add the new book to the list
    setBooks([...books, resData]);
  }

  return (
    <div className={'admin-book-list-view'}>
      <h1 className={'title'}>Admin | Book list</h1>
      <div className={'actions'}>
        <input
          type="text"
          placeholder="Search on title or ID"
          className={'search'}
          onChange={handleSearch}
        />
        <button className={'btn add-section'} onClick={handleCreateBook}>
          <img className={'icon'} src={AddIcon} alt="Add icon" />
          Create a book
        </button>
      </div>
      <div className={'book-list'}>
        {books.map((book, index) => (
          <div key={index} className={'book'}>
            <div className={'book-info'}>
              <div className={'book-title'}>{book.titre}</div>
              <div className={'book-id'}>ID: {book.id}</div>
            </div>
            <div className={'book-actions'}>
              <NavLink to={`/admin/${book.id}/section`}>
                <img className={'icon edit'} src={NodeIcon} alt="Edit" />
              </NavLink>{' '}
              <NavLink to={`/admin/${book.id}`}>
                <img className={'icon edit'} src={EditIcon} alt="Edit" />
              </NavLink>
              <a onClick={() => handleDeleteBook(book.id)}>
                <img className={'icon delete'} src={DeleteIcon} alt="Delete" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
