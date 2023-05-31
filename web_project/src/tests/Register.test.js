import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Register from '../components/Register/Register';

jest.mock('axios');

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom')),
    useNavigate: () => mockedUsedNavigate,
}))

describe('User', () => {
    beforeEach(() => {
        sessionStorage.clear();
        axios.post.mockReset();
    });

    test('opening register page loggined should be redirected to users page', async () => {
        sessionStorage.setItem('JWT', 'some token');

        await act(async () => {
            render(<Register />, { wrapper: MemoryRouter });
        });

        expect(mockedUsedNavigate).toBeCalled();
        mockedUsedNavigate.mockRestore();
    });

    describe('submiting the registration form with', () => {
        test('correct data should trigger successful register request', async () => {
            const mockSuccessResponse = {
                data: {
                message: 'Registration successful',
                },
            };
            axios.post.mockResolvedValueOnce(mockSuccessResponse);

            let res;
            const jsdomAlert = window.alert;
            window.alert = (x) => { res = x };

            await act(async () => {
                render(<Register />, { wrapper: MemoryRouter });
            });

            const emailInput = screen.getByLabelText(/email/i);
            const passwordInput = screen.getByLabelText(/password/i);
            const surnameInput = screen.getByLabelText(/surname/i);
            const nameInput = screen.getByLabelText('Name:');
            const registerButton = screen.getByRole('button', { name: /sign up/i });

            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.change(surnameInput, { target: { value: 'Doe' } });
            fireEvent.change(nameInput, { target: { value: 'John' } });
            fireEvent.click(registerButton);

            await waitFor(() => {
                expect(axios.post).toHaveBeenCalledTimes(1);
                expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:5000/user',
                {
                    email: 'test@example.com',
                    password: 'password123',
                    first_name: 'John',
                    last_name: 'Doe',
                },
                {
                    headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    },
                }
                );
            });

            expect(mockedUsedNavigate).toBeCalled();
            mockedUsedNavigate.mockRestore();

            expect(res).toBe('Success!');

            window.alert = jsdomAlert;
        });

        test('wrong data should get error', async () => {
            const errorMessage = 'Error registering user';
            axios.post.mockRejectedValueOnce({
                response: { data: { error: { message: errorMessage } } },
            });

            let res;
            const jsdomAlert = window.alert;
            window.alert = (x) => { res = x };

            await act(async () => {
                render(<Register />, { wrapper: MemoryRouter });
            });

            const emailInput = screen.getByLabelText(/email/i);
            const passwordInput = screen.getByLabelText(/password/i);
            const surnameInput = screen.getByLabelText(/surname/i);
            const nameInput = screen.getByLabelText('Name:');
            const registerButton = screen.getByRole('button', { name: /sign up/i });

            fireEvent.change(emailInput, { target: { value: 'testexample.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.change(surnameInput, { target: { value: 'Doe' } });
            fireEvent.change(nameInput, { target: { value: 'John' } });
            fireEvent.click(registerButton);

            await waitFor(() => {
                expect(axios.post).toHaveBeenCalledTimes(1);
                expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:5000/user',
                {
                    email: 'testexample.com',
                    password: 'password123',
                    first_name: 'John',
                    last_name: 'Doe',
                },
                {
                    headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    },
                }
                );
            });

            expect(res).toBe(errorMessage);

            window.alert = jsdomAlert;
        });
    });
});