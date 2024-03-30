import './AdminBookListView.scss';
import EditIcon from '@/assets/icons/EditIcon.svg';
import DeleteIcon from '@/assets/icons/DeleteIcon.svg';
import Mock from '@/assets/mock.json';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

export function AdminBookListView() {
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

  return (
    <div className={'admin-book-list-view'}>
      <h1 className={'title'}>Admin</h1>
      <input
        type="text"
        placeholder="Search on title or ID"
        className={'search'}
        onChange={handleSearch}
      />
      <div className={'book-list'}>
        {books.map((book, index) => (
          <div key={index} className={'book'}>
            <div className={'book-info'}>
              <div className={'book-title'}>{book.title}</div>
              <div className={'book-id'}>ID: {book.id}</div>
            </div>
            <div className={'book-actions'}>
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
