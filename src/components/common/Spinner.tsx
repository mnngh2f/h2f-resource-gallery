// Spinner Component - Loading indicator

import styles from './Spinner.module.css';

interface SpinnerProps {
  message?: string;
}

export const Spinner = ({ message = 'Loading...' }: SpinnerProps) => {
  return (
    <div className={styles.spinnerContainer} role="status" aria-live="polite">
      <div className={styles.spinner} aria-hidden="true" />
      <span className={styles.message}>{message}</span>
    </div>
  );
};
