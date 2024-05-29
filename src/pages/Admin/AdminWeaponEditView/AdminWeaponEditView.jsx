import './AdminWeaponEditView.scss';
import { NavLink, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BaseButton } from '@/composants/Base/BaseButton/BaseButton.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';

export function AdminWeaponEditView() {
  const { weaponId } = useParams();

  const [weapon, setWeapon] = useState({
    titre: '',
    description: '',
    degats: 0,
    durabilite: 0,
    id_image: 0
  });
  const { user } = useAuth();

  const apiURL = import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000';

  useEffect(() => {
    if (!user) return;
    fetch(`${apiURL}/armes/${weaponId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: user.token
      }
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setWeapon(data);

          // if (data?.image?.image?.startsWith('http')) {
          //   setImage(data.image.image);
          // }
        });
      } else {
        console.error('Error fetching weapon');
      }
    });
  }, [weaponId, apiURL, user]);

  function editWeapon(e) {
    setWeapon({ ...weapon, [e.target.name]: e.target.value });
  }

  const [image, setImage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    const weaponCopy = { ...weapon };

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
            weaponCopy.id_image = data.id;
            console.log('weaponCopy', weaponCopy);

            fetch(`${apiURL}/armes/${weaponId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: user.token
              },
              body: JSON.stringify(weaponCopy)
            }).then((response) => {
              if (response.ok) {
                console.log('Weapon updated');
              } else {
                console.error('Error updating weapon');
              }
            });
          });
        } else {
          console.error('Error uploading image');
        }
      });
    } else {
      fetch(`${apiURL}/armes/${weaponId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: user.token
        },
        body: JSON.stringify(weapon)
      }).then((response) => {
        if (response.ok) {
          console.log('Weapon updated');
        } else {
          console.error('Error updating weapon');
        }
      });
    }
  }

  return (
    <div className={'admin-section-edit-view'}>
      <h1 className={'title'}>Admin</h1>
      <NavLink to={`/admin/weapon`}>← Back</NavLink>
      <form onSubmit={handleSubmit}>
        <label htmlFor={'titre'}>Name: </label>
        <input type="text" name="titre" id="titre" value={weapon.titre} onChange={editWeapon} />
        <label htmlFor={'description'}>Description: </label>
        <input
          type="text"
          name="description"
          id="description"
          value={weapon.description}
          onChange={editWeapon}
        />
        <label htmlFor={'degats'}>Damage: </label>
        <input
          type="number"
          name="degats"
          id="degats"
          value={weapon.degats}
          onChange={editWeapon}
        />
        <label htmlFor={'durabilite'}>Durability: </label>
        <input
          type="number"
          name="durabilite"
          id="durabilite"
          value={weapon.durabilite}
          onChange={editWeapon}
        />
        <label htmlFor={'image'}>Image: </label>
        <details>
          <summary>Actual image</summary>
          <img className={'image-preview'} src={weapon?.image?.image} alt="image preview" />
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
    </div>
  );
}
