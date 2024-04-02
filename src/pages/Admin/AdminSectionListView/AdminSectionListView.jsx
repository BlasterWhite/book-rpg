import './AdminSectionListView.scss';
import EditIcon from '@/assets/icons/EditIcon.svg';
import DeleteIcon from '@/assets/icons/DeleteIcon.svg';
import Mock from '@/assets/mock.json';
import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import AddIcon from '@/assets/icons/AddIcon.svg';

export function AdminSectionListView() {
  const { bookId } = useParams();
  const [, setSearch] = useState('');
  const [sections, setSections] = useState([]);

  async function getSections(bookId) {
    return await fetch(`${import.meta.env.VITE_API_URL}/livres/${bookId}/sections`).then(
      (response) => {
        if (response.ok) {
          response.json().then((data) => {
            setSections(data);
          });
        } else {
          console.error('Error fetching sections');
        }
      }
    );
  }

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/livres/${bookId}/sections`).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setSections(data);
        });
      } else {
        console.error('Error fetching sections');
      }
    });
  }, []);

  function handleSearch(e) {
    setSearch(e.target.value);

    // Filter sections by title or ID
    const filteredBooks = sections.filter(
      (section) =>
        section.texte.toLowerCase().includes(e.target.value.toLowerCase()) ||
        section.numero_section.toString().includes(e.target.value)
    );

    setSections(filteredBooks);

    // If search is empty, show all sections
    if (!e.target.value) {
      getSections(bookId);
    }
  }

  return (
    <div className={'admin-section-list-view'}>
      <h1 className={'title'}>
        Admin | Section list <span className={'id'}>ID : {bookId}</span>{' '}
      </h1>
      <div className={'section-header'}>
        <NavLink to={`/admin/`}>← Back to Books</NavLink>
        <div className={'actions'}>
          <input
            type="text"
            placeholder="Search on title or ID"
            className={'search'}
            onChange={handleSearch}
          />
          <button className={'btn add-section'}>
            <img className={'icon'} src={AddIcon} alt="Add icon" />
            Add Section
          </button>
        </div>
      </div>
      <div className={'section-list'}>
        {sections.map((section, index) => (
          <div key={index} className={'section'}>
            <div className={'section-info'}>
              <p className={'section-title'}>{section.texte}</p>
              <p className={'section-id'}>ID: {section.numero_section}</p>
            </div>
            <div className={'section-actions'}>
              <NavLink to={`/admin/${bookId}/section/${section.numero_section}`}>
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
