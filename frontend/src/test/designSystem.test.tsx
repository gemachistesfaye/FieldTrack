import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../components/common/Button';
import { StatCard } from '../components/common/StatCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { CategoryBadge } from '../components/common/CategoryBadge';
import { SearchBar } from '../components/common/SearchBar';
import { EmptyState } from '../components/common/EmptyState';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { RoleSelectionCard } from '../components/common/RoleSelectionCard';
import { LocationCard } from '../components/common/LocationCard';
import { Stepper } from '../components/common/Stepper';
import { CategoryGrid } from '../components/common/CategoryGrid';
import { TechnicianProfileCard } from '../components/common/TechnicianProfileCard';
import { LiveDispatchTrackingCard } from '../components/common/LiveDispatchTrackingCard';
import { BrowserRouter } from 'react-router-dom';
import { CheckCircle2, ClipboardList } from 'lucide-react';

describe('Design System: Button Component', () => {
  it('renders correctly with default primary variant', () => {
    render(<Button>Submit Incident</Button>);
    const btn = screen.getByRole('button', { name: /submit incident/i });
    expect(btn).toBeInTheDocument();
  });

  it('handles click events when enabled', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const btn = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders disabled state and does not trigger click events', () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled Button
      </Button>
    );
    const btn = screen.getByRole('button', { name: /disabled button/i });
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders loading state with spinner and disabled behavior', () => {
    render(<Button isLoading>Saving Changes</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(screen.getByText(/saving changes/i)).toBeInTheDocument();
  });

  it('renders different visual variants correctly', () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-teal-600');

    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-rose-600');

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole('button')).toHaveClass('border-slate-200/80');
  });
});

describe('Design System: StatCard Component', () => {
  it('renders KPI metrics, titles, and icons cleanly', () => {
    render(
      <StatCard
        title="Resolved Reports"
        value={42}
        icon={CheckCircle2}
        color="emerald"
        subtitle="Across all districts"
        trend={{ isPositive: true, value: '+15%' }}
      />
    );

    expect(screen.getByText('Resolved Reports')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('Across all districts')).toBeInTheDocument();
    expect(screen.getByText('+15%')).toBeInTheDocument();
  });
});

describe('Design System: StatusBadge Component', () => {
  it('renders all workflow status states with accurate labels', () => {
    const statuses = [
      'DRAFT',
      'SUBMITTED',
      'ASSIGNED',
      'IN_PROGRESS',
      'RESOLVED',
      'REJECTED',
    ] as const;

    const { rerender } = render(<StatusBadge status="DRAFT" />);
    expect(screen.getByText(/draft/i)).toBeInTheDocument();

    for (const status of statuses) {
      rerender(<StatusBadge status={status} />);
      const formatted = status.replace('_', ' ');
      expect(screen.getByText(new RegExp(formatted, 'i'))).toBeInTheDocument();
    }
  });
});

describe('Design System: PriorityBadge Component', () => {
  it('renders priority severities correctly', () => {
    const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;

    const { rerender } = render(<PriorityBadge priority="LOW" />);
    expect(screen.getByText(/low/i)).toBeInTheDocument();

    for (const priority of priorities) {
      rerender(<PriorityBadge priority={priority} />);
      expect(screen.getByText(new RegExp(priority, 'i'))).toBeInTheDocument();
    }
  });
});

describe('Design System: CategoryBadge Component', () => {
  it('renders infrastructure categories with icon and text', () => {
    render(<CategoryBadge category="WATER" />);
    expect(screen.getByText(/water/i)).toBeInTheDocument();
  });
});

describe('Design System: SearchBar Component', () => {
  it('handles value changes and clear actions', () => {
    const handleSearch = vi.fn();
    const handleClear = vi.fn();

    render(
      <SearchBar
        value="Pump failure"
        onChange={handleSearch}
        onClear={handleClear}
        placeholder="Filter records..."
      />
    );

    const input = screen.getByPlaceholderText('Filter records...');
    expect(input).toHaveValue('Pump failure');

    const clearBtn = screen.getByRole('button');
    fireEvent.click(clearBtn);
    expect(handleClear).toHaveBeenCalledTimes(1);
  });
});

describe('Design System: EmptyState Component', () => {
  it('renders title, description, and primary CTA', () => {
    const handleAction = vi.fn();
    render(
      <EmptyState
        icon={ClipboardList}
        title="No Reports Found"
        description="There are currently no reports assigned to your sector."
        actionLabel="Create Report"
        onAction={handleAction}
      />
    );

    expect(screen.getByText('No Reports Found')).toBeInTheDocument();
    expect(
      screen.getByText('There are currently no reports assigned to your sector.')
    ).toBeInTheDocument();

    const actionBtn = screen.getByRole('button', { name: /create report/i });
    fireEvent.click(actionBtn);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });
});

describe('Design System: Breadcrumbs Component', () => {
  it('renders breadcrumb navigation items and current location', () => {
    render(
      <BrowserRouter>
        <Breadcrumbs
          items={[
            { label: 'Reports', href: '/reports' },
            { label: 'Incident #108' },
          ]}
        />
      </BrowserRouter>
    );

    expect(screen.getByTitle('Dashboard Overview')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
    expect(screen.getByText('Incident #108')).toBeInTheDocument();
  });
});

describe('Design System: UX Reference (6030449798499995438_121.jpg)', () => {
  it('renders RoleSelectionCard (Screen 2 pattern) with radio selection', () => {
    const handleSelect = vi.fn();
    render(
      <RoleSelectionCard
        id="worker"
        title="Field Technician"
        description="Offline reporting and repair execution"
        icon={ClipboardList}
        selected={true}
        onSelect={handleSelect}
      />
    );

    expect(screen.getByText('Field Technician')).toBeInTheDocument();
    expect(screen.getByText('Offline reporting and repair execution')).toBeInTheDocument();
    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('aria-checked', 'true');

    fireEvent.click(radio);
    expect(handleSelect).toHaveBeenCalledWith('worker');
  });

  it('renders LocationCard (Screen 3 pattern) with GPS tag triggers', () => {
    const handleAllow = vi.fn();
    const handleManual = vi.fn();
    render(
      <LocationCard
        locationName="Sector 4 Borehole"
        coordinates={{ latitude: -1.286389, longitude: 36.817223 }}
        onAllowLocation={handleAllow}
        onManualLocation={handleManual}
      />
    );

    expect(screen.getByText('Tag Incident Location')).toBeInTheDocument();
    expect(screen.getByText('Sector 4 Borehole')).toBeInTheDocument();
    expect(screen.getByText(/-1.2864, 36.8172/)).toBeInTheDocument();

    const allowBtn = screen.getByRole('button', { name: /allow location/i });
    fireEvent.click(allowBtn);
    expect(handleAllow).toHaveBeenCalledTimes(1);

    const manualBtn = screen.getByRole('button', { name: /choose location manually/i });
    fireEvent.click(manualBtn);
    expect(handleManual).toHaveBeenCalledTimes(1);
  });
});

describe('Design System: Heavy Ops UX Reference (6030449798499995434_121.jpg)', () => {
  it('renders Stepper (Screen 5 pattern) with active step highlight', () => {
    const handleStepClick = vi.fn();
    render(
      <Stepper
        steps={[
          { id: 1, label: 'Date & Time' },
          { id: 2, label: 'Details' },
          { id: 3, label: 'Payment' },
        ]}
        currentStep={1}
        onStepClick={handleStepClick}
      />
    );

    expect(screen.getByText('Date & Time')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
    expect(screen.getByText('Payment')).toBeInTheDocument();
  });

  it('renders CategoryGrid (Screen 2 pattern) with selectable categories', () => {
    const handleSelectCategory = vi.fn();
    render(
      <CategoryGrid
        selectedCategory="WATER"
        onSelectCategory={handleSelectCategory}
      />
    );

    expect(screen.getByText('Water Point')).toBeInTheDocument();
    expect(screen.getByText('Machinery')).toBeInTheDocument();
    expect(screen.getByText('Electrical')).toBeInTheDocument();

    const machineryBtn = screen.getByText('Machinery').closest('button');
    expect(machineryBtn).toBeInTheDocument();
    if (machineryBtn) fireEvent.click(machineryBtn);
    expect(handleSelectCategory).toHaveBeenCalledWith('EQUIPMENT');
  });

  it('renders TechnicianProfileCard (Screen 7 pattern) with 3-stat metric bar', () => {
    const handleLogout = vi.fn();
    render(
      <TechnicianProfileCard
        fullName="Ahmed Hassan"
        role="Field Specialist"
        email="ahmed.hassan@fieldsync.local"
        stats={{
          totalReports: 12,
          activeTasks: 8,
          syncReliability: '99.8%',
        }}
        onLogout={handleLogout}
      />
    );

    expect(screen.getByText('Ahmed Hassan')).toBeInTheDocument();
    expect(screen.getByText('Field Specialist')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('99.8%')).toBeInTheDocument();
    expect(screen.getByText('My Incident Reports')).toBeInTheDocument();

    const logoutBtn = screen.getByRole('button', { name: /log out/i });
    fireEvent.click(logoutBtn);
    expect(handleLogout).toHaveBeenCalledTimes(1);
  });

  it('renders LiveDispatchTrackingCard (Screen 8 pattern) with route and technician box', () => {
    const handleTrackLive = vi.fn();
    render(
      <LiveDispatchTrackingCard
        reportTitle="CAT 320D Excavator Pump Repair"
        category="EQUIPMENT"
        status="On the way"
        destinationName="Kibera Sector 3"
        technician={{
          name: 'Mohamed Ahmed',
          role: 'Field Specialist',
          rating: '4.9',
        }}
        timeline={{
          reportedAt: '08:00 AM',
          dispatchedAt: '08:30 AM',
          estimatedArrival: '10:30 AM',
        }}
        onTrackLive={handleTrackLive}
      />
    );

    expect(screen.getByText('CAT 320D Excavator Pump Repair')).toBeInTheDocument();
    expect(screen.getByText('On the way')).toBeInTheDocument();
    expect(screen.getByText('Kibera Sector 3')).toBeInTheDocument();
    expect(screen.getByText('Mohamed Ahmed')).toBeInTheDocument();
    expect(screen.getByText('★ 4.9')).toBeInTheDocument();
    expect(screen.getByText('Track Live on Field Map')).toBeInTheDocument();

    const trackBtn = screen.getByRole('button', { name: /track live on field map/i });
    fireEvent.click(trackBtn);
    expect(handleTrackLive).toHaveBeenCalledTimes(1);
  });
});
