import { Component } from 'react';
import styles from './searchInput.module.css';

type SearchInputProps = {
  inputValue: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export class SearchInput extends Component<SearchInputProps> {
  render() {
    const placeholder = 'Search...';

    return (
      <input
        type="search"
        className={styles.input}
        placeholder={placeholder}
        value={this.props.inputValue}
        onChange={this.props.handleInputChange}
      />
    );
  }
}
