import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
        <h1 className={styles.title}>Welcome to Next.js!</h1>
        <p className={styles.description}>
          Hello, world! This is a Next.js app.
        </p>
    </div>
  );
}
