import { render, screen } from '@testing-library/react';
import Spinner from '../../components/Spinner/Spinner';
import { describe, it, expect } from 'vitest';
import styles from '../../components/Spinner/Spinner.module.css';

describe('Spinner Component', () => {
  it('renders spinner with React logo', () => {
    render(<Spinner />);

    const spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass(styles.spinner);
  });
});
