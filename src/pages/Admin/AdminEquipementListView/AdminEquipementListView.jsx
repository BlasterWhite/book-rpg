import './AdminEquipementListView.scss';
import EditIcon from '@/assets/icons/EditIcon.svg';
import DeleteIcon from '@/assets/icons/DeleteIcon.svg';
import { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import AddIcon from '@/assets/icons/AddIcon.svg';
import { BaseButton } from '@/composants/Base/BaseButton/BaseButton.jsx';
import { AuthContext } from '@/composants/AuthContext/AuthContext.jsx';
import Cookies from 'js-cookie';

export function AdminEquipementListView() {
  const [, setSearch] = useState('');
  const [equipment, setEquipment] = useState([]);
  const { user } = useContext(AuthContext);

  let token = Cookies.get('token');

  const apiURL = import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000';

  async function getEquipment() {
    return await fetch(`${apiURL}/equipements`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      }
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setEquipment(data);
        });
      } else {
        console.error('Error fetching equipment');
      }
    });
  }

  useEffect(() => {
    if (!user) return;
    fetch(`${apiURL}/equipements`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      }
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setEquipment(data);
        });
      } else {
        console.error('Error fetching equipment');
      }
    });
  }, [apiURL, user, token]);

  function handleSearch(e) {
    setSearch(e.target.value);

    // Filter sections by title or ID
    const filteredEquipment = equipment.filter(
      (section) =>
        // TODO: search on what ?
        section.texte.toLowerCase().includes(e.target.value.toLowerCase()) ||
        section.numero_section.toString().includes(e.target.value)
    );

    setEquipment(filteredEquipment);

    // If search is empty, show all sections
    if (!e.target.value) {
      getEquipment();
    }
  }

  async function handleDeleteEquipment(id) {
    if (!user) return;
    await fetch(`${apiURL}/equipements/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      }
    }).then((response) => {
      if (response.ok) {
        // Remove the equipment from the list
        setEquipment(equipment.filter((eq) => eq.id !== id));
      } else {
        console.error('Error deleting equipment');
      }
    });
  }

  async function handleCreateEquipment() {
    let eq = {
      nom: 'new equipment',
      description: 'new equipment description',
      id_image: 2,
      resistance: 10
    };

    // Post the new book to the server
    if (!user) return;
    const response = await fetch(`${apiURL}/equipements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify(eq)
    });
    const resData = await response.json();

    // Add the new equipment to the list
    setEquipment([...equipment, resData]);
  }

  return (
    <div className={'admin-equipment-list-view'}>
      <h1 className={'title'}>Admin | Equipment list</h1>
      <div className={'equipment-header'}>
        <div className={'actions'}>
          <input
            type="text"
            placeholder="Search on title or ID"
            className={'search'}
            onChange={handleSearch}
          />
          <BaseButton text={'Create an equipment'} icon={AddIcon} onClick={handleCreateEquipment} />
        </div>
      </div>
      <div className={'equipment-list'}>
        {equipment
          ?.sort((a, b) => a.id > b.id)
          .map((equipment, index) => (
            <div key={index} className={'equipment'}>
              <div className={'equipment-info'}>
                <p className={'equipment-title'}>{equipment.nom}</p>
                <p className={'equipment-id'}>ID: {equipment.id}</p>
              </div>
              <div className={'equipment-actions'}>
                <NavLink to={`/admin/equipment/${equipment.id}`}>
                  <img className={'icon edit'} src={EditIcon} alt="Edit" />
                </NavLink>
                <a onClick={() => handleDeleteEquipment(equipment.id)}>
                  <img className={'icon delete'} src={DeleteIcon} alt="Delete" />
                </a>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
