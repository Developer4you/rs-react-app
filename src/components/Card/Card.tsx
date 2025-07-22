import styles from './card.module.css';
import ReactLogo from '../../assets/react.svg';

type CardProps = {
  image: string;
  name: string;
  locationName: string;
  gender: string;
};

export const Card = ({ image, name, locationName, gender }: CardProps) => {
  return (
    <div className={styles.card}>
      <img
        className={styles.image}
        src={image ? image : ReactLogo}
        alt={name ? name : 'Avatar'}
      />
      <div>
        <div className={styles.name} data-testid="name">
          {name ? name : 'Name is empty'}
        </div>
        <div className={styles.location} data-testid="location">
          {locationName ? locationName : 'Location is empty'}
        </div>
        <div className={styles.gender} data-testid="gender">
          {gender ? gender : 'Gender is empty'}
        </div>
      </div>
    </div>
  );
};
