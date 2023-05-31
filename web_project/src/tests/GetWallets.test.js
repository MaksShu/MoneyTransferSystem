import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import GetWallets from '../components/GetWallets/GetWallets';
import { MemoryRouter } from 'react-router-dom';

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
    });

    test('opening wallet page when wallets are being fetched should see loading message', async () => {
        axios.get.mockResolvedValueOnce(null);
        sessionStorage.setItem('CurrentWallet', 1);

        let loadingMessage;

        await waitFor(() => {
            act(() => {
                render(<GetWallets />, { wrapper: MemoryRouter });         
            });
            loadingMessage = screen.getByText('Loading...');
        }); 

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

        axios.get.mockRejectedValueOnce(mockErrorResponse);
        sessionStorage.setItem('JWT', 'mock-jwt-token');

        await act(() => {
            render(<GetWallets />, { wrapper: MemoryRouter });
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

        axios.get.mockResolvedValueOnce(mockWalletsResponse);
        sessionStorage.setItem('JWT', 'mock-jwt-token');

        await waitFor(() => {
            act(() => {
                render(<GetWallets />, { wrapper: MemoryRouter });
            });
        }); 

        await waitFor(() => {
            const walletItems = screen.getAllByRole('listitem');
            expect(walletItems).toHaveLength(2);
            expect(screen.getByText('#1')).toBeInTheDocument();
            expect(screen.getByText('#2')).toBeInTheDocument();
            expect(screen.getByText('$100')).toBeInTheDocument();
            expect(screen.getByText('$200')).toBeInTheDocument();
        });
    });

    describe('should be redirected to', () => {
        test('login page when JWT is not set', async () => {
            sessionStorage.removeItem('JWT');
            axios.get.mockResolvedValueOnce(null);

            await waitFor(() => {
                render(<GetWallets />, { wrapper: MemoryRouter });
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

            axios.get.mockResolvedValueOnce(mockWalletsResponse);
            sessionStorage.setItem('JWT', 'mock-jwt-token');

            await waitFor(() => {
                act(() => {
                    render(<GetWallets />, { wrapper: MemoryRouter });
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

            axios.get.mockResolvedValueOnce(mockWalletsResponse);
            sessionStorage.setItem('JWT', 'mock-jwt-token');

            await waitFor(() => {
                act(() => {
                    render(<GetWallets />, { wrapper: MemoryRouter });
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

            axios.get.mockResolvedValueOnce(mockWalletsResponse);
            sessionStorage.setItem('JWT', 'mock-jwt-token');

            await waitFor(() => {
                act(() => {
                    render(<GetWallets />, { wrapper: MemoryRouter });
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

    test('clicking delete button should trigger successful delete wallet request', async () => {
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

        const mockDeleteResponse = {
            status: 200,
        };

        axios.get.mockResolvedValueOnce(mockWalletsResponse);
        axios.delete.mockResolvedValueOnce(mockDeleteResponse);
        sessionStorage.setItem('JWT', 'mock-jwt-token');
        sessionStorage.setItem('CurrentWallet', '1');

        let res;
        const jsdomAlert = window.alert;
        window.alert = jest.fn((x) => { res = x });

        await waitFor(() => {
            act(() => {
                render(<GetWallets />, { wrapper: MemoryRouter });
            });
        });

        window.confirm = jest.fn().mockImplementation(() => true);
        
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { reload: jest.fn() },
        });

        let deleteButton;
        
        await waitFor(() => {
            deleteButton = screen.getByRole('delete');
            expect(deleteButton).toBeInTheDocument();
        });

        act(() => {
            deleteButton.click();
        });

        await waitFor(() => {
            expect(axios.delete).toHaveBeenCalledWith(
                'http://localhost:5000/wallet/1',
                expect.any(Object)
            );
        });

        expect(res).toBe('Success!');
        window.alert = jsdomAlert;
    });
});