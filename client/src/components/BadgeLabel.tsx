import styles from './BadgeLabel.module.css';

type Variant = 'reach' | 'target' | 'safety';

interface Props {
  variant: Variant;
  label: string;
}

export default function BadgeLabel({ variant, label }: Props) {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>{label}</span>
  );
}
