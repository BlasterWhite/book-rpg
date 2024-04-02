import './App.css';
import { createBrowserRouter, Outlet, RouterProvider, useRouteError } from 'react-router-dom';
import { SingleBook } from './pages/Book/SingleBook.jsx';
import { LibraryView } from './pages/Library/LibraryView.jsx';
import { HomeView } from './pages/Home/HomeView.jsx';
import { CharacterSelection } from './pages/Book/CharacterSelection.jsx';
import { LoginView } from './pages/Account/LoginView.jsx';
import { RegisterView } from './pages/Account/RegisterView.jsx';
import { Footer } from './composants/Footer/Footer.jsx';
import { Navbar } from './composants/NavBar/Navbar.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <PageError />,
    children: [
      {
        path: '',
        element: <HomeView />
      },
      {
        path: 'book',
        element: <Outlet />,
        children: [
          {
            path: '',
            element: <LibraryView />
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
      <footer>
        <Footer />
      </footer>
    </>
  );
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
