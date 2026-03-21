import ReactMarkdown from 'react-markdown';
import styles from './MarkdownOutput.module.css';

export default function MarkdownOutput({ children }: { children: string }) {
  return (
    <div className={styles.md}>
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}
