import './Profil.scss';
import { useEffect, useState } from 'react';
import { BookCard } from '@/composants/BookCard/BookCard.jsx';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import dayjs from 'dayjs';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function ProfilView() {
  const { user, logout } = useAuth();
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
  const [errorMessageForm, setErrorMessageForm] = useState('');

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
    const day = dayjs(userData.creation_date);
    return day.format('MMMM DD, YYYY');
  };

  const updateProfile = () => {
    setClickOnUpdate(true);
  };

  const saveProfile = () => {
    handleUpdateUser().then((updateFormIsValid) => {
      if(!updateFormIsValid) return;
      toast.success('Profile updated', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce
      });
      setClickOnUpdate(false);
    })

  };

  const handleUpdateUser = async () => {
    const classError = 'profile-general-container-content-form-input-error';
    setErrorMessageForm('');
    
    const firstnameInput = document.getElementById('firstname');
    const lastnameInput = document.getElementById('lastname');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    
    firstnameInput.classList.remove(classError);
    lastnameInput.classList.remove(classError);
    emailInput.classList.remove(classError);
    passwordInput.classList.remove(classError);
    confirmPasswordInput.classList.remove(classError);

    handleInputEmptyError('Firstname', firstnameInput, classError);
    handleInputEmptyError('Lastname', lastnameInput, classError);
    handleInputEmptyError('Email', emailInput, classError);

    if(password !== '' || confirmPassword !== '') {
      if (password !== confirmPassword) {
        passwordInput.classList.add(classError);
        confirmPasswordInput.classList.add(classError);
        setErrorMessageForm('Passwords are not the same');
        return false;
      }
      
      const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>+-_/~])(?=.*[a-zA-Z]).{8,}$/;
      if (!regex.test(password)) {
        passwordInput.classList.add(classError);
        confirmPasswordInput.classList.add(classError);
        setErrorMessageForm('Password must contain at least 8 characters including a letter, a number and a special character');
        return false;
      }
    }

    const formData = {
      mail: email,
      nom: lastname,
      prenom: firstname,
      password: password
    };
    
    return await fetch(`${apiURL}/users/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: user.token
      },
      body: JSON.stringify(formData)
    }).then(() => {
      return true;
    }).catch(() => {
      return false;
    });

  };

  const handleInputEmptyError = (type, input, classError) => {
    input.classList.add(classError);
    setErrorMessageForm(`${type} must not be empty`);
  };    

  const openDeletePopup = () => {
    setClickOnDelete(true);
  }

  const deleteProfile = () => {
    handleDeleteUser().then((deleteIsValid) => {
      if(!deleteIsValid) return;
      
      window.location.href = '/';
      logout();
    });
  };

  const handleDeleteUser = async () => {
    return await fetch(`${apiURL}/users/${user.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: user.token
      }
    }).then((response) => {
      if (response.ok) {
        return true;
      } else {
        console.error('Error deleting profile');
        return false;
      }
    });
  }

  const cancelDeleteProfile = () => {
    setClickOnDelete(false);
  };

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
    if(!userAdventureData) return 0;
    let percentage = 0;
    userAdventureData.forEach((adventure) => {
      if(adventure.statut === 'termine') percentage++;
    });

    if(userAdventureData.length == 0) {
      return 0;
    }

    return Math.floor((percentage/userAdventureData.length)*100);
  };
  
  const booksFinished = () => {
    if(!userAdventureData) return 0;
    let finishedBooks = [];
    userAdventureData.forEach((adventure) => {
      if(adventure.statut === 'termine' && !finishedBooks.includes(adventure.id_livre)) finishedBooks.push(adventure.id_livre);
    })
    return finishedBooks.length;
  }

  const mostFavoriteBook = () => {
    if (!userAdventureData || !books) return;

    let bookCounts = {};

    userAdventureData.forEach((adventure) => {
      if (!bookCounts[adventure.id_livre]) {
        bookCounts[adventure.id_livre] = 1;
      } else {
        bookCounts[adventure.id_livre]++;
      }
    });

    let maxCount = 0;
    let mostFavoriteBookId = null;
    for (const [id, count] of Object.entries(bookCounts)) {
      if (count > maxCount) {
        maxCount = count;
        mostFavoriteBookId = id;
      }
    }

    let mostFavoriteBookTitle = '';
    books.some((book) => {
      if (book.id.toString() === mostFavoriteBookId) {
        mostFavoriteBookTitle = book.titre;
        return true;
      }
    });

    return mostFavoriteBookTitle;
  }

  return (
    <div className={'profile'}>
      {clickOnDelete && <div className={'profile-background-popup-delete'}>
        <div className={'profile-popup-delete'}>
          <h2 className={'profile-popup-delete-title'}>Are you sure ?</h2>
          <div className={'profile-popup-delete-text'}>Are you sure you want to delete your account, once deleted all your data will be lost forever.</div>
          <div className={'profile-popup-delete-buttons'}>
            <button onClick={() => cancelDeleteProfile()} className="profile-popup-delete-buttons-cancel">Cancel</button>
            <button onClick={() => deleteProfile()} className="profile-popup-delete-buttons-confirm">Confirm</button>
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
            <div className='profile-general-container-content-form-error'>
              {errorMessageForm}
            </div>
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
            <button type="submit" onClick={() => openDeletePopup()} className="profile-general-container-content-form-buttons-delete">
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
            {mostFavoriteBook() == '' && <div className='profile-statistics-container-content-element-text'>
              You have not a favorite book
            </div>}
            {mostFavoriteBook() != '' && <div className='profile-statistics-container-content-element-text'>
              Most favorite book: <span className={'profile-statistics-container-content-element-text-data'}>{mostFavoriteBook()}</span>
            </div>}
          </div>
        </div>
      </div>
      <div className={'profile-favorites-container'}>
        <div className={'profile-favorites-container-title'}>
          <img src="src\assets\icons\LittleFavoriteIcon.svg" alt="Favorite icon" />
          <h2>My favorites</h2>
        </div>
        <div className="profile-favorites-container-content">
          {(favoris.length === 0) && <p>You have no favorites</p>}
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