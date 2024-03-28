import { useParams } from 'react-router-dom';

export function SingleBook() {
  const { bookId, characterId, sectionId } = useParams();
  return (
    <div>
      <h1>Book {bookId}</h1>
      <h3>Character : {characterId}</h3>
      <h3>Section : {sectionId}</h3>
    </div>
  );
}
