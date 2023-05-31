import React from 'react';
import { render, screen } from '@testing-library/react';
import Users from '../components/Users/Users';

jest.mock('../components/GetUsers/GetUsers', () => () => <div>Users</div>);

describe('User', () => {
  test('opening users page should see users component', () => {
    render(<Users />);

    expect(screen.queryByText('Users')).toBeInTheDocument();
  });
});