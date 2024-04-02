import './App.css';
import { createBrowserRouter, Outlet, RouterProvider, useRouteError } from 'react-router-dom';
import { SingleBook } from './pages/Book/SingleBook.jsx';
import { Books } from './pages/Books.jsx';
import { Home } from './pages/Home.jsx';
import { CharacterSelection } from './pages/Book/CharacterSelection.jsx';
import { LoginView } from './pages/Account/LoginView.jsx';
import { RegisterView } from './pages/Account/RegisterView.jsx';
import { Navbar } from './composants/Navbar.jsx';
import { BookCreationView } from '@/pages/Admin/BookCreationView.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <PageError />,
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: 'book',
        element: <Outlet />,
        children: [
          {
            path: '',
            element: <Books />
          },
          {
            path: ':bookId',
            element: <Outlet />,
            children: [
              {
                path: '',
                element: <CharacterSelection />
              },
              {
                path: ':characterId',
                element: <Outlet />,
                children: [
                  {
                    path: '',
                    element: <h1>TODO: Error no section precise</h1>
                  },
                  {
                    path: ':sectionId',
                    element: <SingleBook />
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        path: 'login',
        element: <LoginView />
      },
      {
        path: 'register',
        element: <RegisterView />
      }
    ]
  }
]);

function PageError() {
  const error = useRouteError();
  return (
    <>
      <h1>Error {error.status}</h1>
      <h3>{error.statusText}</h3>
    </>
  );
}

function Root() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
