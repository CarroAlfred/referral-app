import { render, screen, fireEvent } from '@testing-library/react';
import { ReferralForm } from './referral-form';

const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
const mockOnCancel = jest.fn();

describe('ReferralForm', () => {
  it('renders all required fields', () => {
    render(
      <ReferralForm
        mode='create'
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />,
    );

    const givenNameLabel = screen.getByText(/Given Name/i);
    const givenNameInput = givenNameLabel.nextElementSibling as HTMLInputElement;
    expect(givenNameInput).toBeInTheDocument();

    const surnameLabel = screen.getByText(/Surname/i);
    const surnameInput = surnameLabel.nextElementSibling as HTMLInputElement;
    expect(surnameInput).toBeInTheDocument();

    const emailLabel = screen.getByText(/Email/i);
    const emailInput = emailLabel.nextElementSibling as HTMLInputElement;
    expect(emailInput).toBeInTheDocument();

    const phoneLabel = screen.getByText(/Phone/i);
    const phoneInput = phoneLabel.nextElementSibling as HTMLInputElement;
    expect(phoneInput).toBeInTheDocument();

    const homeLabel = screen.getByText(/Home Name\/Number/i);
    const homeInput = homeLabel.nextElementSibling as HTMLInputElement;
    expect(homeInput).toBeInTheDocument();

    const streetLabel = screen.getByText(/Street/i);
    const streetInput = streetLabel.nextElementSibling as HTMLInputElement;
    expect(streetInput).toBeInTheDocument();

    const suburbLabel = screen.getByText(/Suburb/i);
    const suburbInput = suburbLabel.nextElementSibling as HTMLInputElement;
    expect(suburbInput).toBeInTheDocument();

    const stateLabel = screen.getByText(/State/i);
    const stateInput = stateLabel.nextElementSibling as HTMLInputElement;
    expect(stateInput).toBeInTheDocument();

    const postcodeLabel = screen.getByText(/Postcode/i);
    const postcodeInput = postcodeLabel.nextElementSibling as HTMLInputElement;
    expect(postcodeInput).toBeInTheDocument();

    const countryLabel = screen.getByText(/Country/i);
    const countryInput = countryLabel.nextElementSibling as HTMLInputElement;
    expect(countryInput).toBeInTheDocument();

    // Dropdown
    const statusLabel = screen.getByText(/Status/i);
    const statusDropdown = statusLabel.nextElementSibling as HTMLElement;
    expect(statusDropdown).toBeInTheDocument();

    const notesLabel = screen.getByText(/Notes/i);
    const notesInput = notesLabel.nextElementSibling as HTMLTextAreaElement;
    expect(notesInput).toBeInTheDocument();

    const referredByLabel = screen.getByText(/Referred By/i);
    const referredByInput = referredByLabel.nextElementSibling as HTMLInputElement;
    expect(referredByInput).toBeInTheDocument();
  });

  it('calls onCancel when Cancel is clicked', () => {
    render(
      <ReferralForm
        mode='create'
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />,
    );
    fireEvent.click(screen.getByText(/Cancel/i));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('shows loader when isSubmitting is true', () => {
    render(
      <ReferralForm
        mode='create'
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isSubmitting
      />,
    );
  });
});
