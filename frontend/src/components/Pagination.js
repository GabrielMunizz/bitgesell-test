import React from 'react';

function Pagination({ pagination, items, setPage }) {
  return (
    <div>
      <p>Page</p>
      <ul
        style={{
          display: 'flex',
          flexDirection: 'row',
          listStyle: 'none',
          gap: 8,
        }}
      >
        {pagination.map((page) => (
          <li
            style={
              items.page === page
                ? { cursor: 'pointer', textDecoration: 'underline' }
                : { cursor: 'pointer' }
            }
            onClick={() => setPage(page)}
            key={page}
          >
            {page}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Pagination;
