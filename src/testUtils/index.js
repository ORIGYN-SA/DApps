import React from 'react';
import TestEnvironment from './testEnv'

export * from '@testing-library/react';

export const makeFormikMethods = (mockFn) => ({
  resetForm: mockFn,
  setErrors: mockFn,
  setFieldError: mockFn,
  setFieldTouched: mockFn,
  setFieldValue: mockFn,
  setFormikState: mockFn,
  setStatus: mockFn,
  setSubmitting: mockFn,
  setTouched: mockFn,
  setValues: mockFn,
  submitForm: mockFn,
  validateField: mockFn,
  validateForm: mockFn,
});

module.exports = TestEnvironment