import './AdminSectionListView.scss';
import EditIcon from '@/assets/icons/EditIcon.svg';
import DeleteIcon from '@/assets/icons/DeleteIcon.svg';
import { useContext, useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import AddIcon from '@/assets/icons/AddIcon.svg';
import { AuthContext } from '@/composants/AuthContext/AuthContext.jsx';

export function AdminSectionListView() {
  const { bookId } = useParams();
  const [, setSearch] = useState('');
  const [sections, setSections] = useState([]);

  const { user } = useContext(AuthContext);

  const apiURL = import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000';

  async function getSections(bookId) {
    return await fetch(`${apiURL}/livres/${bookId}/sections`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: user.token
      }
    }).then((response) => {
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
    if (!user) return;
    fetch(`${apiURL}/livres/${bookId}/sections`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: user.token
      }
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setSections(data);
        });
      } else {
        console.error('Error fetching sections');
      }
    });
  }, [bookId, apiURL, user]);

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
    if (!user) return;
    await fetch(`${apiURL}/livres/${bookId}/sections/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: user.token
      }
    }).then((response) => {
      if (response.ok) {
        // Remove the book from the list
        setSections(sections.filter((section) => section.id !== id));
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
    if (!user) return;
    const response = await fetch(`${apiURL}/livres/${bookId}/sections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: user.token
      },
      body: JSON.stringify(section)
    });
    const resData = await response.json();
    section.id = resData.message.id;

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
