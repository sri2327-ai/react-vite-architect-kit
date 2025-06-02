
import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

interface InputFieldProps<T extends FieldValues> extends Omit<TextFieldProps, 'name'> {
  name: FieldPath<T>;
  control?: Control<T>;
  label: string;
  required?: boolean;
}

export const InputField = <T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  fullWidth = true,
  size = 'small',
  variant = 'outlined',
  ...props
}: InputFieldProps<T>) => {
  if (control) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            {...props}
            label={label}
            required={required}
            fullWidth={fullWidth}
            size={size}
            variant={variant}
            error={!!error}
            helperText={error?.message}
            aria-label={label}
            aria-required={required}
          />
        )}
      />
    );
  }

  return (
    <TextField
      {...props}
      name={name}
      label={label}
      required={required}
      fullWidth={fullWidth}
      size={size}
      variant={variant}
      aria-label={label}
      aria-required={required}
    />
  );
};
