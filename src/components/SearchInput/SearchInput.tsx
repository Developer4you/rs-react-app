import styles from './searchInput.module.css';

type SearchInputProps = {
  inputValue: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const SearchInput = ({
  inputValue,
  handleInputChange,
}: SearchInputProps) => {
  const placeholder = 'Search...';

  return (
    <input
      type="search"
      className={styles.input}
      placeholder={placeholder}
      value={inputValue}
      onChange={handleInputChange}
    />
  );
};
