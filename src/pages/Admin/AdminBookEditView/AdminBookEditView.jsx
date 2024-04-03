import './AdminBookEditView.scss';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export function AdminBookEditView() {
  const { bookId } = useParams();

  const [EditBook, setEditBook] = useState({});
  const navigate = useNavigate();

  const apiURL = import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000';

  useEffect(() => {
    fetch(`${apiURL}/livres/${bookId}`).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setEditBook(data);
        });
      } else {
        console.error('Error fetching books');
      }
    });
  }, [bookId, apiURL]);

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

    if (image) {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = async () => {
        // CORS
        await fetch(`${apiURL}/images/b64image`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type'
          },
          body: JSON.stringify({ image: reader.result })
        }).then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              setEditBook((prev) => ({ ...prev, id_image: data.id }));
            });
          } else {
            console.error('Error uploading image');
          }
        });
      };
    } else if (imageAi) {
      await fetch(`${apiURL}/images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: EditBook.resume })
      }).then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setEditBook((prev) => ({ ...prev, id_image: data.id }));
          });
        } else {
          console.error('Error uploading image');
        }
      });
    }

    fetch(`${apiURL}/livres/${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(EditBook)
    }).then((response) => {
      if (response.ok) {
        navigate('/admin');
      } else {
        console.error('Error updating book');
      }
    });
  }

  const [image, setImage] = useState(null);
  const [imageAi, setImageAi] = useState(false);

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
        <input type="file" id="image" name="image" onChange={(e) => setImage(e.target.files[0])} />
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
