import './Profil.scss';
import { useEffect, useState } from 'react';
import { BookCard } from '@/composants/BookCard/BookCard.jsx';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';

export function ProfilView() {
  const { user } = useAuth();
  const [userData, setUserData] = useState({
    prenom: undefined,
    nom: undefined,
    mail: undefined,
    joinDate: '',
    livre: {}
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
    fetch(
      `${apiURL}/users/${user.id}`,
      requestOptions
    ).then((response) => response.json()
      .then((data) => setUserData(data)))
      .catch((error) => console.error(error));
  }, [apiURL, user]);

  useEffect(() => {
    if (!user) return;
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: user.token }
    };
    fetch(
      `${apiURL}/users/favoris`,
      requestOptions
    ).then((response) => response.json()
      .then((data) => {
        setFavoris(data);
      }))
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

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-info">
          <img
            src={'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
            alt="User Avatar" className="profile-avatar" />
          <div className="profile-details">
            <h2 className="profile-name">{userData.nom} {userData.prenom}</h2>
            <span className="profile-email">{userData.mail}</span>
            <span className="profile-join-date">Member since {userData?.joinDate || '29/07/2003'}</span>
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
  );
}
