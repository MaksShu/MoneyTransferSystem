import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import GetWallets from '../components/GetWallets/GetWallets';
import { MemoryRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

jest.mock('axios');

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom')),
    useNavigate: () => mockedUsedNavigate,
}))

describe('User', () => {
    beforeEach(() => {
        axios.get.mockReset();
        axios.delete.mockReset();
        sessionStorage.clear();
        toast.dismiss();
    });

    test('opening wallet page when wallets are being fetched should see loading message', async () => {
        axios.get.mockResolvedValue(null);
        sessionStorage.setItem('CurrentWallet', 1);

        let loadingMessage;

    
        act(() => {
            render(<GetWallets refresh='1'/>, { wrapper: MemoryRouter });         
        });
        loadingMessage = screen.getByText('Loading...');
        

        expect(loadingMessage).toBeInTheDocument();
    });

    test('sees error message when fetching wallets fails', async () => {
        const mockErrorResponse = {
            response: {
                data: {
                    msg: 'Error fetching wallets',
                },
            },
        };

        axios.get.mockRejectedValue(mockErrorResponse);
        sessionStorage.setItem('JWT', 'mock-jwt-token');

        await act(() => {
            render(<GetWallets refresh='1'/>, { wrapper: MemoryRouter });
        });

        await waitFor(() => {
            const errorMessage = screen.getByText('Error: Error fetching wallets');
            expect(errorMessage).toBeInTheDocument();
        });
    });

    test('should see wallets with their funds and buttons if wallets are available', async () => {
        const mockWalletsResponse = {
            status: 200,
            data: {
                Wallets: [
                    {
                        id: 1,
                        funds: 100,
                    },
                    {
                        id: 2,
                        funds: 200,
                    },
                ],
            },
        };

        axios.get.mockResolvedValue(mockWalletsResponse);
        sessionStorage.setItem('JWT', 'mock-jwt-token');

        await waitFor(() => {
            act(() => {
                render(<GetWallets refresh='1'/>, { wrapper: MemoryRouter });
            });
        }); 

        await waitFor(() => {
            const walletItems = screen.getAllByRole('listitem');
            expect(walletItems).toHaveLength(2);
            expect(screen.getByText('#1')).toBeInTheDocument();
            expect(screen.getByText('#2')).toBeInTheDocument();
            expect(screen.getByText('$1')).toBeInTheDocument();
            expect(screen.getByText('$2')).toBeInTheDocument();
        });
    });

    describe('should be redirected to', () => {
        test('main page when JWT is not set', async () => {
            sessionStorage.removeItem('JWT');
            axios.get.mockResolvedValue(null);

            await waitFor(() => {
                render(<div><ToastContainer /><GetWallets refresh='1'/></div>, { wrapper: MemoryRouter });
            });

            expect(mockedUsedNavigate).toBeCalled;
            mockedUsedNavigate.mockReset();
        });

        test('transfers page when transfers button is clicked', async () => {
            const mockWalletsResponse = {
                status: 200,
                data: {
                    Wallets: [
                        {
                            id: 1,
                            funds: 100,
                        },
                    ],
                },
            };

            axios.get.mockResolvedValue(mockWalletsResponse);
            sessionStorage.setItem('JWT', 'mock-jwt-token');

            await waitFor(() => {
                act(() => {
                    render(<GetWallets refresh='1'/>, { wrapper: MemoryRouter });
                });
            }); 

            await waitFor(() => {
                const transfersButton = screen.getByRole('transfers');
                expect(transfersButton).toBeInTheDocument();
                act(() => {
                    transfersButton.click();
                });
                
            });

            expect(mockedUsedNavigate).toBeCalled;
            mockedUsedNavigate.mockReset();

            expect(sessionStorage.getItem('CurrentWallet')).toBe('1');
        });

        test('deposit page when deposit button is clicked', async () => {
            const mockWalletsResponse = {
                status: 200,
                data: {
                    Wallets: [
                        {
                            id: 1,
                            funds: 100,
                        },
                    ],
                },
            };

            axios.get.mockResolvedValue(mockWalletsResponse);
            sessionStorage.setItem('JWT', 'mock-jwt-token');

            await waitFor(() => {
                act(() => {
                    render(<GetWallets refresh='1'/>, { wrapper: MemoryRouter });
                });
            });

            await waitFor(() => {
                const transfersButton = screen.getByText('Deposit');
                expect(transfersButton).toBeInTheDocument();
                act(() => {
                    transfersButton.click();
                });
                
            });

            expect(mockedUsedNavigate).toBeCalled;
            mockedUsedNavigate.mockReset();

            expect(sessionStorage.getItem('CurrentWallet')).toBe('1');
        });

        test('make transfer page when make transfer button is clicked', async () => {
            const mockWalletsResponse = {
                status: 200,
                data: {
                    Wallets: [
                        {
                            id: 1,
                            funds: 100,
                        },
                    ],
                },
            };

            axios.get.mockResolvedValue(mockWalletsResponse);
            sessionStorage.setItem('JWT', 'mock-jwt-token');

            await waitFor(() => {
                act(() => {
                    render(<GetWallets refresh='1'/>, { wrapper: MemoryRouter });
                });
            });

            await waitFor(() => {
                const transfersButton = screen.getByText('Make transfer');
                expect(transfersButton).toBeInTheDocument();
                act(() => {
                    transfersButton.click();
                });
            });

            expect(mockedUsedNavigate).toBeCalled;
            mockedUsedNavigate.mockReset();

            expect(sessionStorage.getItem('CurrentWallet')).toBe('1');
        });
    });
});