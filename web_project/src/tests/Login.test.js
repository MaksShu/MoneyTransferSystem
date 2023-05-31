import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Login from '../components/Login/Login';

jest.mock('axios');

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom')),
    useNavigate: () => mockedUsedNavigate,
}))

describe('User', () => {
    beforeEach(() => {
        axios.post.mockReset();
    });

    describe('opening login page', () => {
        test('should see the login form', () => {
            render(<Login />, { wrapper: MemoryRouter });

            expect(screen.getByText(/login/i)).toBeInTheDocument();
            expect(screen.getByText(/password/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
        });

        test('loggined should be redirected to users page', async () => {
            sessionStorage.setItem('JWT', 'some token');

            await act(async () => {
                render(<Login />, { wrapper: MemoryRouter });
            });

            expect(mockedUsedNavigate).toBeCalled();
            mockedUsedNavigate.mockRestore();
        });
    });

    test('changing email and password in form should trigger value changes', async () => {
        render(<Login />, { wrapper: MemoryRouter });

        const emailInput = screen.getByLabelText('Username:');
        const passwordInput = screen.getByLabelText('Password:');

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        await act(async () => {
            expect(emailInput.value).toBe('test@example.com');
            expect(passwordInput.value).toBe('password123');
        });
    });

    test('submiting the form with correct data should trigger successful login request', async () => {
        axios.post.mockResolvedValueOnce({data:{access_token:'Some token'}});

        render(<Login />, { wrapper: MemoryRouter });

        const emailInput = screen.getByLabelText('Username:');
        const passwordInput = screen.getByLabelText('Password:');
        const submitButton = screen.getByRole('button', { name: /sign in/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:5000/user/login',
                { email: 'test@example.com', password: 'password123' },
                expect.any(Object)
            );
        });
    });

    test('should be redirected to the correct route after successful login', () => {
        axios.post.mockResolvedValueOnce({data:{access_token:'Some token'}});

        render(<Login />, { wrapper: MemoryRouter });

        const emailInput = screen.getByLabelText('Username:');
        const passwordInput = screen.getByLabelText('Password:');
        const submitButton = screen.getByRole('button', { name: /sign in/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        waitFor(() => {
            expect(mockedUsedNavigate).toHaveBeenCalledWith('../users');
        });

        mockedUsedNavigate.mockRestore();
    });

    test('should see error message on login failure', async () => {
        axios.post.mockRejectedValueOnce({ response: { data: { error: { message: 'Invalid credentials' } } } });

        let res;
        const jsdomAlert = window.alert;
        window.alert = (x) => { res = x };

        await act(async () => {
            render(<Login />, { wrapper: MemoryRouter });
        });

        const emailInput = screen.getByLabelText('Username:');
        const passwordInput = screen.getByLabelText('Password:');
        const submitButton = screen.getByRole('button', { name: /sign in/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:5000/user/login',
                { email: 'test@example.com', password: 'password123' },
                expect.any(Object)
            );
        });

        expect(res).toBe('Invalid credentials');

        window.alert = jsdomAlert;
    });
});