import Link from 'next/link';
import styles from '../styles/Home.module.css'; 

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Home page </h1>
      <nav className={styles.nav}>
        <ul>
          <li>Don`&rsquo;`t have account? 
            <Link href="/signup" className={styles.link}>
              Signup
            </Link>
          </li>
          <li>Have an account
            <Link href="/login" className={styles.link}>
              Login
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
