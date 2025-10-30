import { useParams, Link } from 'react-router-dom';

export default function ChaptersPage(){
  const { bookId } = useParams();
  const chapterPath = `/books/${bookId}/chapters/CHAPTER_ID/contents`;
  return (
    <div>
      <h1>Chapters — placeholder</h1>
      <p>Book ID: <strong>{bookId}</strong></p>
      <p>Next we will fetch chapters for the book and implement create/update/delete.</p>
      <p><Link to={chapterPath}>Sample chapter contents</Link></p>
    </div>
  );
}
