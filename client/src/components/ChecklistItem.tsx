import styles from './ChecklistItem.module.css';

interface Props {
  checked: boolean;
  label: string;
  subtext?: string;
  onChange: (checked: boolean) => void;
}

export default function ChecklistItem({ checked, label, subtext, onChange }: Props) {
  return (
    <label className={styles.item}>
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className={styles.content}>
        <span className={checked ? `${styles.label} ${styles.labelChecked}` : styles.label}>
          {label}
        </span>
        {subtext && <span className={styles.subtext}>{subtext}</span>}
      </div>
    </label>
  );
}
