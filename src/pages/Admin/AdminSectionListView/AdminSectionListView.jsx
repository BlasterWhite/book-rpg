import './AdminSectionListView.scss';
import EditIcon from '@/assets/icons/EditIcon.svg';
import DeleteIcon from '@/assets/icons/DeleteIcon.svg';
import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import AddIcon from '@/assets/icons/AddIcon.svg';

export function AdminSectionListView() {
  const { bookId } = useParams();
  const [, setSearch] = useState('');
  const [sections, setSections] = useState([]);

  const apiURL = import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000';

  async function getSections(bookId) {
    return await fetch(`${apiURL}/livres/${bookId}/sections`).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setSections(data);
        });
      } else {
        console.error('Error fetching sections');
      }
    });
  }

  useEffect(() => {
    fetch(`${apiURL}/livres/${bookId}/sections`).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setSections(data);
        });
      } else {
        console.error('Error fetching sections');
      }
    });
  }, [bookId, apiURL]);

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

  async function handleDeleteBook(id) {
    console.log('Delete book', id);
    await fetch(`${apiURL}/livres/${bookId}/sections/${id}`, {
      method: 'DELETE'
    }).then((response) => {
      if (response.ok) {
        // Remove the book from the list
        console.log('List of sections before delete', sections);
        setSections(sections.filter((section) => section.id !== id));
        console.log('List of sections after delete', sections);
      } else {
        console.error('Error deleting book');
      }
    });
  }

  function getHighestNumeroSection() {
    let highestNumeroSection = 1;
    if (sections.length > 0) {
      highestNumeroSection = Math.max(...sections.map((section) => section.numero_section)) + 1;
    }
    return highestNumeroSection;
  }

  async function handleCreateSection() {
    let section = {
      numero_section: getHighestNumeroSection(),
      texte: 'New section',
      id_image: '1',
      type: 'none',
      resultat: null,
      destinations: []
    };

    // TODO: Implement the API call to create a new book
    // Post the new book to the server
    const response = await fetch(`${apiURL}/livres/${bookId}/sections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(section)
    });
    const resData = await response.json();
    section.id = resData.message.id;

    console.log('section', section);

    // Add the new book to the list
    if (section.length === 0) {
      setSections([resData]);
    } else setSections([...sections, section]);
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
          <button className={'btn add-section'} onClick={handleCreateSection}>
            <img className={'icon'} src={AddIcon} alt="Add icon" />
            Add Section
          </button>
        </div>
      </div>
      <div className={'section-list'}>
        {sections
          ?.sort((a, b) => a.id > b.id)
          .map((section, index) => (
            <div key={index} className={'section'}>
              <div className={'section-info'}>
                <p className={'section-title'}>{section.texte}</p>
                <p className={'section-id'}>ID: {section.id}</p>
              </div>
              <div className={'section-actions'}>
                <NavLink to={`/admin/${bookId}/section/${section.id}`}>
                  <img className={'icon edit'} src={EditIcon} alt="Edit" />
                </NavLink>
                <a onClick={() => handleDeleteBook(section.id)}>
                  <img className={'icon delete'} src={DeleteIcon} alt="Delete" />
                </a>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
