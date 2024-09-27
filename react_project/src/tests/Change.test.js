import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Change from '../components/Change/Change';
import { ToastContainer, toast } from 'react-toastify';

jest.mock('axios');

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom')),
  useNavigate: () => mockedUsedNavigate,
}))

const userData = {
  id: 1,
  email: 'test@example.com',
  first_name: 'John',
  last_name: 'Doe',
};

describe('User', () => {
  beforeEach(() => {
    sessionStorage.clear();
    sessionStorage.setItem('JWT', 'some token');
    axios.put.mockReset();
    axios.get.mockReset();
    toast.dismiss();
    axios.get.mockResolvedValueOnce({ data: userData });
  });

  describe('opening change page', () => {
    describe('should see a change form', () => {
      test('with input fields', () => {

        waitFor(() => {
          render(<Change />, { wrapper: MemoryRouter });
        });

        expect(screen.getByText(/email/i)).toBeInTheDocument();
        expect(screen.getByText(/password/i)).toBeInTheDocument();
        expect(screen.getByText(/surname/i)).toBeInTheDocument();
        expect(screen.getByText('Name:')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
      });

      test('with current user data filled in input fields', async () => {
        await act(async () => {
          render(<Change />, { wrapper: MemoryRouter });
        });

        expect(screen.getByDisplayValue(userData.email)).toBeInTheDocument();
        expect(screen.getByDisplayValue('')).toBeInTheDocument();
        expect(screen.getByDisplayValue(userData.last_name)).toBeInTheDocument();
        expect(screen.getByDisplayValue(userData.first_name)).toBeInTheDocument();
      });
    });

    test('unlogged should be redirected to main page', async () => {
      sessionStorage.clear();

      await act(async () => {
        render(<Change />, { wrapper: MemoryRouter });
      });

      expect(mockedUsedNavigate).toBeCalled();
      mockedUsedNavigate.mockRestore();
    });
  });

  describe('submiting the change form', () => {
    test('should trigger successful change request', async () => {
      const userData = {
        id: 1,
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
      };
      const updatedUserData = {
        ...userData,
        email: 'newemail@example.com',
        last_name: 'Updated',
        first_name: 'New name',
        password: '11111111'
      };
      axios.put.mockResolvedValueOnce({});

      await act(async () => {
        render(<div><ToastContainer/><Change /></div>, { wrapper: MemoryRouter });
      });

      await waitFor(() => {
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: updatedUserData.email } });
        fireEvent.change(screen.getByLabelText(/surname/i), { target: { value: updatedUserData.last_name } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: updatedUserData.password } });
        fireEvent.change(screen.getByLabelText('Name:'), { target: { value: updatedUserData.first_name } });
      });


      fireEvent.submit(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(axios.put).toHaveBeenCalledTimes(1);
        expect(axios.put).toHaveBeenCalledWith(`http://localhost:5000/user/${userData.id}`, {
          email: updatedUserData.email,
          first_name: updatedUserData.first_name,
          last_name: updatedUserData.last_name,
          password: updatedUserData.password
        }, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            Authorization: `Bearer some token`,
          },
        });
      });
    });

    test('with wrong data should trigger error', async () => {
      const userData = {
        id: 1,
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
      };
      const updatedUserData = {
        ...userData,
        email: 'newemailexample.com',
        last_name: 'Updated',
        first_name: 'New name',
        password: '11111111'
      };
      const emailError = 'Wrong email data!';
      axios.put.mockRejectedValueOnce({ response: { data: { error: { message: emailError } } } });

      await act(async () => {
        render(<div><ToastContainer/><Change /></div>, { wrapper: MemoryRouter });
      });

      await waitFor(() => {
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: updatedUserData.email } });
        fireEvent.change(screen.getByLabelText(/surname/i), { target: { value: updatedUserData.last_name } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: updatedUserData.password } });
        fireEvent.change(screen.getByLabelText('Name:'), { target: { value: updatedUserData.first_name } });
      });

      fireEvent.submit(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(axios.put).toHaveBeenCalledTimes(1);
        expect(axios.put).toHaveBeenCalledWith(`http://localhost:5000/user/${userData.id}`, {
          email: updatedUserData.email,
          first_name: updatedUserData.first_name,
          last_name: updatedUserData.last_name,
          password: updatedUserData.password
        }, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            Authorization: `Bearer some token`,
          },
        });
      });

      expect(await screen.findByText(emailError)).toBeInTheDocument();
    });

    test('without password should trigger successful change request', async () => {
      const userData = {
        id: 1,
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
      };
      const updatedUserData = {
        ...userData,
        email: 'newemailexample.com',
        last_name: 'Updated',
        first_name: 'New name'
      };
      const emailError = 'Wrong email data!';
      axios.put.mockRejectedValueOnce({ response: { data: { error: { message: emailError } } } });

      await act(async () => {
        render(<div><ToastContainer/><Change /></div>, { wrapper: MemoryRouter });
      });

      await waitFor(() => {
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: updatedUserData.email } });
        fireEvent.change(screen.getByLabelText(/surname/i), { target: { value: updatedUserData.last_name } });
        fireEvent.change(screen.getByLabelText('Name:'), { target: { value: updatedUserData.first_name } });
      });

      fireEvent.submit(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(axios.put).toHaveBeenCalledTimes(1);
        expect(axios.put).toHaveBeenCalledWith(`http://localhost:5000/user/${userData.id}`, {
          email: updatedUserData.email,
          first_name: updatedUserData.first_name,
          last_name: updatedUserData.last_name
        }, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            Authorization: `Bearer some token`,
          },
        });
      });
    });
  });


});