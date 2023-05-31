import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Main from '../components/Main/Main';

describe('User', () => {
  describe('opening main page should see', () => {
    test('the welcome text', () => {
      render(<Main />, { wrapper: MemoryRouter });

      const welcomeText = screen.getByText('WELCOME TO MT Wallet System!');
      expect(welcomeText).toBeInTheDocument();
    });

    test('the login and register links', () => {
      render(<Main />, { wrapper: MemoryRouter });

      const loginLink = screen.getByRole('link', { name: 'Login' });
      const registerLink = screen.getByRole('link', { name: 'Register' });

      expect(loginLink).toBeInTheDocument();
      expect(registerLink).toBeInTheDocument();
    });
  });
  
  describe('should be redirected to the correct route when', () => {
    test('login link is clicked', () => {
      render(<Main />, { wrapper: MemoryRouter });

      const loginLink = screen.getByRole('link', { name: 'Login' });

      expect(loginLink).toHaveAttribute('href', '/login');
    });

    test('register link is clicked', () => {
      render(<Main />, { wrapper: MemoryRouter });

      const registerLink = screen.getByRole('link', { name: 'Register' });

      expect(registerLink).toHaveAttribute('href', '/register');
    });
  });
});