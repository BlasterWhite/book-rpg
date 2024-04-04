import './AdminEquipementListView.scss';
import EditIcon from '@/assets/icons/EditIcon.svg';
import DeleteIcon from '@/assets/icons/DeleteIcon.svg';
import { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import AddIcon from '@/assets/icons/AddIcon.svg';
import { AuthContext } from '@/composants/AuthContext/AuthContext.jsx';
import { BaseButton } from '@/composants/Base/BaseButton/BaseButton.jsx';

export function AdminEquipementListView() {
  const [, setSearch] = useState('');
  const [weapons, setWeapons] = useState([]);

  const { user } = useContext(AuthContext);

  const apiURL = import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000';

  async function getWeapons() {
    return await fetch(`${apiURL}/armes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: user.token
      }
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setWeapons(data);
        });
      } else {
        console.error('Error fetching weapons');
      }
    });
  }

  useEffect(() => {
    if (!user) return;
    fetch(`${apiURL}/armes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: user.token
      }
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          console.log(data);
          setWeapons(data);
        });
      } else {
        console.error('Error fetching weapons');
      }
    });
  }, [apiURL, user]);

  function handleSearch(e) {
    setSearch(e.target.value);

    // Filter sections by title or ID
    const filteredWeapons = weapons.filter(
      (section) =>
        // TODO: search on what ?
        section.texte.toLowerCase().includes(e.target.value.toLowerCase()) ||
        section.numero_section.toString().includes(e.target.value)
    );

    setWeapons(filteredWeapons);

    // If search is empty, show all sections
    if (!e.target.value) {
      getWeapons();
    }
  }

  async function handleDeleteWeapons(id) {
    if (!user) return;
    await fetch(`${apiURL}/armes`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: user.token
      }
    }).then((response) => {
      if (response.ok) {
        // Remove the weapon from the list
        setWeapons(weapons.filter((weapon) => weapon.id !== id));
      } else {
        console.error('Error deleting weapon');
      }
    });
  }

  async function handleCreateWeapon() {
    let weapon = {
      titre: 'new weapon',
      description: 'new weapon description',
      id_image: 2,
      degats: 10,
      durabilite: 5
    };

    // Post the new book to the server
    if (!user) return;
    const response = await fetch(`${apiURL}/armes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: user.token
      },
      body: JSON.stringify(weapon)
    });
    const resData = await response.json();

    // Add the new weapon to the list
    setWeapons([...weapons, resData]);
  }

  return (
    <div className={'admin-weapon-list-view'}>
      <h1 className={'title'}>Admin | Weapons list</h1>
      <div className={'weapon-header'}>
        <div className={'actions'}>
          <input
            type="text"
            placeholder="Search on title or ID"
            className={'search'}
            onChange={handleSearch}
          />
          <BaseButton text={'Create a weapon'} icon={AddIcon} onClick={handleCreateWeapon} />
        </div>
      </div>
      <div className={'weapon-list'}>
        {weapons
          ?.sort((a, b) => a.id > b.id)
          .map((weapon, index) => (
            <div key={index} className={'weapon'}>
              <div className={'weapon-info'}>
                <p className={'weapon-title'}>{weapon.titre}</p>
                <p className={'weapon-id'}>ID: {weapon.id}</p>
              </div>
              <div className={'weapon-actions'}>
                <NavLink to={`/admin/weapon/${weapon.id}`}>
                  <img className={'icon edit'} src={EditIcon} alt="Edit" />
                </NavLink>
                <a onClick={() => handleDeleteWeapons(weapon.id)}>
                  <img className={'icon delete'} src={DeleteIcon} alt="Delete" />
                </a>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
