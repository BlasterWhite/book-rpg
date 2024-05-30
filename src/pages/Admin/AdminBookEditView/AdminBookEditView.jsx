import './AdminBookEditView.scss';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BaseButton } from '@/composants/Base/BaseButton/BaseButton.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';

export function AdminBookEditView() {
  const { bookId } = useParams();

  const [EditBook, setEditBook] = useState({});
  const navigate = useNavigate();

  const apiURL = import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000';
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    fetch(`${apiURL}/livres/${bookId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: user.token
      }
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setEditBook(data);
        });
      } else {
        console.error('Error fetching books');
      }
    });
  }, [bookId, apiURL, user]);

  function editBook(e) {
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

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return;

    let id_image = 0;

    if (image) {
      console.log('Uploading image');
      await fetch(`${apiURL}/images/url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: user.token
        },
        body: JSON.stringify({ url: image })
      }).then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            fetch(`${apiURL}/livres/${bookId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: user.token
              },
              body: JSON.stringify({ ...EditBook, id_image: data.id })
            }).then((response) => {
              if (response.ok) {
                navigate('/admin');
              } else {
                console.error('Error updating book');
              }
            });
          });
        } else {
          console.error('Error uploading image');
        }
      });
    } else if (imageAi) {
      await fetch(`${apiURL}/images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: user.token
        },
        body: JSON.stringify({ prompt: EditBook.resume })
      }).then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            fetch(`${apiURL}/livres/${bookId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: user.token
              },
              body: JSON.stringify({ ...EditBook, id_image: data.id })
            }).then((response) => {
              if (response.ok) {
                navigate('/admin');
              } else {
                console.error('Error updating book');
              }
            });
          });
        } else {
          console.error('Error uploading image');
        }
      });
    } else {
      await fetch(`${apiURL}/livres/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: user.token
        },
        body: JSON.stringify({ ...EditBook, id_image })
      }).then((response) => {
        if (response.ok) {
          navigate('/admin');
        } else {
          console.error('Error updating book');
        }
      });
    }
  }

  const [image, setImage] = useState('');
  const [imageAi, setImageAi] = useState(false);

  return (
    <div className={'admin-book-edit-view'}>
      <h1 className={'title'}>Admin</h1>
      <NavLink to={'/admin/book'}>← Back admin book list</NavLink>
      <form onSubmit={handleSubmit}>
        <label htmlFor="titre">Title:</label>
        <input type="text" id="titre" name="titre" value={EditBook.titre} onChange={editBook} />
        <label htmlFor="resume">Summary:</label>
        <textarea id="resume" name="resume" value={EditBook.resume} onChange={editBook} />
        <label htmlFor="image">Image:</label>
        <details>
          <summary>Actual image</summary>
          <img className={'image-preview'} src={EditBook?.image?.image} alt="image preview" />
        </details>
        <input
          type="text"
          id="image"
          name="image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <div>
          <label htmlFor="ai">AI:</label>
          <input
            type="checkbox"
            id="ai"
            name="ai"
            value={imageAi}
            onChange={(e) => setImageAi(e.target.checked)}
          />
        </div>
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
              <BaseButton text={'Add'} onClick={handleAddTag} />
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
            <BaseButton text={'Cancel'} outlined={true} />
          </NavLink>
          <BaseButton text={'Save'} type={'submit'} />
        </div>
      </form>
    </div>
  );
}
