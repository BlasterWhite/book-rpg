import './AdminEquipementEditView.scss';
import { NavLink, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BaseButton } from '@/composants/Base/BaseButton/BaseButton.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';

export function AdminEquipementEditView() {
  const { equipmentId } = useParams();

  const [equipment, setEquipment] = useState({
    nom: '',
    description: '',
    id_image: 0,
    resistance: 0
  });

  const { user } = useAuth();

  const apiURL = import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000';

  useEffect(() => {
    if (!user) return;
    fetch(`${apiURL}/equipements/${equipmentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: user.token
      }
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setEquipment(data);

          // if (data?.image?.image?.startsWith('http')) {
          //   setImage(data.image.image);
          // }
        });
      } else {
        console.error('Error fetching equipment');
      }
    });
  }, [equipmentId, apiURL, user]);

  function editEquipment(e) {
    setEquipment({ ...equipment, [e.target.name]: e.target.value });
  }

  async function uploadImage(imageUrl) {
    if (!user) return;
    // upload the link to the image to the server and send back the id
    let id_image = 1;
    id_image = await fetch(`${apiURL}/images/url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: user.token
      },
      body: JSON.stringify({ url: imageUrl })
    }).then(async (response) => {
      if (response.ok) {
        await response.json().then((data) => {
          id_image = data.id;
        });
        return id_image;
      } else {
        console.error('Error uploading image');
      }
    });
    return id_image;
  }

  const [image, setImage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    if (!user) return;

    if (image !== '' && image.startsWith('http')) {
      try {
        const id_image = parseInt(await uploadImage(image));
        equipment.id_image = id_image;
        setEquipment({ ...equipment, id_image });
      } catch (error) {
        console.error('Error uploading image');
      }
    }

    await fetch(`${apiURL}/equipements/${equipmentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: user.token
      },
      body: JSON.stringify(equipment)
    }).then((response) => {
      if (response.ok) {
        console.log('Equipments updated');
      } else {
        console.error('Error updating equipments');
      }
    });
  }

  return (
    <div className={'admin-equipment-edit-view'}>
      <h1 className={'title'}>Admin</h1>
      <NavLink to={`/admin/equipment`}>← Back</NavLink>
      <form onSubmit={handleSubmit}>
        <label htmlFor={'nom'}>Name: </label>
        <input type="text" name="nom" id="nom" value={equipment.nom} onChange={editEquipment} />
        <label htmlFor={'description'}>Description: </label>
        <input
          type="text"
          name="description"
          id="description"
          value={equipment.description}
          onChange={editEquipment}
        />
        <label htmlFor={'resistance'}>Resistance: </label>
        <input
          type="number"
          name="resistance"
          id="resistance"
          value={equipment.resistance}
          onChange={editEquipment}
        />
        <label htmlFor={'image'}>Image: </label>
        <details>
          <summary>Actual image</summary>
          <img className={'image-preview'} src={equipment?.image?.image} alt="image preview" />
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
