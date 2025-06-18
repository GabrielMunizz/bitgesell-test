import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);

  // signal to abort fetch if component unmounts before fetch is completed
  const fetchItems = useCallback(async (signal, page = 1, limit = 10) => {
    const res = await fetch(
      `http://localhost:3001/api/items?page=${page}&limit=${limit}`,
      {
        signal,
      }
    );
    const json = await res.json();
    setItems(json);
  }, []);

  return (
    <DataContext.Provider value={{ items, fetchItems }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
