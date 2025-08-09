import styles from './page.module.scss';
import { ReactElement } from 'react';

export default function Home(): ReactElement {
  return <div className={styles.page}>Home page</div>;
}
