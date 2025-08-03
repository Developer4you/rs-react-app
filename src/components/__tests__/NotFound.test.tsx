import { render, screen } from '@testing-library/react';
import { NotFound } from '../NotFound/NotFound';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

describe('NotFound Component', () => {
  it('renders 404 message', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();
    expect(
      screen.getByText('The page you are looking for does not exist.')
    ).toBeInTheDocument();
    expect(screen.getByText('Go back to the home page')).toBeInTheDocument();
  });

  it('contains link to home page', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    const homeLink = screen.getByText('Go back to the home page');
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
