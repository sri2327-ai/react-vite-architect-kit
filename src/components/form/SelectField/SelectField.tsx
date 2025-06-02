
import React from 'react';
import { TextField, MenuItem, TextFieldProps } from '@mui/material';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

interface Option {
  value: string | number;
  label: string;
}

interface SelectFieldProps<T extends FieldValues> extends Omit<TextFieldProps, 'name' | 'select'> {
  name: FieldPath<T>;
  control?: Control<T>;
  label: string;
  options: Option[];
  required?: boolean;
}

export const SelectField = <T extends FieldValues>({
  name,
  control,
  label,
  options,
  required = false,
  fullWidth = true,
  size = 'small',
  variant = 'outlined',
  ...props
}: SelectFieldProps<T>) => {
  if (control) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            {...props}
            select
            label={label}
            required={required}
            fullWidth={fullWidth}
            size={size}
            variant={variant}
            error={!!error}
            helperText={error?.message}
            aria-label={label}
            aria-required={required}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
    );
  }

  return (
    <TextField
      {...props}
      name={name}
      select
      label={label}
      required={required}
      fullWidth={fullWidth}
      size={size}
      variant={variant}
      aria-label={label}
      aria-required={required}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};
