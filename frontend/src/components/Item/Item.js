import React from 'react';

export default function Item({ item }) {
  if (!item) return <p>Item not found!</p>;
  return (
    <>
      <h2>{item?.name}</h2>
      <p>
        <strong>Category:</strong> {item?.category}
      </p>
      <p>
        <strong>Price:</strong> ${item?.price.toFixed(2)}
      </p>
    </>
  );
}
