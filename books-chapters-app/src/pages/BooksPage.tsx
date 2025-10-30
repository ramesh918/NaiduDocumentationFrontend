import { Link } from 'react-router-dom';

export default function BooksPage(){
  return (
    <div>
      <h1>Books — placeholder</h1>
      <p>This is the Books page. Next we will implement listing, create/update/delete using your API.</p>
      <p>Example links (replace ids when testing):</p>
      <ul>
        <li><Link to="/books/BOOK_ID/chapters">Go to chapters for BOOK_ID</Link></li>
      </ul>
    </div>
  );
}