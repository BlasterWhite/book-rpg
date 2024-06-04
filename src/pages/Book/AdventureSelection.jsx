import { useNavigate, useParams, NavLink } from 'react-router-dom';
import './AdventureSelection.scss';
import { useEffect, useState } from 'react';
import { AdventureCard } from '@/composants/AdventureCard/AdventureCard.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TextPagination } from '@/composants/TextPagination/TextPagination.jsx';

export function AdventureSelection() {
  const { bookId } = useParams();
  const [, setSearch] = useState('');
  const [book, setBook] = useState({});
  const [adventures, setAdventures] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000';

  useEffect(() => {
    // Fetch adventures from the server
    if (!user) return;
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
      return;
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
      fetch(`${API_URL}/users/aventures`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: user.token
        }
      }).then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            if (data && data.length > 0)
              setAdventures(data.filter((adventure) => adventure.id_livre === parseInt(bookId)));
          });
        } else {
          displayMsg('An error occured while fetching the adventures');
        }
      });
    }
  }

  function deleteAdventure(adventureId) {
    if (!user) return;

    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `${user.token}` }
    };
    fetch(`${API_URL}/aventures/${adventureId}`, requestOptions).then((response) => {
      if (!response.ok) {
        displayMsg('An error occured while deleting the adventure');
      } else {
        setAdventures(adventures.filter((adventure) => adventure.id !== adventureId));
      }
    });
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
          displayMsg('An error occured while creating the adventure');
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

  function displayMsg(msg) {
    toast.error(msg, {
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
  }

  function ShowAdventures() {
    if (adventures && adventures?.length && adventures?.length > 0) {
      return (
        <div className={'adventure-list'}>
          {adventures?.map((adventure, index) => (
            <AdventureCard
              adventure={adventure}
              book={book}
              key={index}
              deleteFn={deleteAdventure}
            />
          ))}
          <button className={'adventure-creation'} onClick={createAdventure}>
            Create a new adventure
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <button className={'adventure-creation'} onClick={createAdventure}>
            Begin the adventure!
          </button>
        </div>
      );
    }
  }

  return (
    <div className={'adventure-selection'}>
      <NavLink to={`/book/`}>← Back to Books</NavLink>
      {book ? (
        <>
          <div className="book-display">
            <div className="book-information">
              <h1>{book?.titre ? book.titre : 'Book not found'}</h1>
              <TextPagination text={book?.resume ? book.resume : 'No summary for this book'} />
            </div>
            <div
              className="book-image"
              style={{
                backgroundImage: `url(${book?.image?.image ? book.image.image : 'https://placehold.co/500x500.png'})`
              }}></div>
          </div>
          <div className={'separator'}>
            <hr />
            <span>Select your adventure</span>
            <hr />
          </div>
          <div className={'adventure-selection'}>
            {adventures && adventures?.length && adventures?.length > 5 ? (
              <form className={'adventure-filter'}>
                <input type="text" placeholder="Search an adventure" onChange={handleSearch} />
              </form>
            ) : null}
            <div className={'adventure-list'}>
              <ShowAdventures />
            </div>
          </div>
        </>
      ) : (
        <h1>Book not found</h1>
      )}
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
