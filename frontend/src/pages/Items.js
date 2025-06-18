import React, { useEffect } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';

function Items() {
  const { items, fetchItems } = useData();

  useEffect(() => {
    // controller to signal if fetch should continue or abort
    const controller = new AbortController();
    const { signal } = controller;

    const fetch = async () => {
      try {
        await fetchItems(signal);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Fetch failed!', err);
        }
      }
    };

    fetch();

    // aborts fetch in case component unmounts before its completion
    return () => {
      controller.abort();
    };
  }, [fetchItems]);

  if (!items.length) return <p>Loading...</p>;

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <Link to={'/items/' + item.id}>{item.name}</Link>
        </li>
      ))}
    </ul>
  );
}

export default Items;
