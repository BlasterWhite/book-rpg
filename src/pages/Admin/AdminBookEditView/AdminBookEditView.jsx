import './AdminBookEditView.scss';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export function AdminBookEditView() {
  const { bookId } = useParams();

  const [EditBook, setEditBook] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/livres/${bookId}`).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setEditBook(data);
        });
      } else {
        console.error('Error fetching books');
      }
    });
  }, [bookId]);

  function editBook(e) {
    console.log(e.target.name, e.target.value);
    setEditBook((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const [newTag, setNewTag] = useState('');

  function handleAddTag(e) {
    e.preventDefault();
    const tags = EditBook.tag.split(';');
    tags.push(newTag);
    setEditBook((prev) => ({ ...prev, tag: tags.join(';') }));
    setNewTag('');
  }

  function handleRemoveTag(tag) {
    const tags = EditBook.tag.split(';');
    const newTags = tags.filter((t) => t !== tag);
    setEditBook((prev) => ({ ...prev, tag: newTags.join(';') }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    fetch(`${import.meta.env.VITE_API_URL}/livres/${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(EditBook)
    }).then((response) => {
      if (response.ok) {
        console.log('Book updated');
        navigate('/admin');
      } else {
        console.error('Error updating book');
      }
    });
  }

  return (
    <div className={'admin-book-edit-view'}>
      <h1 className={'title'}>Admin</h1>
      <NavLink to={'/admin'}>← Back</NavLink>
      <form onSubmit={handleSubmit}>
        <label htmlFor="titre">Title:</label>
        <input type="text" id="titre" name="titre" value={EditBook.titre} onChange={editBook} />
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
              value={EditBook.date_sortie}
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
              {EditBook.tag?.split(';')?.map((tag, index) => (
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
