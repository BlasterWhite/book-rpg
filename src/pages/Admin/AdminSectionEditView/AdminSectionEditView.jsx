import './AdminSectionEditView.scss';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export function AdminSectionEditView() {
  const { sectionId } = useParams();

  // const [EditBook, setEditBook] = useState({});
  // const navigate = useNavigate();
  //
  // const apiURL = import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000';
  //
  // useEffect(() => {
  //   fetch(`${apiURL}/livres/${bookId}`).then((response) => {
  //     if (response.ok) {
  //       response.json().then((data) => {
  //         setEditBook(data);
  //       });
  //     } else {
  //       console.error('Error fetching books');
  //     }
  //   });
  // }, [bookId, apiURL]);
  //
  // function editBook(e) {
  //   console.log(e.target.name, e.target.value);
  //   setEditBook((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  // }
  //
  // const [newTag, setNewTag] = useState('');
  //
  // function handleAddTag(e) {
  //   e.preventDefault();
  //   const tags = EditBook.tag.split(';');
  //   tags.push(newTag);
  //   setEditBook((prev) => ({ ...prev, tag: tags.join(';') }));
  //   setNewTag('');
  // }
  //
  // function handleRemoveTag(tag) {
  //   const tags = EditBook.tag.split(';');
  //   const newTags = tags.filter((t) => t !== tag);
  //   setEditBook((prev) => ({ ...prev, tag: newTags.join(';') }));
  // }
  //
  // function handleSubmit(e) {
  //   e.preventDefault();
  //
  //   fetch(`${apiURL}/livres/${bookId}`, {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(EditBook)
  //   }).then((response) => {
  //     if (response.ok) {
  //       console.log('Book updated');
  //       navigate('/admin');
  //     } else {
  //       console.error('Error updating book');
  //     }
  //   });
  // }

  return (
    <div className={'admin-book-edit-view'}>
      <h1 className={'title'}>Admin</h1>
      <NavLink to={'/admin'}>← Back</NavLink>
      <form>
        <label htmlFor={'texte'}>Text: </label>
        <textarea name="texte" />
        <div className={'interactivity-section'}>
          <div className={'interactivity-choice'}>
            <label htmlFor={'type'}>Type: </label>
            <div>
              <input type="radio" name="none" id="type" value={'none'} />
              <label htmlFor={'none'}>None</label>
            </div>
            <div>
              <input type="radio" name="choice" id="type" value={'choice'} />
              <label htmlFor={'choice'}>Choices</label>
            </div>
            <div>
              <input type="radio" name="enigma" id="type" value={'enigma'} />
              <label htmlFor={'enigma'}>Enigma</label>
            </div>
            <div>
              <input type="radio" name="Fight" id="type" value={'Fight'} />
              <label htmlFor={'Fight'}>Fight</label>
            </div>
            <div>
              <input type="radio" name="end" id="type" value={'end'} />
              <label htmlFor={'end'}>End</label>
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
