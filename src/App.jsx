import './App.css';
import {
  createBrowserRouter,
  NavLink,
  Outlet,
  RouterProvider,
  useRouteError
} from 'react-router-dom';
import { SingleBook } from './pages/SingleBook.jsx';
import { Books } from './pages/Books.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <PageError />,
    children: [
      {
        path: 'blog',
        element: <div>Blog</div>
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
            path: ':id',
            element: <SingleBook />
          }
        ]
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
        <nav>
          <NavLink to={'/'}>Home</NavLink>
          <NavLink to={'/blog'}>Blog</NavLink>
          <NavLink to={'/book'}>Books</NavLink>
        </nav>
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
