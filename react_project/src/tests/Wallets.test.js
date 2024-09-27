import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Wallets from '../components/Wallets/Wallets';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

jest.mock('../components/GetWallets/GetWallets', () => () => <div>Wallets</div>);
jest.mock('axios');

describe('User', () => {
    beforeEach(() => {
        axios.post.mockReset();
        toast.dismiss();
        sessionStorage.clear();
        sessionStorage.setItem('JWT', 'Some token');
    });

    test('opening wallets page should see wallets component', () => {
        render(<Wallets />);

        expect(screen.queryByText('Wallets')).toBeInTheDocument();
    });

    test('clicking on add button should trigger creation of a new wallet', async () => {
        axios.post.mockResolvedValueOnce({ data: { message: 'Success1234!' } });

        await act(() => {
            render(<div><ToastContainer/><Wallets /></div>);
        });

        const addButton = screen.getByAltText('add button');
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(1);
            expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/wallet', { funds: 0 }, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer Some token',
                },
            });
        });

        expect(await screen.findByText('Successfuly created new wallet!')).toBeInTheDocument();
    });

    test('should see error when creating a new wallet fails', async () => {
        axios.post.mockRejectedValueOnce({ response: { error: { message: 'Error creating wallet' } } });
        
        await act(() => {
            render(<div><ToastContainer/><Wallets /></div>);
        });

        const addButton = screen.getByAltText('add button');
        fireEvent.click(addButton);
        
        expect(await screen.findByText('Error creating wallet')).toBeInTheDocument();
    });
});