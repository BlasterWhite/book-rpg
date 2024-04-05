import { useNavigate, useParams, NavLink } from 'react-router-dom';
import './AdventureSelection.scss';
import { useContext, useEffect, useState } from 'react';
import { AdventureCard } from '@/composants/AdventureCard/AdventureCard.jsx';
import { AuthContext } from '@/composants/AuthContext/AuthContext.jsx';

export function AdventureSelection() {
  const { bookId } = useParams();
  const [, setSearch] = useState('');
  const [book, setBook] = useState([]);
  const [adventures, setAdventures] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const apiURL = import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000';
  
  useEffect(() => {
    // Fetch adventures from the server
    if (!user) return;
    console.log('fetching adventures');
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: user.token }
    };
    fetch(
      `${apiURL}/users/${user.id}/aventures/livres/${bookId}`,
      requestOptions
    ).then((response) => response.json()
    .then((data) => {
      console.log(data);
      setAdventures(data);
    }))
    .catch((error) => {
    });
  }, [user]);
  
  useEffect(() => {
    // Fetch book from the server
    if (!user) return;
    console.log('fetching books');
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: user.token }
    };
    fetch(
      `${apiURL}/livres/${bookId}`,
      requestOptions
    ).then((response) => response.json()
    .then((data) => {
      setBook(data)}))
    .catch((error) => {
      navigate('/');
    });
  }, [user]);

  function handleSearch(e) {
    try {
      JSON.parse(localStorage.getItem('user')).id;
    } catch(error) {
      console.log("error");
    }

    setSearch(e.target.value);

    // Filter adventures by name

    const filteredAdventures = adventures.filter((adventure) =>
      adventure.id.toString().includes(e.target.value)
    );

    setAdventures(filteredAdventures);

    // If search is empty, show all adventures
    if (!e.target.value) {
      // Fetch adventuress from the server
      console.log('fetching adventures for the search');
      fetch(
        `${apiURL}/users/${user.id}/aventures/livres/${bookId}`
      ).then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setAdventures(data);
          });
        } else {
          console.error('Error fetching adventures');
        }
      });
    }
  }

  function createAdventure() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: user.token },
      body: JSON.stringify({
        id_utilisateur: user.id,
        id_livre: parseInt(bookId)
      })
    };
    const requestOptionsGet = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: user.token }
    };

    fetch(`${apiURL}/aventures`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          console.error('error creating adventure');
        }
      })
      .then(() => {
        fetch(
          `${apiURL}/users/${user.id}/aventures/livres/${bookId}`,
          requestOptionsGet
        ).then((response) => response.json()
        .then((data) => {
          setAdventures(data);
        }))
        .catch((error) => {
        });
      });
  }

  function redirect(adventureId) {
    let characterId;
    let currentSection;
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `${token}` }
    };
    fetch(`${apiURL}/aventures/${adventureId}`, requestOptions).then(
      (response) => {
        if (!response.ok) {
          console.error('error fetching adventure');
          return null;
        } else {
          response
            .json()
            .then((data) => {
              characterId = data.id_personnage;
              currentSection = data.id_section_actuelle;
            })
            .then(() => {
              if (!characterId || !currentSection) {
                return null;
              }
              window.location.href = `/book/${bookId}/${characterId}/${currentSection}`;
            });
        }
      }
    );
    return null;
  }

  function ShowAdventures() {
    if (adventures.length !== 0) {
      return (
        <div>
          <div className={'adventure-selection-adventures'}>
            {adventures.map((adventure, index) => (
              <div onClick={() => redirect(adventure.id)} key={index}>
                <AdventureCard adventure={adventure} book={book} key={index} handleFavourite={() => {}} />
              </div>
            ))}
          </div>
          <h3> Or create a new adventure! </h3>
          <button onClick={createAdventure}>Create a new adventure</button>
        </div>
      );
    } else {
      return (
        <div>
          <h1> There&apos;s no adventure yet. Start a new one! </h1>
          <button onClick={createAdventure}>Create a new adventure!</button>
        </div>
      );
    }
  }

  /*
  <h1>{book.titre}</h1>
        <p className='text-scenario'>{book.resume}</p>
        <img src={book.image.image} alt={'Livre image'} className='book-image'/>
  */

  return (
    <div>
      <NavLink to={`/book/`}>← Back to Books</NavLink>
      {
        book ? <div className='display-book'>
        <div className='book-information'>
          <h1>{book?.titre ? book.titre : 'Book not found'}</h1>
          <p>{book.resume}</p>
        </div>
        <div className='image-book'>
          <img src={book?.image?.image ? book.image.image : 'https://placehold.co/500x500.png'} alt={'Livre image'}/>
        </div>
      </div> : <h1>Book not found</h1>
      }
      
      <h3>Adventure Selection</h3>
      <div className={'adventure-selection'}>
        <header className={'adventure-selection-header'}>
          <h1>Adventures</h1>
          <form>
            <input type="text" placeholder="Search an adventure" onChange={handleSearch} />
          </form>
        </header>
        <div className={'adventure-selection-content'}>
          <ShowAdventures />
        </div>
      </div>
    </div>
  );
}