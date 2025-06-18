import { render, screen } from '@testing-library/react';
import Item from './Item';

const mockItem = {
  name: 'Bluetooth Headset',
  category: 'Eletronics',
  price: 99.9,
};

describe('Item component', () => {
  test('Should render an item properly', () => {
    render(<Item item={mockItem} />);

    const itemName = screen.getByText(/Bluetooth Headset/i);
    const itemCategory = screen.getByText(/Eletronics/i);
    const itemPrice = screen.getByText(/99.90/);

    expect(itemName).toBeInTheDocument();
    expect(itemCategory).toBeInTheDocument();
    expect(itemPrice).toBeInTheDocument();
  });

  test('Should render text "item not found" if no item is passed via props', () => {
    render(<Item item={null} />);

    const itemNotFoundText = screen.getByText(/item not found/i);

    expect(itemNotFoundText).toBeInTheDocument();
  });
});
