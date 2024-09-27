import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import GetTransfers from '../components/GetTransfers/GetTransfers';


jest.mock('axios');

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom')),
    useNavigate: () => mockedUsedNavigate,
}));

describe('User', () => {
    beforeEach(() => {
        axios.get.mockReset();
        sessionStorage.clear();
    });

    describe('opening transfers page', () => {
        test('when transfers are being fetched should see loading message', async () => {
            sessionStorage.setItem('CurrentWallet', 1);

            axios.get.mockResolvedValueOnce(null);

            await waitFor(() => {
                act(() => {
                    render(<GetTransfers />, { wrapper: MemoryRouter });
                });   
            });
        
            const loadingMessage = screen.getByText('Loading...');
            expect(loadingMessage).toBeInTheDocument();
        });

        test('without choosing a wallet should see "You haven`t chosen a wallet!" message', () => {
            sessionStorage.setItem('JWT', 'mock-jwt-token');
            sessionStorage.removeItem('CurrentWallet');

            act(() => {
                render(<GetTransfers />, { wrapper: MemoryRouter });
            }); 

            const errorMessage = screen.getByText('You haven`t chosen a wallet!');
            expect(errorMessage).toBeInTheDocument();
        });
    });

    test('should see "No transfers found" message when no transfers are available', async () => {
        const mockTransfersResponse = {
            status: 200,
            data: {
                Transfers: [],
            },
        };

        axios.get.mockResolvedValueOnce(mockTransfersResponse);
        sessionStorage.setItem('JWT', 'mock-jwt-token');
        sessionStorage.setItem('CurrentWallet', 'mock-wallet-id');

        act(() => {
            render(<GetTransfers />, { wrapper: MemoryRouter });
        }); 

        await waitFor(() => {
            const noTransfersMessage = screen.getByText('No transfers found');
            expect(noTransfersMessage).toBeInTheDocument();
        });
    });

    test('should see transfers when transfers are available', async () => {
        const mockTransfersResponse = {
            status: 200,
            data: {
                Transfers: [
                    {
                        id: 1,
                        from_wallet_id: 'mock-from-wallet-id',
                        to_wallet_id: 'mock-to-wallet-id',
                        amount: 100,
                        datetime: '2023-05-23T12:34:56.789Z',
                    },
                    {
                        id: 2,
                        from_wallet_id: 'mock-from-wallet-id',
                        to_wallet_id: 'mock-to-wallet-id',
                        amount: 200,
                        datetime: '2023-05-24T09:15:00.000Z',
                    },
                ],
            },
        };

        axios.get.mockResolvedValueOnce(mockTransfersResponse);
        sessionStorage.setItem('JWT', 'mock-jwt-token');
        sessionStorage.setItem('CurrentWallet', 'mock-wallet-id');

        await waitFor(() => {
            act(() => {
                render(<GetTransfers />, { wrapper: MemoryRouter });
            }); 
        });

        await waitFor(() => {
            const transferItems = screen.getAllByRole('listitem');
            expect(transferItems).toHaveLength(2);
            expect(screen.getAllByText('#mock-from-wallet-id')).toHaveLength(2);
            expect(screen.getAllByText('#mock-to-wallet-id')).toHaveLength(2);
            expect(screen.getByText('$1')).toBeInTheDocument();
            expect(screen.getByText('$2')).toBeInTheDocument();
            expect(screen.getByText('2023-05-23 12:34:56')).toBeInTheDocument();
            expect(screen.getByText('2023-05-24 09:15:00')).toBeInTheDocument();
        });
    });

    test('should see error message when fetching transfers fails', async () => {
        const mockedError = 'Error fetching transfers';

        const mockErrorResponse = {
            response: {
                data: {
                    msg: mockedError,
                },
            },
        };

        axios.get.mockRejectedValueOnce(mockErrorResponse);
        sessionStorage.setItem('JWT', 'mock-jwt-token');
        sessionStorage.setItem('CurrentWallet', 'mock-wallet-id');

        await act(() => {
            waitFor(() => {
                render(<GetTransfers />, { wrapper: MemoryRouter });
            }); 
        });

        await waitFor(() => {
            let errorMessage;
            act(() => {
                errorMessage = screen.getByText('Error: '+mockedError);
                expect(errorMessage).toBeInTheDocument();
            });           
        });
    });
});