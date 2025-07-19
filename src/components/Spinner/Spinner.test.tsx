import { render, screen } from '@testing-library/react';
import Spinner from './Spinner';
import { describe, it, expect } from 'vitest';
import styles from './Spinner.module.css';

describe('Spinner Component', () => {
  it('renders spinner with React logo', () => {
    render(<Spinner />);

    const spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass(styles.spinner);
  });
});
