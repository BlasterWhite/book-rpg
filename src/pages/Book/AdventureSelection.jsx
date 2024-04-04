import { useParams } from 'react-router-dom';
import './AdventureSelection.scss';
import { useEffect, useState } from 'react';
import { AdventureCard } from '@/composants/AdventureCard/AdventureCard.jsx';
import Cookies from 'js-cookie';

export function AdventureSelection() {
  const { bookId } = useParams();
  const [, setSearch] = useState('');
  const [adventures, setAdventures] = useState([]);

  let token = Cookies.get('token');
  useEffect(() => {
    // Fetch adventures from the server
    console.log('fetching adventures');
    if (!token) {
      window.location.href = '/login';
    }
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `${token}` }
    };
    fetch(
      `${import.meta.env.VITE_API_URL}/users/${JSON.parse(localStorage.getItem('user')).id}/aventures/${bookId}`,
      requestOptions
    ).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setAdventures(data);
        });
      } else {
        console.error('Error fetching adventures');
      }
    });
  }, [token]);

  function handleSearch(e) {
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
        `${import.meta.env.VITE_API_URL}/users/${JSON.parse(localStorage.getItem('user')).id}/aventures`
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
      headers: { 'Content-Type': 'application/json', Authorization: `${token}` },
      body: JSON.stringify({
        id_utilisateur: 1,
        id_livre: parseInt(bookId)
      })
    };
    const requestOptionsGet = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `${token}` }
    };
    fetch(`${import.meta.env.VITE_API_URL}/aventures`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          console.error('error creating adventure');
        }
      })
      .then(() => {
        fetch(
          `${import.meta.env.VITE_API_URL}/users/${JSON.parse(localStorage.getItem('user')).id}/aventures`,
          requestOptionsGet
        )
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Error fetching adventures');
            }
          })
          .then((data) => {
            setAdventures(data);
          })
          .catch((error) => {
            console.error(error);
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
    fetch(`${import.meta.env.VITE_API_URL}/aventures/${adventureId}`, requestOptions).then(
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
                <AdventureCard adventure={adventure} key={index} />
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
      <h1>Book {bookId}</h1>
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
