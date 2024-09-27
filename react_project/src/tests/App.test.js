import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import App from '../App';


jest.mock('../components/Header/Header', () => () => <div>Header</div>);
jest.mock('../components/Footer/Footer', () => () => <div>Footer</div>);
jest.mock('../components/Main/Main', () => () => <div>Main</div>);
jest.mock('../components/Users/Users', () => () => <div>Users</div>);

describe('User', () => {
  test('opening main page should see header, main content, and footer', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Main')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  test('opening another page should see the correct component based on the route', () => {
    render(
      <MemoryRouter initialEntries={['/users']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.queryByText('Main')).toBeNull();
    expect(screen.queryByText('Users')).toBeInTheDocument();
  });

  test('opening wrong route should see the 404 page', () => {
    render(
      <MemoryRouter initialEntries={['/unknown']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.queryByText('Main')).toBeNull();
    expect(screen.queryByText('Users')).toBeNull();
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});
