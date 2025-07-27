import type { Character } from '../../interfaces/interfaces';
import styles from './characterDetails.module.css';

type CharacterDetailsProps = {
  character: Character;
};

export const CharacterDetails = ({ character }: CharacterDetailsProps) => {
  return (
    <div className={styles.details}>
      <h2>{character.name}</h2>
      <img src={character.image} alt={character.name} />
      <p>Status: {character.status}</p>
      <p>Species: {character.species}</p>
      <p>Gender: {character.gender}</p>
      <p>Origin: {character.origin.name}</p>
      <p>Location: {character.location.name}</p>
    </div>
  );
};
