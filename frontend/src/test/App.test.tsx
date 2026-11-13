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

const mockWorkerUser: User = {
  id: 'mock-worker-id-456',
  fullName: 'Amina Osei',
  email: 'amina.osei@fieldsync.local',
  role: 'FIELD_WORKER',
  isActive: true,
};

const mockAdminUser: User = {
  id: 'mock-admin-id-789',
  fullName: 'Sarah Jenkins',
  email: 'sarah.jenkins@fieldsync.local',
  role: 'ADMIN',
  isActive: true,
};

describe('FieldSync Application Shell & Role Dashboards', () => {
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

  it('renders Coordinator dashboard with dispatch command for coordinator role', () => {
    render(<App initialUser={mockCoordinatorUser} />);

    expect(
      screen.getByText(/Field Operations Triage — Marcus Vance/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Regional Dispatch & Triage Command/i)).toBeInTheDocument();
  });

  it('renders Field Worker dashboard with offline command for worker role', () => {
    render(<App initialUser={mockWorkerUser} />);

    expect(
      screen.getByText(/Welcome back, Amina Osei/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Field Technician Command/i)).toBeInTheDocument();
    expect(screen.getByText(/Network Status/i)).toBeInTheDocument();
  });

  it('renders Admin dashboard with system governance console for admin role', () => {
    render(<App initialUser={mockAdminUser} />);

    expect(
      screen.getByText(/System Administration Console — Sarah Jenkins/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Full Audit & Governance Authority/i)).toBeInTheDocument();
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
