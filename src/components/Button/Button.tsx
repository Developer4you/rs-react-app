import styles from './button.module.css';

type ButtonProps = {
  label: string;
  maxWith?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
};

export const Button = ({ label, maxWith, onClick, disabled }: ButtonProps) => {
  return (
    <button
      className={styles.button}
      onClick={onClick}
      disabled={disabled}
      style={{ maxWidth: maxWith ? maxWith : 'unset' }}
    >
      {label}
    </button>
  );
};
