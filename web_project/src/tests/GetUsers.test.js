import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import GetUsers from '../components/GetUsers/GetUsers';

jest.mock('axios');

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom')),
    useNavigate: () => mockedUsedNavigate,
}))

describe('User', () => {
    beforeEach(() => {
        axios.get.mockClear();
        sessionStorage.clear();
        sessionStorage.setItem('JWT', 'Some token');
    });

    test('opening users page when users are being fetched should see loading message ', async () => {
        axios.get.mockResolvedValueOnce(null);

        await act(() => {
            waitFor(() => {
                render(<GetUsers />, { wrapper: MemoryRouter });
            });
        });

        const loadingMessage = screen.getByText('Loading...');
        expect(loadingMessage).toBeInTheDocument();
    });

    test('should be redirected to login when JWT is not set', async () => {
        sessionStorage.removeItem('JWT');
        axios.get.mockResolvedValueOnce(null);

        await waitFor(() => {
            render(<GetUsers />, { wrapper: MemoryRouter });
        });    
        
        expect(mockedUsedNavigate).toBeCalled;
        mockedUsedNavigate.mockReset();
    });

    test('should see error message when fetching users fails', async () => {
        const mockErrorResponse = {
            response: {
                data: {
                    msg: 'Error fetching users',
                },
            },
        };

        axios.get.mockRejectedValueOnce(mockErrorResponse);
        sessionStorage.setItem('JWT', 'mock-jwt-token');

        await act(() => {
            waitFor(() => {
                render(<GetUsers />, { wrapper: MemoryRouter });
            });
        });

        await waitFor(() => {
            const errorMessage = screen.getByText('Error: Error fetching users');
            expect(errorMessage).toBeInTheDocument();
        });
    });

    test('should see user emails and roles when users are available', async () => {
        const mockUsersResponse = {
            status: 200,
            data: {
                Users: [
                    {
                        id: 1,
                        email: 'user1@example.com',
                        role: 'User',
                    },
                    {
                        id: 2,
                        email: 'user2@example.com',
                        role: 'User',
                    },
                ],
            },
        };

        axios.get.mockResolvedValueOnce(mockUsersResponse);
        sessionStorage.setItem('JWT', 'mock-jwt-token');

        await waitFor(() => {
            render(<GetUsers />, { wrapper: MemoryRouter });
        });           

        await waitFor(() => {
            const userItems = screen.getAllByRole('listitem');
            expect(userItems).toHaveLength(2);
            expect(screen.getByText('user1@example.com')).toBeInTheDocument();
            expect(screen.getByText('user2@example.com')).toBeInTheDocument();
            expect(screen.getAllByText('User')).toHaveLength(2);
        });
    });
});