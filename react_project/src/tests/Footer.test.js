import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer/Footer';

describe('User', () => {
  test('opening page should see the footer component with the correct text', () => {
    render(<Footer />);

    const footerText = screen.getByText(/2023\. All rights reserved\./i);
    expect(footerText).toBeInTheDocument();
  });
});