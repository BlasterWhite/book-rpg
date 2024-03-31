import './ErrorView.scss';
import { useRouteError } from 'react-router-dom';
import { Navbar } from '@/composants/Navbar.jsx';

export function ErrorView() {
  const error = useRouteError();
  return (
    <div className={'error-view'}>
      <Navbar />
      <main>
        <div className={'error'}>
          <h1>💥 Error {error.status}</h1>
          <h3>{error.statusText}</h3>
        </div>
      </main>
    </div>
  );
}
