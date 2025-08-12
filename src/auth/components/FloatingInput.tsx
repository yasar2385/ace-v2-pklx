// FloatingInput.tsx
import { Field, ErrorMessage } from 'formik';

// Base interface for common props
interface BaseFloatingInputProps {
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  autoComplete?: string;
}

// Interface for regular input fields
interface InputProps extends BaseFloatingInputProps {
  type: 'text' | 'email' | 'password' | 'number' | 'tel';
  as?: never;
  children?: never;
}

// Interface for select fields
interface SelectProps extends BaseFloatingInputProps {
  type?: never;
  as: 'select';
  children: React.ReactNode;
}

// Union type for all possible props
type FloatingInputProps = InputProps | SelectProps;

const FloatingInput = ({ 
  type, 
  name, 
  label, 
  placeholder, 
  as, 
  className = "form-control form-control-sm",
  children,
  autoComplete = "off"
}: FloatingInputProps) => {
  const id = `floating${name.charAt(0).toUpperCase() + name.slice(1)}`;
  
  return (
    <div className="form-floating">
      <Field
        type={type}
        name={name}
        className={className}
        id={id}
        placeholder={placeholder || label}
        as={as}
        autoComplete={autoComplete}
      >
        {children}
      </Field>
      <label htmlFor={id}>{label}</label>
      <ErrorMessage name={name} component="div" className="text-danger" />
    </div>
  );
};

export default FloatingInput;