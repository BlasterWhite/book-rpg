import './App.css';
import { createBrowserRouter, Outlet, RouterProvider, useRouteError } from 'react-router-dom';
import { SingleBook } from './pages/Book/SingleBook.jsx';
import { LibraryView } from './pages/Library/LibraryView.jsx';
import { HomeView } from './pages/Home/HomeView.jsx';
import { AdventureSelection } from './pages/Book/AdventureSelection.jsx';
import { LoginView } from './pages/Account/LoginView.jsx';
import { RegisterView } from './pages/Account/RegisterView.jsx';
import { Footer } from './composants/Footer/Footer.jsx';
import { Navbar } from './composants/NavBar/Navbar.jsx';
import { AdminBookListView } from '@/pages/Admin/AdminBookListView/AdminBookListView.jsx';
import { AdminBookEditView } from '@/pages/Admin/AdminBookEditView/AdminBookEditView.jsx';
import { ErrorView } from '@/pages/Errors/ErrorView.jsx';
import { AdminSectionListView } from '@/pages/Admin/AdminSectionListView/AdminSectionListView.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorView />,
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
                element: <AdventureSelection />
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
            path: ':bookId',
            element: <AdminBookEditView />
          },
          {
            path: ':bookId/section',
            element: <Outlet />,
            children: [
              {
                path: '',
                element: <AdminSectionListView />
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
