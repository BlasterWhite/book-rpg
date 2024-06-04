import './Profil.scss';
import { useEffect, useState } from 'react';
import { BookCard } from '@/composants/BookCard/BookCard.jsx';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { DateTime } from 'luxon';

export function ProfilView() {
  const { user } = useAuth();
  const [userData, setUserData] = useState({
    prenom: undefined,
    nom: undefined,
    mail: undefined,
    creation_date: '',
    livre: {},
  });
  const [favoris, setFavoris] = useState([{}]);
  const [books, setBooks] = useState([]);

  const apiURL = import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000';

  useEffect(() => {
    if (!user) return;
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: user.token }
    };
    fetch(`${apiURL}/users/${user.id}`, requestOptions)
      .then((response) => response.json().then((data) => setUserData(data)))
      .catch((error) => console.error(error));
  }, [apiURL, user]);

  useEffect(() => {
    if (!user) return;
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: user.token }
    };
    fetch(`${apiURL}/users/favoris`, requestOptions)
      .then((response) =>
        response.json().then((data) => {
          setFavoris(data);
        })
      )
      .catch((error) => console.error(error));
  }, [apiURL, user]);

  useEffect(() => {
    if (!apiURL) return console.error('No API URL provided', apiURL);
    fetch(`${apiURL}/livres`).then((response) =>
      response
        .json()
        .then((data) => {
          const booksWithFav = data.map((book) => {
            book.fav = false;
            return book;
          });
          setBooks(booksWithFav);
        })
        .catch((error) => console.error('Error fetching books', error))
    );
  }, [apiURL, user]);

  const handleFavourite = (id) => {
    const newBooks = books.map((book) => {
      if (book.id === id) {
        if (book.fav) {
          book.fav = !book.fav;
        } else {
          book.fav = false;
        }
      }
      return book;
    });
    setBooks(newBooks);
  };

  const formattedDate = () => {
    const dt = new DateTime(userData.creation_date)
    return dt.toLocaleString(DateTime.DATE_MED);
  };

  return (
    <div className={'profile'}>
      <div className={'profile-general-container'}>
        <div className={'profile-general-container-title'}>
          <img src="src\assets\icons\MediumAccountIcon.svg" alt="Account icon" />
          <h2>My Profile</h2>
        </div>
        <div className={'profile-general-container-content'}>
          <div className={'profile-general-container-content-account-icon'}>
            <img src="src\assets\icons\BigAccountIcon.svg" alt="Account icon"/>
          </div>
          <div className={'profile-general-container-content-role'}>{user?.permission}</div>
          <div className={'profile-general-container-content-date'}>Member since: {formattedDate()}</div>
          <form className={'profile-general-container-content-form'}>
            <div className={'profile-general-container-content-form-name'}>
              <div className="profile-general-container-content-form-group">
                <label htmlFor="firstname" className="profile-general-container-content-form-label">
                  <img src="src\assets\icons\LittleAccountIcon.svg" alt="" />
                </label>
                <input
                  type="text"
                  id="firstname"
                  className="profile-general-container-content-form-input profile-general-container-content-form-input-firstname"
                  placeholder='First Name'
                  required
                />
              </div>
              <div className="profile-general-container-content-form-group">
                <input
                  type="text"
                  id="lastname"
                  className="profile-general-container-content-form-input profile-general-container-content-form-input-lastname"
                  placeholder='Last Name'
                  required
                />
              </div>
            </div>
            <div className="profile-general-container-content-form-group">
              <label htmlFor="email" className="profile-general-container-content-form-label">
                <img src="src\assets\icons\LittleEmailIcon.svg" alt="" />
              </label>
              <input
                type="email"
                id="email"
                className="profile-general-container-content-form-input"
                placeholder='Email'
                required
              />
            </div>
            <div className="profile-general-container-content-form-group">
              <label htmlFor="password" className="profile-general-container-content-form-label">
                <img src="src\assets\icons\LittlePasswordIcon.svg" alt="" />
              </label>
              <input
                type="password"
                id="password"
                className="profile-general-container-content-form-input"
                placeholder='Password'
                required
              />
            </div>
            <div className="profile-general-container-content-form-group">
              <label htmlFor="confirm-password" className="profile-general-container-content-form-label">
                <img src="src\assets\icons\LittlePasswordIcon.svg" alt="" />
              </label>
              <input
                type="password"
                id="confirm-password"
                className="profile-general-container-content-form-input"
                placeholder='Confirm password'
                required
              />
            </div>
            <div className='profile-general-container-content-form-buttons'>
              <button type="submit" className="profile-general-container-content-form-buttons-update">
                Update
              </button>
              <button type="submit" className="profile-general-container-content-form-buttons-delete">
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className={'profile-statistics-container'}>
        <div className={'profile-statistics-container-title'}>
          <img src="src\assets\icons\MediumStatisticsIcon.svg" alt="Account icon" />
          <h2>Statistics</h2>
        </div>
      </div>
    </div>
  );
}
{
/*
<div className="profile-page">
  <div className="profile-general-container">
    <div className="profile-info">
      <img
        src={'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
        alt="User Avatar" className="profile-avatar" />
      <div className="profile-details">
        <h2 className="profile-name">{userData.nom} {userData.prenom}</h2>
        <span className="profile-email">{userData.mail}</span>
        <span className="profile-join-date">Member since {userData.creation_date || '29/07/2003'}</span>
      </div>
    </div>
  </div>
  <div className="profile-favorites">
    <h2 className="profile-favorites-title">Mes Favoris</h2>
    <div className="profile-favorites-list">
      {(favoris.length === 0) && <p>There's nothing here to see for you...</p>}
      {(favoris.length >= 1) && favoris.map((fav) => fav.livre && (
        <NavLink to={`/book/${fav.id_livre}`} key={fav.id_livre}>
          <BookCard
            book={fav.livre}
            handleFavourite={() => handleFavourite(fav.id_livre)}
            books={books}
            favourites={favoris}
          />
        </NavLink>

      ))}
    </div>
  </div>
</div>


<div className={'profile-general-container-content-name'}>
            <span className={'profile-general-container-content-name-firstname'}>{userData.prenom}</span>
            <span className={'profile-general-container-content-name-lastname'}>{userData.nom}</span>
          </div>
          <ul>
            <li>Email: {userData.mail}</li>
            <li>Member since: {formattedDate()}</li>
          </ul>
          <button
            type={'button'}>
            Delete my account
          </button>
*/
}
