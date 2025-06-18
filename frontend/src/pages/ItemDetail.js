import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader/Loader';

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchItem = async (signal) => {
      setIsLoading(true);

      try {
        const res = await fetch(`http://localhost:3001/api/items/${id}`, {
          signal,
        });

        const data = await res.json();
        setItem(data);
      } catch (err) {
        console.error('Failed to fetch item', err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem(signal);

    () => {
      controller.abort();
    };
  }, [id, navigate]);

  if (isLoading) return <Loader />;
  if (!item) return <p>Item not found!</p>;

  return (
    <div style={{ padding: 16 }}>
      <h2>{item?.name}</h2>
      <p>
        <strong>Category:</strong> {item?.category}
      </p>
      <p>
        <strong>Price:</strong> ${item?.price}
      </p>
    </div>
  );
}

export default ItemDetail;
