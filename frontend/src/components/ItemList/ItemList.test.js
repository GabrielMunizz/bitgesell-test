import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ItemList from './ItemList';

describe('ItemList Component', () => {
  const Wrapper = ({ children }) => <MemoryRouter>{children}</MemoryRouter>;

  test('renders no items message when results is empty or undefined', () => {
    render(<ItemList items={{ results: [] }} />, { wrapper: Wrapper });

    expect(screen.getByText(/no items found/i)).toBeInTheDocument();
  });

  test('renders list of items with links', () => {
    const mockItems = {
      results: [
        { id: 1, name: 'Item One' },
        { id: 2, name: 'Item Two' },
      ],
    };

    render(<ItemList items={mockItems} />, { wrapper: Wrapper });

    expect(screen.getByText('Item One')).toBeInTheDocument();
    expect(screen.getByText('Item Two')).toBeInTheDocument();
  });
});
