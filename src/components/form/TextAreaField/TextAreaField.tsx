
import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

interface TextAreaFieldProps<T extends FieldValues> extends Omit<TextFieldProps, 'name'> {
  name: FieldPath<T>;
  control?: Control<T>;
  label: string;
  required?: boolean;
  rows?: number;
}

export const TextAreaField = <T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  fullWidth = true,
  size = 'small',
  variant = 'outlined',
  rows = 4,
  ...props
}: TextAreaFieldProps<T>) => {
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
            multiline
            rows={rows}
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
      multiline
      rows={rows}
      aria-label={label}
      aria-required={required}
    />
  );
};
