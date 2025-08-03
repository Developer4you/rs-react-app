import { render, screen } from '@testing-library/react';
import { CharacterDetails } from '../CharacterDetails/CharacterDetails';
import { describe, it, expect } from 'vitest';
import type { Character } from '../../interfaces/interfaces';

describe('CharacterDetails Component', () => {
  const mockCharacter: Character = {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'Earth (C-137)', url: '' },
    location: { name: 'Earth (Replacement Dimension)', url: '' },
    image: 'https://example.com/rick.jpg',
    episode: [],
    url: '',
    created: new Date().toISOString(),
  };

  it('renders character details correctly', () => {
    render(<CharacterDetails character={mockCharacter} />);

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Status: Alive')).toBeInTheDocument();
    expect(screen.getByText('Species: Human')).toBeInTheDocument();
    expect(screen.getByText('Gender: Male')).toBeInTheDocument();
    expect(screen.getByText('Origin: Earth (C-137)')).toBeInTheDocument();
    expect(
      screen.getByText('Location: Earth (Replacement Dimension)')
    ).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      'https://example.com/rick.jpg'
    );
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Rick Sanchez');
  });
});
