import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import UserMenu from '../components/UserMenu/UserMenu';
import { ToastContainer } from 'react-toastify';

jest.mock('axios');

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom')),
  useNavigate: () => mockedUsedNavigate,
}))

describe('User', () => {
    beforeEach(() => {
        sessionStorage.clear();

        axios.delete.mockReset();
    });

    describe('opening menu should see', () => {
        test('login link if user is not logged in', () => {
            render(<UserMenu />, { wrapper: MemoryRouter });

            const loginLink = screen.getByRole('link', { name: /login/i });
            expect(loginLink).toBeInTheDocument();
        });

        test('menu options if user is logged in', async () => {
            sessionStorage.setItem('JWT', 'Some token');

            await act(() => {
                render(<UserMenu />, { wrapper: MemoryRouter });
            });

            const changeLink = screen.getByRole('link', { name: /change/i });
            const logoutButton = screen.getByText(/log out/i);
            const deleteButton = screen.getByText(/delete/i);

            expect(changeLink).toBeInTheDocument();
            expect(logoutButton).toBeInTheDocument();
            expect(deleteButton).toBeInTheDocument();
        });
    });

    test('clicking log out button should be logged out and redirected to home page', async () => {
        sessionStorage.setItem('JWT', 'Some token');

        render(<UserMenu />, { wrapper: MemoryRouter });

        const logoutButton = screen.getByText(/log out/i);
        fireEvent.click(logoutButton);

        await waitFor(() => {
            expect(sessionStorage.getItem('JWT')).toBe(null);      
        });   

    });

});