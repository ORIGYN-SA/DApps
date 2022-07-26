import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { createMemoryHistory } from 'history';

function customRender(children) {
  const history = createMemoryHistory({ initialEntries: ['/'] });
  return render(<Router history={history}>{children}</Router>);
}
export * from '@testing-library/react';

export { customRender as render };

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
