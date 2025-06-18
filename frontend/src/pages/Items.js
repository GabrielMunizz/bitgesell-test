import { useEffect, useState } from 'react';
import { useData } from '../state/DataContext';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import ItemList from '../components/ItemList';

function Items() {
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, _setLimit] = useState(3);
  const { items, fetchItems } = useData();

  useEffect(() => {
    // controller to signal if fetch should continue or abort
    const controller = new AbortController();
    const { signal } = controller;

    const fetch = async () => {
      setIsLoading(true);
      try {
        await fetchItems(signal, page, limit);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Fetch failed!', err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetch();

    // aborts fetch in case component unmounts before its completion
    return () => {
      controller.abort();
    };
  }, [fetchItems, page]);

  // number of pages according to limit
  const pagination = Array.from(
    { length: items?.total / limit },
    (_v, k) => k + 1
  );

  if (isLoading) return <Loader />;

  return (
    <main>
      <p>{items?.total} items found</p>

      <ItemList items={items} />

      <Pagination pagination={pagination} items={items} setPage={setPage} />
    </main>
  );
}

export default Items;
