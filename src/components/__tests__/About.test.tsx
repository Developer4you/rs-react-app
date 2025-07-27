import { render, screen } from '@testing-library/react';
import { About } from '../About/About';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

describe('About Component', () => {
  it('renders about information', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    expect(screen.getByText('About the Application')).toBeInTheDocument();
    expect(
      screen.getByText(
        'This application was developed as part of the RS School React course.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('RS School React Course')).toBeInTheDocument();
    expect(screen.getByText('Back to Search')).toBeInTheDocument();
  });

  it('contains correct links', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    const courseLink = screen.getByText('RS School React Course');
    expect(courseLink).toHaveAttribute('href', 'https://rs.school/react/');
    expect(courseLink).toHaveAttribute('target', '_blank');

    const backLink = screen.getByText('Back to Search');
    expect(backLink).toHaveAttribute('href', '/');
  });
});
