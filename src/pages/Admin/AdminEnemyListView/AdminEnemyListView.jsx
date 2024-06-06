import './AdminEnemyListView.scss';
import EditIcon from '@/assets/icons/EditIcon.svg';
import DeleteIcon from '@/assets/icons/DeleteIcon.svg';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import AddIcon from '@/assets/icons/AddIcon.svg';
import { BaseButton } from '@/composants/Base/BaseButton/BaseButton.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Bounce, toast, ToastContainer } from 'react-toastify';

export function AdminEnemyListView() {
  const [, setSearch] = useState('');
  const [enemies, setEnemies] = useState([]);

  const { user } = useAuth();

  const apiURL = import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000';

  function displayMsg(msg, type = 'info') {
    const options = {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      transition: Bounce
    };

    switch (type) {
      case 'info':
        toast.info(msg, options);
        break;
      case 'success':
        toast.success(msg, options);
        break;
      case 'warning':
        toast.warning(msg, options);
        break;
      case 'error':
        toast.error(msg, options);
        break;
      default:
        toast.info(msg, options);
    }
  }
  async function getEnemies() {
    return await fetch(`${apiURL}/enemies`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: user.token
      }
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setEnemies(data);
        });
      } else {
        console.error('Error fetching enemies');
      }
    });
  }

  useEffect(() => {
    if (!user) return;
    fetch(`${apiURL}/enemies`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: user.token
      }
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setEnemies(data);
        });
      } else {
        displayMsg('Error fetching enemies', 'error');
      }
    });
  }, [apiURL, user]);

  function handleSearch(e) {
    setSearch(e.target.value);

    // Filter sections by title or ID
    const filteredWeapons = enemies.filter(
      (enemy) =>
        // TODO: search on what ?
        enemy.personnage.nom.toLowerCase().includes(e.target.value.toLowerCase()) ||
        enemy.id.toString().includes(e.target.value)
    );

    setEnemies(filteredWeapons);

    // If search is empty, show all sections
    if (!e.target.value) {
      getEnemies();
    }
  }

  async function handleDeleteWeapons(id) {
    if (!user) return;
    await fetch(`${apiURL}/enemies/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: user.token
      }
    }).then((response) => {
      if (response.ok) {
        // Remove the enemy from the list
        setEnemies(enemies.filter((enemy) => enemy.id !== id));
      } else {
        displayMsg('Error deleting enemy', 'error');
      }
    });
  }

  async function handleCreateEnemy() {
    let enemy = {
      id_section: 327,
      personnage: {
        nom: 'Enemy',
        description: '',
        occupation: '',
        apparence: '',
        dexterite: 1,
        endurance: 1,
        psychisme: 1,
        force: 1,
        resistance: 1,
        id_image: 100
      }
    };

    // Post the new book to the server
    if (!user) return;
    const response = await fetch(`${apiURL}/enemies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: user.token
      },
      body: JSON.stringify(enemy)
    });
    const resData = await response.json();

    // Add the new enemy to the list
    setEnemies([...enemies, resData]);
  }

  return (
    <div className={'admin-enemy-list-view'}>
      <h1 className={'title'}>Admin | Enemy list</h1>
      <NavLink to={`/admin`}>← Back to admin</NavLink>
      <div className={'enemy-header'}>
        <div className={'actions'}>
          <input
            type="text"
            placeholder="Search on name or ID"
            className={'search'}
            onChange={handleSearch}
          />
          <BaseButton text={'Create a enemy'} icon={AddIcon} onClick={handleCreateEnemy} />
        </div>
      </div>
      <div className={'enemy-list'}>
        {enemies
          ?.sort((a, b) => a.id > b.id)
          .map((enemy, index) => (
            <div key={index} className={'enemy'}>
              <div className={'enemy-info'}>
                <p className={'enemy-title'}>{enemy.personnage.nom}</p>
                <p className={'enemy-id'}>
                  ID: {enemy.id} | Section ID: {enemy.id_section}
                </p>
              </div>
              <div className={'enemy-actions'}>
                <NavLink to={`/admin/enemy/${enemy.id}`}>
                  <img className={'icon edit'} src={EditIcon} alt="Edit" />
                </NavLink>
                <a onClick={() => handleDeleteWeapons(enemy.id)}>
                  <img className={'icon delete'} src={DeleteIcon} alt="Delete" />
                </a>
              </div>
            </div>
          ))}
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition:Bounce
      />
    </div>
  );
}
