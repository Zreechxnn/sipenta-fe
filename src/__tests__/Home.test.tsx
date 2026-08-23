import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

test('vitest test framework is working', () => {
  render(<div>Hello QA</div>);
  const element = screen.getByText('Hello QA');
  expect(element).toBeInTheDocument();
});
