import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Chat from '../components/Chat/Chat'
import axios from 'axios';

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
        axios.get.mockReset();
    });

    describe('opening chat page', () => {
        test('should see chat and input', async () => {
            window.HTMLElement.prototype.scrollIntoView = function() {};
            axios.get.mockResolvedValueOnce({ data: userData });
            sessionStorage.setItem('JWT', 'Some token');

            await waitFor(() => {
                act(() => {
                    render(<Chat />);
                });
            });
            
            expect(screen.queryByText('Chat')).toBeInTheDocument();
        });
    });
});