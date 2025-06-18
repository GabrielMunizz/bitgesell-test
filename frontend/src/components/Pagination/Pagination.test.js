import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';

describe('Pagination component', () => {
  const mockSetPage = jest.fn();

  const defaulPaginationProps = {
    limit: 5,
    items: {
      total: 15,
      page: 1,
    },
    setPage: mockSetPage,
  };

  beforeEach(() => {
    mockSetPage.mockClear();
  });

  test('Render the correct number of page buttons', () => {
    render(<Pagination {...defaulPaginationProps} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('Should call setPage function if button is clicked', async () => {
    render(<Pagination {...defaulPaginationProps} />);

    const pageOneButton = await screen.getByText('1');
    await fireEvent.click(pageOneButton);

    expect(mockSetPage).toHaveBeenCalledWith(1);
  });

  test('Should show an underline decoration on selected page', async () => {
    render(<Pagination {...defaulPaginationProps} />);

    const selectedPage = await screen.findByText('1');

    expect(selectedPage).toHaveStyle('text-decoration: underline');
  });
});
