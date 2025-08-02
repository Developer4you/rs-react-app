import styles from './card.module.css';
import ReactLogo from '../../assets/react.svg';
import { useState, useEffect } from 'react';
import { useSelectedItemsStore } from '../../store/selectedItemsStore';
import type { CardProps } from '../../interfaces/interfaces';

export const Card = ({
  id,
  image,
  name,
  locationName,
  gender,
  detailsUrl,
}: CardProps) => {
  const { selectedItems, toggleItem } = useSelectedItemsStore();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsChecked(selectedItems.some((item) => item.id === id));
  }, [selectedItems, id]);

  const handleCheckboxChange = () => {
    toggleItem({
      id,
      name,
      locationName,
      gender,
      image,
      detailsUrl,
    });
  };

  return (
    <div className={styles.card}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
        className={styles.checkbox}
      />
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
