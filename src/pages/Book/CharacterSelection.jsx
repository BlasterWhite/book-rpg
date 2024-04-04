import { useParams } from 'react-router-dom';

export function CharacterSelection() {
  const { bookId } = useParams();
  return (
    <div>
      <h1>Book {bookId}</h1>
      <h3>Character Selection url /book/:idLivres</h3>
    </div>
  );
}
