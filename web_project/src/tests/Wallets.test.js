import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Wallets from '../components/Wallets/Wallets';
import axios from 'axios';

jest.mock('../components/GetWallets/GetWallets', () => () => <div>Wallets</div>);
jest.mock('axios');

describe('User', () => {
    beforeEach(() => {
        axios.post.mockReset();

        sessionStorage.clear();
        sessionStorage.setItem('JWT', 'Some token');
    });

    test('opening wallets page should see wallets component', () => {
        render(<Wallets />);

        expect(screen.queryByText('Wallets')).toBeInTheDocument();
    });

    test('clicking on add button should trigger creation of a new wallet', async () => {
        axios.post.mockResolvedValueOnce({ data: { message: 'Success1234!' } });

        let res;
        const jsdomAlert = window.alert;
        window.alert = (x) => { res = x };

        await act(() => {
            render(<Wallets />);
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

        expect(res).toBe('Success1234!');

        window.alert = jsdomAlert;
    });

    test('should see error when creating a new wallet fails', async () => {
        axios.post.mockRejectedValueOnce({ response: { error: { message: 'Error creating wallet' } } });

        let res;
        const jsdomAlert = window.alert;
        window.alert = (x) => { res = x };
        
        render(<Wallets />);
        
        const addButton = screen.getByAltText('add button');
        fireEvent.click(addButton);
        
        await waitFor(() => {
            expect(res).toBe('Error creating wallet');
        });

        window.alert = jsdomAlert;
    });
});