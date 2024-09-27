import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from '../components/Header/Header';

describe('user', () => {
  test('opening page should see the header component with navigation links and user icon', () => {
    render(
      <Router>
        <Header />
      </Router>
    );

    const walletsLink = screen.getByRole('link', { name: /wallets/i });
    const usersLink = screen.getByRole('link', { name: /users/i });
    expect(walletsLink).toBeInTheDocument();
    expect(usersLink).toBeInTheDocument();

    const userIcon = screen.getByAltText('User icon');
    expect(userIcon).toBeInTheDocument();
  });
});