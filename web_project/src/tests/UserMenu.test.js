import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import UserMenu from '../components/UserMenu/UserMenu';

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

    describe('clicking delete button and', () => {
        test('confirming should trigeer delete user request', async () => {
            window.confirm = jest.fn().mockImplementation(() => true);
            sessionStorage.setItem('JWT', 'dummyToken');

            axios.delete.mockResolvedValueOnce({});

            let res;
            const jsdomAlert = window.alert;
            window.alert = (x) => { res = x };

            render(<UserMenu />, { wrapper: MemoryRouter });

            const deleteButton = screen.getByText(/delete/i);
            fireEvent.click(deleteButton);

            await waitFor(() => {
                expect(window.confirm).toHaveBeenCalledWith('Do you really want to delete account?');
                expect(axios.delete).toHaveBeenCalledWith('http://localhost:5000/user', {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer dummyToken',
                    },
                });
                expect(res).not.toBe(undefined);
                expect(sessionStorage.getItem('JWT')).toBe(null);
            });

            window.alert = jsdomAlert;
        });

        test('not confirming should not trigeer delete user request', () => {
            window.confirm = jest.fn().mockImplementation(() => false);
            sessionStorage.setItem('JWT', 'dummyToken');

            let res;
            const jsdomAlert = window.alert;
            window.alert = (x) => { res = x };

            render(<UserMenu />, { wrapper: MemoryRouter });

            const deleteButton = screen.getByText(/delete/i);
            fireEvent.click(deleteButton);

            expect(window.confirm).toHaveBeenCalledWith('Do you really want to delete account?');
            expect(axios.delete).not.toHaveBeenCalled();
            expect(res).toBe(undefined);
            expect(sessionStorage.getItem('JWT')).not.toBe(null);

            window.alert = jsdomAlert;
        });
    });

});