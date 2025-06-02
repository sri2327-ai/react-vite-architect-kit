
import React from 'react';
import { FormControlLabel, Checkbox, FormControl, FormHelperText } from '@mui/material';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

interface CheckboxFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  control?: Control<T>;
  label: string;
  required?: boolean;
  disabled?: boolean;
}

export const CheckboxField = <T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  disabled = false,
}: CheckboxFieldProps<T>) => {
  if (control) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormControl error={!!error} component="fieldset">
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={field.value || false}
                  disabled={disabled}
                  size="small"
                  inputProps={{
                    'aria-required': required,
                  }}
                />
              }
              label={label}
            />
            {error && <FormHelperText>{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
    );
  }

  return (
    <FormControlLabel
      control={
        <Checkbox
          name={name}
          disabled={disabled}
          size="small"
          inputProps={{
            'aria-required': required,
          }}
        />
      }
      label={label}
    />
  );
};
