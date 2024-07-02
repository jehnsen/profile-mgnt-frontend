import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DataTable from './DataTable';
import { generateDataItems } from '../../utils/generateDataItems';
import { calcTotal } from '../../utils/helpers';

jest.mock('../../utils/generateDataItems');
jest.mock('../../utils/helpers');

describe('DataTable Component', () => {
  const mockDataItems = [
    { id: 1, value: 'Item 1', number: 1 },
    { id: 2, value: 'Item 2', number: 2 },
    { id: 3, value: 'Item 3', number: 3 },
    // Add more mock items as needed
  ];

  beforeEach(() => {
    (generateDataItems as jest.Mock).mockReturnValue(mockDataItems);
    (calcTotal as jest.Mock).mockReturnValue(mockDataItems.reduce((acc, item) => acc + item.number * 2, 0));
  });

  test('renders DataTable component', () => {
    render(<DataTable />);

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  test('handles search input', async () => {
    render(<DataTable />);

    const searchBox = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchBox, { target: { value: 'Item 1' } });

    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.queryByText('Item 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Item 3')).not.toBeInTheDocument();
    });
  });

  test('clears search input', () => {
    render(<DataTable />);

    const searchBox = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchBox, { target: { value: 'Item 1' } });

    const clearButton = screen.getByText('Clear');
    fireEvent.click(clearButton);

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  test('handles pagination', () => {
    render(<DataTable />);

    const nextPageButton = screen.getByText('Next');
    fireEvent.click(nextPageButton);

    expect(screen.getByText('Page 2')).toBeInTheDocument();
  });
});
