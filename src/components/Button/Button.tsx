import { Component, type MouseEvent } from 'react';
import styles from './button.module.css';

type ButtonProps = {
  label: string;
  maxWith?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
};

export class Button extends Component<ButtonProps> {
  render() {
    const { label, onClick, disabled } = this.props;

    return (
      <button
        className={styles.button}
        onClick={onClick}
        disabled={disabled}
        style={{ maxWidth: this.props.maxWith ? this.props.maxWith : 'unset' }}
      >
        {label}
      </button>
    );
  }
}
