import './App.css';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { SingleBook } from '@/pages/Book/SingleBook.jsx';
import { LibraryView } from '@/pages/Library/LibraryView.jsx';
import { HomeView } from '@/pages/Home/HomeView.jsx';
import { AdventureSelection } from '@/pages/Book/AdventureSelection.jsx';
import { LoginView } from '@/pages/Account/LoginView.jsx';
import { RegisterView } from '@/pages/Account/RegisterView.jsx';
import { Footer } from '@/composants/Footer/Footer.jsx';
import { Navbar } from '@/composants/NavBar/Navbar.jsx';
import { AdminBookListView } from '@/pages/Admin/AdminBookListView/AdminBookListView.jsx';
import { AdminBookEditView } from '@/pages/Admin/AdminBookEditView/AdminBookEditView.jsx';
import { ErrorView } from '@/pages/Errors/ErrorView.jsx';
import { AdminSectionListView } from '@/pages/Admin/AdminSectionListView/AdminSectionListView.jsx';
import { AdminSectionEditView } from '@/pages/Admin/AdminSectionEditView/AdminSectionEditView.jsx';
import { useEffect, useState } from 'react';
import { AuthContext } from './composants/AuthContext/AuthContext.jsx';

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
                element: <AdminSectionEditView />
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const login = (data) => {
    setIsLoggedIn(true);
    setUser(data.user);
    document.cookie = `token=${data.token}; max-age=86400; path=/`;
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('isLoggedIn', true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    document.cookie.split(';').forEach(function (c) {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const user = localStorage.getItem('user');
    if (isLoggedIn) {
      setIsLoggedIn(true);
    }
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      <RouterProvider router={router}></RouterProvider>
    </AuthContext.Provider>
  );
}

export default App;
