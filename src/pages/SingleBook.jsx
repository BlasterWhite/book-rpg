import { useParams } from 'react-router-dom';

export function SingleBook() {
  const { id } = useParams();
  return (
    <div>
      <h1>Book {id}</h1>
    </div>
  );
}
