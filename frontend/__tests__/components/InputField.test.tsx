import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InputField } from '@/components/InputField';
import { FormField } from '@/types';

describe('InputField Component', () => {
  const mockOnChange = jest.fn();
  const mockOnBlur = jest.fn();

  const textField: FormField = {
    id: 'aadhaar',
    name: 'AadhaarNo',
    label: 'Aadhaar Number',
    type: 'input',
    input_type: 'text',
    placeholder: 'Enter 12-digit Aadhaar',
    required: true,
    validation: {
      pattern: '^\\d{12}$',
      length: 12,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render input field', () => {
    render(
      <InputField
        field={textField}
        value=""
        onChange={mockOnChange}
      />
    );
    expect(screen.getByLabelText(/Aadhaar Number/i)).toBeInTheDocument();
  });

  it('should call onChange when input changes', async () => {
    render(
      <InputField
        field={textField}
        value=""
        onChange={mockOnChange}
      />
    );
    const input = screen.getByPlaceholderText(/Enter 12-digit/i);
    fireEvent.change(input, { target: { value: '123456789012' } });
    expect(mockOnChange).toHaveBeenCalledWith('123456789012');
  });

  it('should display error message', () => {
    const errorMsg = 'Aadhaar must be 12 digits';
    render(
      <InputField
        field={textField}
        value="12345"
        onChange={mockOnChange}
        error={errorMsg}
      />
    );
    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });

  it('should disable input when disabled prop is true', () => {
    render(
      <InputField
        field={textField}
        value=""
        onChange={mockOnChange}
        disabled
      />
    );
    const input = screen.getByPlaceholderText(/Enter 12-digit/i);
    expect(input).toBeDisabled();
  });

  it('should show hint text', () => {
    const fieldWithHint = { ...textField, hint: 'This is a hint' };
    render(
      <InputField
        field={fieldWithHint}
        value=""
        onChange={mockOnChange}
      />
    );
    expect(screen.getByText('This is a hint')).toBeInTheDocument();
  });

  it('should render checkbox field', () => {
    const checkboxField: FormField = {
      id: 'consent',
      name: 'consent',
      label: 'I agree to terms',
      type: 'checkbox',
      required: true,
    };
    render(
      <InputField
        field={checkboxField}
        value={false}
        onChange={mockOnChange}
      />
    );
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    fireEvent.click(checkbox);
    expect(mockOnChange).toHaveBeenCalledWith(true);
  });

  it('should render select field with options', () => {
    const selectField: FormField = {
      id: 'state',
      name: 'state',
      label: 'State',
      type: 'select',
      options: [
        { value: '', text: 'Select State' },
        { value: 'MH', text: 'Maharashtra' },
        { value: 'DL', text: 'Delhi' },
      ],
    };
    render(
      <InputField
        field={selectField}
        value=""
        onChange={mockOnChange}
      />
    );
    const select = screen.getByDisplayValue('Select State');
    expect(select).toBeInTheDocument();
    fireEvent.change(select, { target: { value: 'MH' } });
    expect(mockOnChange).toHaveBeenCalledWith('MH');
  });
});
