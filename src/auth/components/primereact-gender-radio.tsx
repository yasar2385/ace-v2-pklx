// GenderRadioGroup.tsx
import { SelectButton, SelectButtonChangeEvent } from 'primereact/selectbutton';
import { Field, ErrorMessage } from 'formik';

interface GenderRadioProps {
  name: string;
}

const GenderRadioGroup = ({ name }: GenderRadioProps) => {
  const options = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' }
  ];

  return (
    <Field name={name}>
      {({ field, form }: any) => (
        <div className="field">
          <label htmlFor={name} className="block mb-2">Gender</label>
          <SelectButton
            id={name}
            options={options}
            value={field.value}
            onChange={(e: SelectButtonChangeEvent) => {
              form.setFieldValue(name, e.value);
            }}
            className="w-100"
          />
          <ErrorMessage 
            name={name} 
            component="small" 
            className="p-error block mt-2"
          />
        </div>
      )}
    </Field>
  );
};

export default GenderRadioGroup;