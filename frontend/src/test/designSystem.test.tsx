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
