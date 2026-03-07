import styles from './ProgressCard.module.css';

interface Props {
  title: string;
  percent: number;
  subtitle: string;
}

export default function ProgressCard({ title, percent, subtitle }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <span className={styles.percent}>{percent}%</span>
      </div>
      <div className={styles.barTrack}>
        <div className={styles.barFill} style={{ width: `${percent}%` }} />
      </div>
      <div className={styles.subtitle}>{subtitle}</div>
    </div>
  );
}
