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
  const [userAdventureData, setUserAdventureData] = useState();
  const [favoris, setFavoris] = useState([{}]);
  const [books, setBooks] = useState([]);
  const [clickOnUpdate, setClickOnUpdate] = useState(false);
  const [clickOnDelete, setClickOnDelete] = useState(false);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const apiURL = import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000';

  useEffect(() => {
    if (!user) return;
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: user.token }
    };
    fetch(`${apiURL}/users/${user.id}`, requestOptions)
      .then((response) => response.json().then((data) => {
        setUserData(data);
        setFirstname(data.prenom);
        setLastname(data.nom);
        setEmail(data.mail);
      }))
      .catch((error) => console.error(error));
  }, [apiURL, user]);

  useEffect(() => {
    if (!user) return;
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: user.token }
    };
    fetch(`${apiURL}/users/aventures`, requestOptions)
      .then((response) => response.json().then((data) => setUserAdventureData(data)))
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

  const updateProfile = () => {
    setClickOnUpdate(true);
  }

  const saveProfile = () => {
    setClickOnUpdate(false);
  }

  const deleteProfile = () => {
    setClickOnDelete(true);
  }

  const cancelDeleteProfile = () => {
    setClickOnDelete(false);
  }

  const changeFirstname = (firstname) => {
    setFirstname(firstname);
  };

  const changeLastname = (firstname) => {
    setLastname(firstname);
  };

  const changeEmail = (email) => {
    setEmail(email);
  };

  const changePassword = (password) => {
    setPassword(password);
  };

  const changeConfirmPassword = (confirmPassword) => {
    setConfirmPassword(confirmPassword);
  };

  const totalAdventure = () => {
    if(!userAdventureData) return 0;
    return userAdventureData.length;
  }

  const adventurePercentageCompleted = () => {
    //console.log(userAdventureData);
    if(!userAdventureData) return 0;
    let percentage = 0;
    userAdventureData.map((adventure) => {
      if(adventure.statut === 'termine') percentage++;
    });
    return Math.floor((percentage/userAdventureData.length)*100);
  };
  
  const booksFinished = () => {
    if(!userAdventureData) return 0;
    let finishedBooks = [];
    userAdventureData.map((adventure) => {
      if(adventure.statut === 'termine' && !finishedBooks.includes(adventure.id_livre)) finishedBooks.push(adventure.id_livre);
    });
    return finishedBooks.length;
  }

  const mostFavoriteBooks = () => {
    if(!userAdventureData || !books) return;
    let mostFavoriteBooksId = [];
    let mostFavoriteBooksTitle = [];
    userAdventureData.map((adventure) => {
      if(mostFavoriteBooksId[adventure.id_livre] === undefined) mostFavoriteBooksId[adventure.id_livre] = 1
      else mostFavoriteBooksId[adventure.id_livre]++
    });

    const maxValue = Math.max(...Object.values(mostFavoriteBooksId));
    const maxKeys = Object.keys(mostFavoriteBooksId).filter(key => mostFavoriteBooksId[key] === maxValue);

    books.map((book) => {
      if(maxKeys.includes((book.id).toString())) mostFavoriteBooksTitle.push(book.titre);
    });

    return mostFavoriteBooksTitle[0];
  }

  return (
    <div className={'profile'}>
      {clickOnDelete && <div className={'profile-background-popup-delete'}>
        <div className={'profile-popup-delete'}>
          <h2 className={'profile-popup-delete-title'}>Are you sure ?</h2>
          <div className={'profile-popup-delete-text'}>Are you sure you want to delete your account, once deleted all your data will be lost forever.</div>
          <div className={'profile-popup-delete-buttons'}>
            <button onClick={() => cancelDeleteProfile()} className="profile-popup-delete-buttons-cancel">Cancel</button>
            <button onClick={() => cancelDeleteProfile()} className="profile-popup-delete-buttons-confirm">Confirm</button>
          </div>
        </div>
      </div>}
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
                  <img src="src\assets\icons\LittleAccountIcon.svg" alt="Icon account" />
                </label>
                <input
                  type="text"
                  id="firstname"
                  className="profile-general-container-content-form-input profile-general-container-content-form-input-firstname"
                  placeholder='First Name'
                  required
                  disabled={!clickOnUpdate}
                  value={firstname}
                  onChange={(e) => changeFirstname(e.target.value)}
                />
              </div>
              <div className="profile-general-container-content-form-group">
                <input
                  type="text"
                  id="lastname"
                  className="profile-general-container-content-form-input profile-general-container-content-form-input-lastname"
                  placeholder='Last Name'
                  required
                  disabled={!clickOnUpdate}
                  value={lastname}
                  onChange={(e) => changeLastname(e.target.value)}
                />
              </div>
            </div>
            <div className="profile-general-container-content-form-group">
              <label htmlFor="email" className="profile-general-container-content-form-label">
                <img src="src\assets\icons\LittleEmailIcon.svg" alt="Icon email" />
              </label>
              <input
                type="email"
                id="email"
                className="profile-general-container-content-form-input"
                placeholder='Email'
                required
                disabled={!clickOnUpdate}
                autoComplete="username"
                value={email}
                onChange={(e) => changeEmail(e.target.value)}
              />
            </div>
            {clickOnUpdate && <div className="profile-general-container-content-form-group">
              <label htmlFor="password" className="profile-general-container-content-form-label">
                <img src="src\assets\icons\LittlePasswordIcon.svg" alt="Icon password" />
              </label>
              <input
                type="password"
                id="password"
                className="profile-general-container-content-form-input"
                placeholder='Password'
                required
                disabled={!clickOnUpdate}
                autoComplete="new-password"
                onChange={(e) => changePassword(e.target.value)}
              />
            </div>}
            {clickOnUpdate && <div className="profile-general-container-content-form-group">
              <label htmlFor="confirm-password" className="profile-general-container-content-form-label">
                <img src="src\assets\icons\LittlePasswordIcon.svg" alt="Icon password" />
              </label>
              <input
                type="password"
                id="confirm-password"
                className="profile-general-container-content-form-input"
                placeholder='Confirm password'
                required
                disabled={!clickOnUpdate}
                autoComplete="new-password"
                onChange={(e) => changeConfirmPassword(e.target.value)}
              />
            </div>}
          </form>
          <div className='profile-general-container-content-form-buttons'>
            {!clickOnUpdate && <button type="submit" onClick={() => updateProfile()} className="profile-general-container-content-form-buttons-update">
              Update
            </button>
            }
            {clickOnUpdate && <button type="submit" onClick={() => saveProfile()} className="profile-general-container-content-form-buttons-update">
              Save
            </button>
            }
            <button type="submit" onClick={() => deleteProfile()} className="profile-general-container-content-form-buttons-delete">
              Delete
            </button>
          </div>
        </div>
      </div>
      <div className={'profile-statistics-container'}>
        <div className={'profile-statistics-container-title'}>
          <img src="src\assets\icons\MediumStatisticsIcon.svg" alt="Statistic icon" />
          <h2>Statistics</h2>
        </div>
        <div className={'profile-statistics-container-content'}>
          <div className={'profile-statistics-container-content-element'}>
            <div className={'profile-statistics-container-content-element-image'}>
              <img src="src\assets\icons\MediumMapIcon.svg" alt="Map icon"/>
            </div>
            <div className='profile-statistics-container-content-element-text'>
              Total adventure: <span className={'profile-statistics-container-content-element-text-data'}>{totalAdventure()}</span>
            </div>
          </div>
          <div className={'profile-statistics-container-content-element'}>
            <div className={'profile-statistics-container-content-element-image'}>
              <img src="src\assets\icons\MediumPercentIcon.svg" alt="Percent icon"/>
            </div>
            <div className='profile-statistics-container-content-element-text'>
              Adventure percentage completed: <span className={'profile-statistics-container-content-element-text-data'}>{adventurePercentageCompleted()}%</span>
            </div>
          </div>
          <div className={'profile-statistics-container-content-element'}>
            <div className={'profile-statistics-container-content-element-image'}>
              <img src="src\assets\icons\MediumBookIcon.svg" alt="Book icon"/>
            </div>
            <div className='profile-statistics-container-content-element-text'>
              Books finished: <span className={'profile-statistics-container-content-element-text-data'}>{booksFinished()}</span>
            </div>
          </div>
          <div className={'profile-statistics-container-content-element'}>
            <div className={'profile-statistics-container-content-element-image'}>
              <img src="src\assets\icons\MediumFavoriteIcon.svg" alt="Favorite icon"/>
            </div>
            <div className='profile-statistics-container-content-element-text'>
              Most favorite books: <span className={'profile-statistics-container-content-element-text-data'}>{mostFavoriteBooks()}</span>
            </div>
          </div>
        </div>
      </div>
      <div className={'profile-favorites-container'}>
        <div className={'profile-favorites-container-title'}>
          <img src="src\assets\icons\LittleFavoriteIcon.svg" alt="Favorite icon" />
          <h2>My favorites</h2>
        </div>
        <div className="profile-favorites-container-content">
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