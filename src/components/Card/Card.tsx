import { Component } from 'react';
import styles from './card.module.css';

type CardProps = {
  image: string;
  name: string;
  locationName: string;
  gender: string;
};

export class Card extends Component<CardProps> {
  render() {
    const { image, name, locationName, gender } = this.props;

    return (
      <div className={styles.card}>
        <img className={styles.image} src={image} alt={name} />
        <div>
          <div className={styles.name}>{name}</div>
          <div className={styles.location}>{locationName}</div>
          <div className={styles.gender}>{gender}</div>
        </div>
      </div>
    );
  }
}
