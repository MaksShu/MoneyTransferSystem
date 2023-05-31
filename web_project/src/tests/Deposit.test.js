import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Deposit from '../components/Deposit/Deposit';

jest.mock('axios');

describe('User', () => {
  beforeEach(() => {
    sessionStorage.clear();
    sessionStorage.setItem('CurrentWallet', '1');
    sessionStorage.setItem('JWT', 'Some token');

    axios.put.mockReset();
  });

  describe('opening deposit page ', () => {
    test('should see the deposit component with wallet ID displayed', () => {
      render(<Deposit />, { wrapper: MemoryRouter });

      const walletIdInput = screen.getByDisplayValue('1');
      expect(walletIdInput).toBeInTheDocument();
    });

    test('without chosing a wallet should trigger error message "You haven`t chosen a wallet!"', () => {
      sessionStorage.clear();

      waitFor(() => {
          render(<Deposit />, { wrapper: MemoryRouter });
      });

      const errorMessage = screen.getByText(/You haven`t chosen a wallet!/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test('submiting deposit form should trigger successfull deposit request', async () => {
    const mockAmount = '100';

    axios.put.mockResolvedValueOnce({});

    let res;
    const jsdomAlert = window.alert;
    window.alert = (x) => { res = x };

    render(<Deposit />, { wrapper: MemoryRouter });

    const amountInput = screen.getByLabelText(/amount/i);
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    fireEvent.change(amountInput, { target: { value: mockAmount } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        'http://localhost:5000/wallet/1/deposit',
        { funds: mockAmount },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            Authorization: `Bearer Some token`,
          },
        }
      );
    });

    expect(res).toBe('Success!');

    window.alert = jsdomAlert;
  });

  test('should see error message if deposit request fails', async () => {
    const mockErrorMessage = 'Deposit failed';

    axios.put.mockRejectedValueOnce({
      response: {
        data: {
          error: {
            message: mockErrorMessage,
          },
        },
      },
    });

    let res;
    const jsdomAlert = window.alert;
    window.alert = (x) => { res = x };

    render(<Deposit />, { wrapper: MemoryRouter });

    const amountInput = screen.getByLabelText(/Amount:/i);
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    fireEvent.change(amountInput, { target: { value: '100' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
        expect(res).toBe(mockErrorMessage);
    });
    
    window.alert = jsdomAlert;
  });
});