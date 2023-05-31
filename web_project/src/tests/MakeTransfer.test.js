import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MakeTransfer from '../components/MakeTransfer/MakeTransfer';

jest.mock('axios');

describe('User', () => {
    beforeEach(() => {
        sessionStorage.clear();
        sessionStorage.setItem('CurrentWallet', '1');

        axios.post.mockReset();
    });

    describe('opening make transfer page', () => {
        test('should see the transfer form', () => {
            render(<MakeTransfer />, { wrapper: MemoryRouter });

            expect(screen.getByText(/Reciever wallet:/i)).toBeInTheDocument();
            expect(screen.getByText(/Sender wallet:/i)).toBeInTheDocument();
            expect(screen.getByText(/Amount:/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
        });

        test('without chosing a wallet should see error message "You haven`t chosen a wallet!"', () => {
            sessionStorage.clear();
        
            waitFor(() => {
                render(<MakeTransfer />, { wrapper: MemoryRouter });
            });
        
            const errorMessage = screen.getByText(/You haven`t chosen a wallet!/i);
            expect(errorMessage).toBeInTheDocument();
        });
    });

    test('changing receiver and amount should trigger value changes', () => {
        render(<MakeTransfer />, { wrapper: MemoryRouter });

        const receiverInput = screen.getByLabelText('Reciever wallet:');
        const amountInput = screen.getByLabelText('Amount:');

        fireEvent.change(receiverInput, { target: { value: '12345' } });
        fireEvent.change(amountInput, { target: { value: '100' } });

        expect(receiverInput.value).toBe('12345');
        expect(amountInput.value).toBe('100');
    });

    test('submiting the make transfer form with correct data should trigger make transfer request', async () => {
        const jsdomAlert = window.alert;

        let res;
        window.alert = (x) => { res = x };

        axios.post.mockResolvedValueOnce({});

        render(<MakeTransfer />, { wrapper: MemoryRouter });

        const receiverInput = screen.getByLabelText('Reciever wallet:');
        const amountInput = screen.getByLabelText('Amount:');
        const submitButton = screen.getByText('Submit');

        fireEvent.change(receiverInput, { target: { value: '12345' } });
        fireEvent.change(amountInput, { target: { value: '100' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:5000/wallet/make-transfer',
                { from_wallet_id: '1', to_wallet_id: '12345', amount: '100' },
                expect.any(Object)
            );
        });

        expect(res).not.toBe(undefined);

        window.alert = jsdomAlert;
    });

    test('should see error message on transfer failure', async () => {
        let res;
        const jsdomAlert = window.alert;
        window.alert = jest.fn((x) => { res = x });

        axios.post.mockRejectedValueOnce({ response: { data: { error: { message: 'Transfer failed' } } } });

        await act(async () => {
            render(<MakeTransfer />, { wrapper: MemoryRouter });
        });

        const submitButton = screen.getByText('Submit');
        
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:5000/wallet/make-transfer',
                { from_wallet_id: "1", to_wallet_id: '', amount: '' },
                expect.any(Object)
            );       
        }); 

        expect(res).toBe('Transfer failed');
        window.alert = jsdomAlert;
    });
});