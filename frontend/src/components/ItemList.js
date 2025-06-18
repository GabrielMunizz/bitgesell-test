import { Link } from 'react-router-dom';

function ItemList({ items }) {
  return (
    <div>
      <ul>
        {items.results?.map((item) => (
          <li key={item.id}>
            <Link to={'/items/' + item.id}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ItemList;
