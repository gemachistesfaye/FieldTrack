import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { User } from '../types/auth';

const mockCoordinatorUser: User = {
  id: 'mock-coordinator-id-123',
  fullName: 'Marcus Vance',
  email: 'marcus.vance@fieldsync.local',
  role: 'COORDINATOR',
  isActive: true,
};

describe('FieldSync Application Shell', () => {
  it('renders FieldSync branding and navigation when authenticated', () => {
    render(<App initialUser={mockCoordinatorUser} />);

    // Brand name appears in sidebar and headers
    expect(screen.getAllByText('FieldSync').length).toBeGreaterThan(0);
    expect(screen.getByText('Field Operations Command')).toBeInTheDocument();
  });

  it('renders network status indicator', () => {
    render(<App initialUser={mockCoordinatorUser} />);

    const networkIndicator = screen.getByTestId('network-status');
    expect(networkIndicator).toBeInTheDocument();
  });

  it('renders dashboard metrics and incident report stream', () => {
    render(<App initialUser={mockCoordinatorUser} />);

    expect(screen.getByText('FieldSync Management Command')).toBeInTheDocument();
    expect(screen.getByText('Total Incident Reports')).toBeInTheDocument();
    expect(screen.getByText('Pending Local Sync')).toBeInTheDocument();
    expect(screen.getByText('Recent Field Incidents')).toBeInTheDocument();
  });

  it('renders login portal and quick demo pills when unauthenticated', () => {
    render(<App initialUser={null} />);

    // Unauthenticated user is protected and sees the Login page
    expect(screen.getAllByText(/Sign in to FieldSync/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Quick Demo Logins/i)).toBeInTheDocument();
    expect(screen.getByText(/👑 Admin/i)).toBeInTheDocument();
    expect(screen.getByText(/🛡️ Coordinator/i)).toBeInTheDocument();
    expect(screen.getByText(/👷 Worker/i)).toBeInTheDocument();
  });
});
