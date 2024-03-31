import './AdminNodeListView.scss';
import EditIcon from '@/assets/icons/EditIcon.svg';
import DeleteIcon from '@/assets/icons/DeleteIcon.svg';
import Mock from '@/assets/mock.json';
import { useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';

export function AdminNodeListView() {
  const { bookId } = useParams();
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
    <div className={'admin-section-list-view'}>
      <h1 className={'title'}>Admin {bookId}</h1>
      <div className={'section-header'}>
        <NavLink to={`/admin/`}>← Back to Books</NavLink>
        <input
          type="text"
          placeholder="Search on title or ID"
          className={'search'}
          onChange={handleSearch}
        />
      </div>
      <div className={'section-list'}>
        {books.map((section, index) => (
          <div key={index} className={'section'}>
            <div className={'section-info'}>
              <div className={'section-title'}>{section.title}</div>
              <div className={'section-id'}>ID: {section.id}</div>
            </div>
            <div className={'section-actions'}>
              <NavLink to={`/admin/${section.id}/section/${section.id}`}>
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
