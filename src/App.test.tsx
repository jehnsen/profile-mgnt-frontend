import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import '@testing-library/jest-dom/extend-expect';

jest.mock('./components/UserProfileList/UserProfileList', () => () => <div>UserProfileList Component</div>);
jest.mock('./components/DataTable/DataTable', () => () => <div>DataTable Component</div>);
jest.mock('./components/ui/LoadingSpinner', () => () => <div data-testid="loading-spinner">Loading...</div>);

describe('App Component', () => {
  test('renders the layout and routes correctly', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Check if the fallback loading spinner is displayed
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    // Wait for the lazy-loaded components to be rendered
    await screen.findByText('UserProfileList Component');
    await screen.findByText('DataTable Component');

    // Check if the components are rendered
    expect(screen.getByText('UserProfileList Component')).toBeInTheDocument();
    expect(screen.getByText('DataTable Component')).toBeInTheDocument();
  });

  test('renders the UserProfileList component on the root path', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Check if the fallback loading spinner is displayed
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    // Wait for the lazy-loaded component to be rendered
    await screen.findByText('UserProfileList Component');

    // Check if the UserProfileList component is rendered
    expect(screen.getByText('UserProfileList Component')).toBeInTheDocument();
  });

  test('renders the DataTable component on the /datatable path', async () => {
    render(
      <MemoryRouter initialEntries={['/datatable']}>
        <App />
      </MemoryRouter>
    );

    // Check if the fallback loading spinner is displayed
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    // Wait for the lazy-loaded component to be rendered
    await screen.findByText('DataTable Component');

    // Check if the DataTable component is rendered
    expect(screen.getByText('DataTable Component')).toBeInTheDocument();
  });
});
