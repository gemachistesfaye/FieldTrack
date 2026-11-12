import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('FieldSync Application Shell', () => {
  it('renders FieldSync branding and navigation', () => {
    render(<App />);

    // Brand name appears in sidebar and headers
    expect(screen.getAllByText('FieldSync').length).toBeGreaterThan(0);
    expect(screen.getByText('Field Operations Command')).toBeInTheDocument();
  });

  it('renders network status indicator', () => {
    render(<App />);

    const networkIndicator = screen.getByTestId('network-status');
    expect(networkIndicator).toBeInTheDocument();
  });

  it('renders dashboard metrics and incident report stream', () => {
    render(<App />);

    expect(screen.getByText('FieldSync Management Command')).toBeInTheDocument();
    expect(screen.getByText('Total Incident Reports')).toBeInTheDocument();
    expect(screen.getByText('Pending Local Sync')).toBeInTheDocument();
    expect(screen.getByText('Recent Field Incidents')).toBeInTheDocument();
  });
});
