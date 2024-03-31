import './AdminBookListView.scss';
import EditIcon from '@/assets/icons/EditIcon.svg';
import DeleteIcon from '@/assets/icons/DeleteIcon.svg';
import NodeIcon from '@/assets/icons/BookIcon.svg';
import Mock from '@/assets/mock.json';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AddIcon from '@/assets/icons/AddIcon.svg';
import { v4 as uuid } from 'uuid';

export function AdminBookListView() {
  const navigate = useNavigate();
  const [, setSearch] = useState('');
  const [books, setBooks] = useState(Mock.books);

  function handleSearch(e) {
    setSearch(e.target.value);

    // Filter books by title or ID
    const filteredBooks = Mock.books.filter(
      (book) =>
        book.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
        book.id.toString().includes(e.target.value)
    );

    setBooks(filteredBooks);

    // If search is empty, show all books
    if (!e.target.value) {
      setBooks(Mock.books);
    }
  }

  function handleCreateBook() {
    console.log('Create a book');
    // let book = {
    //   title: 'New book',
    //   img: '',
    //   resume: '',
    //   releaseDate: new Date().toISOString(),
    //   tags: 'Book'
    // };

    // TODO: Implement the API call to create a new book
    // Post the new book to the server
    // const response = await fetch('http://localhost:3000/books', ...);
    // const book = await response.json();

    // Add the new book to the list
    // setBooks([...books, book]);

    // Redirect to the new book
    // navigate(`/admin/${book.id}`);
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
              <div className={'book-title'}>{book.title}</div>
              <div className={'book-id'}>ID: {book.id}</div>
            </div>
            <div className={'book-actions'}>
              <NavLink to={`/admin/${book.id}/section`}>
                <img className={'icon edit'} src={NodeIcon} alt="Edit" />
              </NavLink>{' '}
              <NavLink to={`/admin/${book.id}`}>
                <img className={'icon edit'} src={EditIcon} alt="Edit" />
              </NavLink>
              <img className={'icon delete'} src={DeleteIcon} alt="Delete" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
