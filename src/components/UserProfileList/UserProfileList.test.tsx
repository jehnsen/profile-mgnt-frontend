import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { api } from '../../api/apiService';
import UserProfileList from './UserProfileList';
import { IUserProfile } from '../../interfaces/userProfile';

const mockProfiles: IUserProfile[] = [
    { _id: '1', name: 'Tony Stark', email: 'ironmann@example.com', age: 12, tags: ['admin', 'user'] },
    { _id: '2', name: 'Steve Rogers', email: 'capt@example.com', age: 12, tags: ['user'] },
    // add more mock profiles as needed
];

const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
});

jest.mock('../../api/apiService', () => ({
    ...jest.requireActual('../../api/apiService'),
    useGetAllProfilesQuery: jest.fn(),
    useDeleteProfileMutation: jest.fn(),
}));

describe('UserProfileList', () => {
    beforeEach(() => {
        (require('../../api/apiService').useGetAllProfilesQuery as jest.Mock).mockReturnValue({
            data: mockProfiles,
            error: null,
            isLoading: false,
        });
        (require('../../api/apiService').useDeleteProfileMutation as jest.Mock).mockReturnValue([
            jest.fn().mockResolvedValue(true),
        ]);
    });

    test('renders loading spinner when loading', () => {
        (require('../../api/apiService').useGetAllProfilesQuery as jest.Mock).mockReturnValue({
            data: null,
            error: null,
            isLoading: true,
        });
        render(
            <Provider store={store}>
                <UserProfileList />
            </Provider>
        );
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    test('renders error message on error', () => {
        (require('../../api/apiService').useGetAllProfilesQuery as jest.Mock).mockReturnValue({
            data: null,
            error: { status: 500, message: 'Internal Server Error' },
            isLoading: false,
        });
        render(
            <Provider store={store}>
                <UserProfileList />
            </Provider>
        );
        expect(screen.getByText(/Error: 500/i)).toBeInTheDocument();
    });

    test('renders profiles and handles search', () => {
        render(
            <Provider store={store}>
                <UserProfileList />
            </Provider>
        );

        const searchBox = screen.getByPlaceholderText('Search...');
        fireEvent.change(searchBox, { target: { value: 'john' } });

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();

        fireEvent.change(searchBox, { target: { value: '' } });

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    test('handles pagination', () => {
        render(
            <Provider store={store}>
                <UserProfileList />
            </Provider>
        );

        // Assuming itemsPerPage is 5 and there are more than 5 profiles
        const nextPageButton = screen.getByText('Next');
        fireEvent.click(nextPageButton);

        // Check if the second page is rendered correctly
        // You might need to add more mockProfiles to test pagination properly
    });

    test('opens and closes create profile modal', () => {
        render(
            <Provider store={store}>
                <UserProfileList />
            </Provider>
        );

        const createButton = screen.getByText('Create New');
        fireEvent.click(createButton);

        expect(screen.getByText('Create Profile')).toBeInTheDocument();

        const closeButton = screen.getByText('Close');
        fireEvent.click(closeButton);

        expect(screen.queryByText('Create Profile')).not.toBeInTheDocument();
    });

    test('opens and closes delete confirmation modal', () => {
        render(
            <Provider store={store}>
                <UserProfileList />
            </Provider>
        );

        const deleteButton = screen.getAllByText('Delete')[0];
        fireEvent.click(deleteButton);

        expect(screen.getByText('Are you sure you want to delete this profile?')).toBeInTheDocument();

        const cancelButton = screen.getByText('Cancel');
        fireEvent.click(cancelButton);

        expect(screen.queryByText('Are you sure you want to delete this profile?')).not.toBeInTheDocument();
    });

    test('confirms deletion', async () => {
        render(
            <Provider store={store}>
                <UserProfileList />
            </Provider>
        );

        const deleteButton = screen.getAllByText('Delete')[0];
        fireEvent.click(deleteButton);

        const confirmButton = screen.getByText('Confirm');
        fireEvent.click(confirmButton);

        await waitFor(() => expect(screen.queryByText('Are you sure you want to delete this profile?')).not.toBeInTheDocument());
    });
});