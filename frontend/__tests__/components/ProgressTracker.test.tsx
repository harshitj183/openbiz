import { render, screen } from '@testing-library/react';
import { ProgressTracker } from '@/components/ProgressTracker';

describe('ProgressTracker', () => {
  it('renders both steps and highlights current step', () => {
    render(<ProgressTracker currentStep={1} />);

    expect(screen.getByText('Aadhaar & OTP')).toBeInTheDocument();
    expect(screen.getByText('Business Details')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('displays completion indicator on second step', () => {
    render(<ProgressTracker currentStep={2} />);

    expect(screen.getByText('✓')).toBeInTheDocument();
    expect(screen.getByText('Business Details')).toBeInTheDocument();
  });
});
