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
import { AdminEquipementEditView } from '@/pages/Admin/AdminEquipementEditView/AdminEquipementEditView.jsx';
import { AdminEquipementListView } from '@/pages/Admin/AdminEquipementListView/AdminEquipementListView.jsx';
import { AdminWeaponListView } from '@/pages/Admin/AdminWeaponListView/AdminWeaponListView.jsx';
import { AdminWeaponEditView } from '@/pages/Admin/AdminWeaponEditView/AdminWeaponEditView.jsx';
import { AdminView } from '@/pages/Admin/AdminView.jsx';
import { ProtectedRoute } from '@/pages/ProtectedRoute.jsx';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import { ProfilView } from '@/pages/Account/ProfilView.jsx';
import { AdminEnemyListView } from '@/pages/Admin/AdminEnemyListView/AdminEnemyListView.jsx';
import { AdminEnenyEditView } from '@/pages/Admin/AdminEnemyEditView/AdminEnenyEditView.jsx';

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
            element: (
              <ProtectedRoute permissions={['user', 'admin']} redirect={'/login'}>
                <Outlet />
              </ProtectedRoute>
            ),
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
        path: 'profile',
        element: (
          <ProtectedRoute permissions={['user', 'admin']} redirect={'/login'}>
            <ProfilView />
          </ProtectedRoute>
        )
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute permissions={['admin']} redirect={'/'}>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          {
            path: '',
            element: <AdminView />
          },
          {
            path: 'book',
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
          },
          {
            path: 'weapon',
            element: <Outlet />,
            children: [
              {
                path: '',
                element: <AdminWeaponListView />
              },
              {
                path: ':weaponId',
                element: <AdminWeaponEditView />
              }
            ]
          },
          {
            path: 'equipment',
            element: <Outlet />,
            children: [
              {
                path: '',
                element: <AdminEquipementListView />
              },
              {
                path: ':equipmentId',
                element: <AdminEquipementEditView />
              }
            ]
          },
          {
            path: 'enemy',
            element: <Outlet />,
            children: [
              {
                path: '',
                element: <AdminEnemyListView />
              },
              {
                path: ':enemyId',
                element: <AdminEnenyEditView />
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
        <Footer isFoldable={true} folded={true} />
      </footer>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
  );
}

export default App;
