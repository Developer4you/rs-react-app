import React from 'react';
import styles from './controls.module.css';
import { SearchInput } from '../SearchInput/SearchInput';
import { Button } from '../Button/Button';

interface ControlsProps {
  onSearch: (query: string) => void;
  loading: boolean;
  initialValue: string;
}

class Controls extends React.Component<ControlsProps> {
  state = {
    inputValue: this.props.initialValue || '',
  };

  componentDidMount() {
    if (!this.props.initialValue) {
      const savedQuery = localStorage.getItem('rickAndMortySearchQuery') || '';
      this.setState({ inputValue: savedQuery.trim() });
    }
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.target.value });
  };

  handleSearchClick = () => {
    const trimmed = this.state.inputValue.trim();
    this.setState({ inputValue: trimmed });
    this.props.onSearch(trimmed);
  };

  render() {
    return (
      <div className={styles.controls}>
        <SearchInput
          inputValue={this.state.inputValue}
          handleInputChange={this.handleInputChange}
        />
        <Button
          label={this.props.loading ? 'Searching...' : 'Search'}
          onClick={this.handleSearchClick}
          disabled={this.props.loading}
        />
      </div>
    );
  }
}

export default Controls;
