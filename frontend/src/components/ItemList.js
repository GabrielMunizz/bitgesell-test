import { Link } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';

function ItemList({ items }) {
  const { results } = items;

  // fallback if list comes empty
  if (!results || results.length === 0) {
    return <p>No items found.</p>;
  }

  // react-window List component if list of items grows too long
  return (
    <List height={300} itemCount={results.length} itemSize={35} width={500}>
      {({ index, style }) => {
        const item = results[index];

        return (
          <Link to={`/items/${item?.id}`} style={style}>
            {item?.name}
          </Link>
        );
      }}
    </List>
  );
}

export default ItemList;
