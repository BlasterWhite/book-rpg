import './AdminEnenyEditView.scss';
import { NavLink, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BaseButton } from '@/composants/Base/BaseButton/BaseButton.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Bounce, toast, ToastContainer } from 'react-toastify';

export function AdminEnenyEditView() {
  const { enemyId } = useParams();

  const [enemy, setEnemy] = useState({
    id_section: null,
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
  });
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

  useEffect(() => {
    if (!user) return;
    fetch(`${apiURL}/enemies/${enemyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: user.token
      }
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setEnemy(data);
        });
      } else {
        displayMsg('Error fetching enemy', 'error');
      }
    });
  }, [enemyId, apiURL, user]);

  function editEnemy(e) {
    if (e.target.name === 'section') {
      setEnemy({ ...enemy, id_section: e.target.value });
    } else {
      setEnemy({
        ...enemy,
        personnage: {
          ...enemy.personnage,
          [e.target.name]: e.target.value
        }
      });
    }
  }

  const [image, setImage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    const enemyCopy = { ...enemy };

    if (!user) return;
    if (image && image.startsWith('http')) {
      fetch(`${apiURL}/images/url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: user.token
        },
        body: JSON.stringify({ url: image })
      }).then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            enemyCopy.personnage.id_image = data.id;

            fetch(`${apiURL}/enemies/${enemyId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: user.token
              },
              body: JSON.stringify(enemyCopy)
            }).then((response) => {
              if (response.ok) {
                displayMsg('Enemy updated', 'success');
              } else {
                displayMsg('Error updating enemy', 'error');
              }
            });
          });
        } else {
          displayMsg('Error while uploading image', 'error');
        }
      });
    } else {
      fetch(`${apiURL}/enemies/${enemyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: user.token
        },
        body: JSON.stringify(enemy)
      }).then((response) => {
        if (response.ok) {
          displayMsg('Enemy updated', 'success');
        } else {
          displayMsg('Error updating enemy', 'error');
        }
      });
    }
  }

  return (
    <div className={'admin-enemy-edit-view'}>
      <h1 className={'title'}>Admin</h1>
      <NavLink to={`/admin/enemy`}>← Back</NavLink>
      <form onSubmit={handleSubmit}>
        <label htmlFor={'titre'}>Section: </label>
        <input
          type="number"
          name="section"
          id="section"
          value={enemy.id_section}
          onChange={editEnemy}
        />
        <label htmlFor={'titre'}>Name: </label>
        <input type="text" name="nom" id="nom" value={enemy.personnage.nom} onChange={editEnemy} />
        <label htmlFor={'description'}>Description: </label>
        <input
          type="text"
          name="description"
          id="description"
          value={enemy.personnage.description}
          onChange={editEnemy}
        />
        <label htmlFor={'degats'}>Strength: </label>
        <input
          type="number"
          name="force"
          id="force"
          value={enemy.personnage.force}
          onChange={editEnemy}
        />
        <label htmlFor={'degats'}>Hardiness: </label>
        <input
          type="number"
          name="resistance"
          id="resistance"
          value={enemy.personnage.resistance}
          onChange={editEnemy}
        />
        <label htmlFor={'degats'}>Dexterity: </label>
        <input
          type="number"
          name="dexterite"
          id="dexterite"
          value={enemy.personnage.dexterite}
          onChange={editEnemy}
        />
        <label htmlFor={'degats'}>Psyche: </label>
        <input
          type="number"
          name="psychisme"
          id="psychisme"
          value={enemy.personnage.psychisme}
          onChange={editEnemy}
        />
        <label htmlFor={'durabilite'}>Endurance: </label>
        <input
          type="number"
          name="endurance"
          id="endurance"
          value={enemy.personnage.endurance}
          onChange={editEnemy}
        />
        <label htmlFor={'image'}>Image: </label>
        <details>
          <summary>Actual image</summary>
          <img
            className={'image-preview'}
            src={enemy?.personnage.image?.image}
            alt="image preview"
          />
        </details>
        <input
          type="text"
          name="image"
          id="image"
          value={image}
          onChange={(e) => {
            setImage(e.target.value);
          }}
        />
        <BaseButton text={'Save'} type={'submit'} />
      </form>
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
