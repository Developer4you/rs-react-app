import React from 'react';
import styles from './results.module.css';

class Results extends React.Component {
  componentDidMount() {
    console.log();
  }

  render() {
    return (
      <div className={styles.results}>
        <div>{'Привет я компонент main!'}</div>
      </div>
    );
  }
}

export default Results;
