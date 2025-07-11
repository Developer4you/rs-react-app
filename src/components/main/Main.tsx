import React from 'react';
import styles from './main.module.css';
import Controls from '../controls/Controls';
import Results from '../results/Results';
import { Button } from '../Button/Button';

class Main extends React.Component {
  componentDidMount() {
    console.log();
  }

  render() {
    return (
      <div className={styles.main}>
        <Controls />
        <Results />
        <div
          style={{ display: 'flex', justifyContent: 'end', padding: '20px 0' }}
        >
          <Button label="Error Button" maxWith="200px" />
        </div>
      </div>
    );
  }
}

export default Main;
