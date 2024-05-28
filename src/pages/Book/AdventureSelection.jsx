import { useNavigate, useParams, NavLink } from 'react-router-dom';
import './AdventureSelection.scss';
import { useEffect, useState } from 'react';
import { AdventureCard } from '@/composants/AdventureCard/AdventureCard.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';

export function AdventureSelection() {
  const { bookId } = useParams();
  const [, setSearch] = useState('');
  const [book, setBook] = useState([]);
  const [adventures, setAdventures] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000';

  useEffect(() => {
    // Fetch adventures from the server
    if (!user) return;
    console.log('fetching adventures');
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: user.token }
    };
    fetch(`${API_URL}/users/aventures/livres/${bookId}`, requestOptions)
      .then((response) =>
        response.json().then((data) => {
          setAdventures(data);
        })
      )
      .catch(() => {
        setAdventures([]);
      });
  }, [user, bookId, setAdventures, API_URL]);

  useEffect(() => {
    // Fetch book from the server
    if (!user) return;
    console.log('fetching books');
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: user.token }
    };
    fetch(`${API_URL}/livres/${bookId}`, requestOptions)
      .then((response) =>
        response.json().then((data) => {
          setBook(data);
        })
      )
      .catch(() => {
        navigate('/');
      });
  }, [bookId, user, setBook, API_URL, navigate]);

  function handleSearch(e) {
    try {
      JSON.parse(localStorage.getItem('user')).id;
    } catch (error) {
      console.log('error');
    }

    setSearch(e.target.value);

    // Filter adventures by name

    const filteredAdventures = adventures.filter((adventure) =>
      adventure.id.toString().includes(e.target.value)
    );

    setAdventures(filteredAdventures);

    // If search is empty, show all adventures
    if (!e.target.value) {
      if (!user) return;
      // Fetch adventuress from the server
      console.log('fetching adventures for the search');
      fetch(`${API_URL}/users/aventures`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: user.token
        }
      }).then((response) => {
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
    if (!user) return;
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `${user.token}` },
      body: JSON.stringify({
        id_utilisateur: user.id,
        id_livre: parseInt(bookId)
      })
    };
    const requestOptionsGet = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `${user.token}` }
    };
    fetch(`${API_URL}/aventures`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          console.error('error creating adventure');
        }
      })
      .then(() => {
        fetch(`${API_URL}/users/aventures/livres/${bookId}`, requestOptionsGet)
          .then((response) =>
            response.json().then((data) => {
              setAdventures(data);
            })
          )
          .catch(() => {
            setAdventures([]);
          });
      });
  }

  function redirect(adventureId) {
    let characterId;
    let currentSection;
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `${user.token}` }
    };
    fetch(`${API_URL}/aventures/${adventureId}`, requestOptions).then((response) => {
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
    });
    return null;
  }

  function ShowAdventures() {
    if (adventures && adventures.length !== 0) {
      return (
        <div>
          <div className={'adventure-selection-adventures'}>
            {adventures?.map((adventure, index) => (
              <div onClick={() => redirect(adventure.id)} key={index}>
                <AdventureCard
                  adventure={adventure}
                  book={book}
                  key={index}
                  handleFavourite={() => {}}
                />
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

  return (
    <div>
      <NavLink to={`/book/`}>← Back to Books</NavLink>
      {book ? (
        <div className="display-book">
          <div className="book-information">
            <h1>{book?.titre ? book.titre : 'Book not found'}</h1>
            <p>{book.resume}</p>
          </div>
          <div className="image-book">
            <img
              src={book?.image?.image ? book.image.image : 'https://placehold.co/500x500.png'}
              alt={'Livre image'}
            />
          </div>
        </div>
      ) : (
        <h1>Book not found</h1>
      )}

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
