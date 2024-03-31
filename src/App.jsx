import './App.css';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { SingleBook } from './pages/Book/SingleBook.jsx';
import { Books } from './pages/Books.jsx';
import { Home } from './pages/Home.jsx';
import { CharacterSelection } from './pages/Book/CharacterSelection.jsx';
import { LoginView } from './pages/Account/LoginView.jsx';
import { RegisterView } from './pages/Account/RegisterView.jsx';
import { Navbar } from './composants/Navbar.jsx';
import { AdminBookListView } from '@/pages/Admin/AdminBookListView/AdminBookListView.jsx';
import { AdminBookEditView } from '@/pages/Admin/AdminBookEditView/AdminBookEditView.jsx';
import { ErrorView } from '@/pages/Errors/ErrorView.jsx';
import { AdminNodeListView } from '@/pages/Admin/AdminNodeListView/AdminNodeListView.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorView />,
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
      },
      {
        path: 'admin',
        element: <Outlet />,
        children: [
          {
            path: '',
            element: <AdminBookListView />
          },
          {
            path: ':id',
            element: <AdminBookEditView />
          },
          {
            path: ':id/section',
            element: <Outlet />,
            children: [
              {
                path: '',
                element: <AdminNodeListView />
              },
              {
                path: ':sectionId',
                element: <h1>TODO: Section</h1>
              }
            ]
          }
        ]
      }
    ]
  }
]);

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
