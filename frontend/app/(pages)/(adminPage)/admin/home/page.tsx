'use client'
import styles from "./adminHomePage.module.css";
import AuthCheck from "@/app/components/AuthCheck";

function HomePage() {
  return (
    <div>
      {/* <AuthCheck/> */}
      <div className={styles.blogContainer}>
        <h1 className={styles.title}>Choose To Manage</h1>
      </div>
    </div>
    
  );
}

export default (HomePage);
  