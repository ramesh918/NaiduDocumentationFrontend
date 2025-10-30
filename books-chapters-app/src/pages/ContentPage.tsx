import { useParams } from 'react-router-dom';

export default function ContentPage(){
  const { bookId, chapterId } = useParams();
  return (
    <div>
      <h1>Contents — placeholder</h1>
      <p>Book: <strong>{bookId}</strong></p>
      <p>Chapter: <strong>{chapterId}</strong></p>
      <p>Next we will implement pagination, markdown view/edit, and content CRUD.</p>
    </div>
  );
}