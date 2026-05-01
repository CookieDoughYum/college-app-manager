import styles from './ProgressCard.module.css';

interface Props {
  title: string;
  percent: number;
  subtitle: string;
  onClick?: () => void;
  accentColor?: string;
  accentShadow?: string;
}

export default function ProgressCard({ title, percent, subtitle, onClick, accentColor = '#e94560', accentShadow = 'rgba(233,69,96,0.18)' }: Props) {
  return (
    <div
      className={`${styles.card} ${onClick ? styles.clickable : ''}`}
      onClick={onClick}
      style={{ '--accent': accentColor, '--accent-shadow': accentShadow } as React.CSSProperties}
    >
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <span className={styles.percent}>{percent}%</span>
      </div>
      <div className={styles.barTrack}>
        <div className={styles.barFill} style={{ width: `${percent}%` }} />
      </div>
      <div className={styles.subtitle}>
        {subtitle}
        {onClick && <span className={styles.arrow}>→</span>}
      </div>
    </div>
  );
}
