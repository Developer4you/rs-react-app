import { render, screen } from '@testing-library/react';
import { Card } from './Card';
import { describe, it, expect } from 'vitest';
import ReactLogo from '../../assets/react.svg';

describe('Card Component', () => {
  const mockProps = {
    image: 'https://example.com/image.jpg',
    name: 'Rick Sanchez',
    locationName: 'Earth (C-137)',
    gender: 'Male',
  };

  const emptyProps = {
    image: '',
    name: '',
    locationName: '',
    gender: '',
  };

  it('renders card with correct props', () => {
    render(<Card {...mockProps} />);

    expect(screen.getByAltText('Rick Sanchez')).toHaveAttribute(
      'src',
      mockProps.image
    );
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Earth (C-137)')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
  });

  it('renders default values when props are empty', () => {
    render(<Card {...emptyProps} />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', ReactLogo);
    expect(img).toHaveAttribute('alt', 'Avatar');

    expect(screen.getByTestId('name')).toHaveTextContent('Name is empty');
    expect(screen.getByTestId('location')).toHaveTextContent(
      'Location is empty'
    );
    expect(screen.getByTestId('gender')).toHaveTextContent('Gender is empty');
  });
});
