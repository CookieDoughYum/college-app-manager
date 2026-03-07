import styles from './TagChip.module.css';

interface Props {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function TagChip({ label, selected, onClick }: Props) {
  return (
    <button
      type="button"
      className={selected ? `${styles.chip} ${styles.selected}` : styles.chip}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
