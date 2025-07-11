import { Component, type ChangeEvent } from 'react';
import styles from './searchInput.module.css';

type SearchInputProps = {
  placeholder?: string;
  onSearch?: (query: string) => void;
};

type SearchInputState = {
  query: string;
};

export class SearchInput extends Component<SearchInputProps, SearchInputState> {
  constructor(props: SearchInputProps) {
    super(props);
    this.state = {
      query: '',
    };
  }

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    this.setState({ query });

    if (this.props.onSearch) {
      this.props.onSearch(query);
    }
  };

  render() {
    const { placeholder = 'Search...' } = this.props;
    const { query } = this.state;

    return (
      <input
        type="search"
        className={styles.input}
        placeholder={placeholder}
        value={query}
        onChange={this.handleChange}
      />
    );
  }
}
