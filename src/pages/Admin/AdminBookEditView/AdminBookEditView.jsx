import './AdminBookEditView.scss';
import Mock from '@/assets/mock.json';
import { NavLink, useParams } from 'react-router-dom';
import { useState } from 'react';

export function AdminBookEditView() {
  const { id } = useParams();
  let book = Mock.books?.find((book) => book.id === id);
  if (!book) {
    book = {
      id: '',
      title: '',
      resume: '',
      image: '',
      releaseDate: '',
      tags: []
    };
  }

  function editBook(e) {
    setEditBook((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const [EditBook, setEditBook] = useState(book);

  const [newTag, setNewTag] = useState('');

  function handleAddTag() {
    const tags = EditBook.tags.split(';');
    tags.push(newTag);
    setEditBook((prev) => ({ ...prev, tags: tags.join(';') }));
    setNewTag('');
  }

  function handleRemoveTag(tag) {
    const tags = EditBook.tags.split(';');
    const newTags = tags.filter((t) => t !== tag);
    setEditBook((prev) => ({ ...prev, tags: newTags.join(';') }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(EditBook);
  }

  return (
    <div className={'admin-book-edit-view'}>
      <h1 className={'title'}>Admin</h1>
      <NavLink to={'/admin'}>← Back</NavLink>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" name="title" value={EditBook.title} onChange={editBook} />
        <label htmlFor="resume">Resume:</label>
        <textarea id="resume" name="resume" value={EditBook.resume} onChange={editBook} />
        <label htmlFor="image">Image:</label>
        <input type="text" id="image" name="image" value={EditBook.img} onChange={editBook} />
        <div className={'dual-input'}>
          <div className={'left'}>
            <label htmlFor="releaseDate">Release Date:</label>
            <input
              type="date"
              id="releaseDate"
              name="releaseDate"
              value={EditBook.releaseDate}
              onChange={editBook}
            />
          </div>
          <div className={'separator'}></div>
          <div className={'right'}>
            <label htmlFor="tags">Tags:</label>
            <div className={'add-tag'}>
              <input
                type="text"
                id="tags"
                name="tags"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
              <button onClick={handleAddTag}>Add</button>
            </div>
            <div className={'tags-list'}>
              {EditBook.tags?.split(';')?.map((tag, index) => (
                <div key={index} className={'tag'} onClick={() => handleRemoveTag(tag)}>
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={'actions'}>
          <NavLink to={'/admin'} className={'btn cancel'}>
            <button className={'btn cancel'}>Cancel</button>
          </NavLink>
          <button className={'btn save'} type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
