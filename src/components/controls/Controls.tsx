import React from 'react';
import styles from './controls.module.css';
import { SearchInput } from '../SearchInput/SearchInput';
import { Button } from '../Button/Button';

class Controls extends React.Component {
  componentDidMount() {
    console.log();
  }

  render() {
    return (
      <div className={styles.controls}>
        <SearchInput />
        <Button label="Search" />
      </div>
    );
  }
}

export default Controls;
