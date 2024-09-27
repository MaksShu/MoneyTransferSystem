import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Transfers from '../components/Transfers/Transfers'

jest.mock('../components/GetTransfers/GetTransfers', () => () => <div>Transfers</div>);

describe('User', () => {

    test('opening transfers page should see transfers component', () => {
        render(<Transfers />);

        expect(screen.queryByText('Transfers')).toBeInTheDocument();
    });
});