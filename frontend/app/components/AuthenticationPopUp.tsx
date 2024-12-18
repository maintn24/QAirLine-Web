import { useState } from "react";
import styles from "@/app/components/styles/SignIn_SignUp_PopUp.module.css";

interface LoginPopupProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
  }

const SignIn_SignUp_PopUp:React.FC<LoginPopupProps> = ({visible, setVisible}) => {
    const [isRightPanelActive, setisRightPanelActive] = useState(false);

    const handleSignUpClick = () => {
        setisRightPanelActive(true);
    }

    const handleSignInClick = () => {
        setisRightPanelActive(false);
    }

    const closePopup = () => {
        setVisible(false);
    };

    return(
        visible ? (
            <div className={`${styles.container} ${isRightPanelActive ? styles.containerRightPanelActive : ""}`}>
                <button className={styles.closeButton} onClick={closePopup}>X</button> {/* Button đóng */}
                <div className={styles.signUp}>
                    <form action="#" className={styles.form}>
                        <h1 className={styles.formTitle}>Create Account</h1>
                        <div className={styles.socialContainer}>
                            <a href="#" className={styles.social}><i className="fab fa_facebook"></i></a>
                            <a href="#" className={styles.social}><i className="fab fa-google-plus-g"></i></a>
                            <a href="#" className={styles.social}><i className="fab fa_linkedin_in"></i></a>
                        </div>
                        <p className={styles.formText}>or use your email for registration</p>
                        <input className={styles.inputField} type="text" name="txt" placeholder="Name" required></input>
                        <input className={styles.inputField} type="email" name="email" placeholder="Email" required></input>
                        <input className={styles.inputField} type="password" name="pwd" placeholder="Password" required></input>
                        <button className={styles.formButton}>Sign Up</button>
                    </form>
                </div>
                <div className={styles.signIn}>
                    <form action="#" className={styles.form}>
                        <h1 className={styles.formTitle}>Sign in</h1>
                        <div className={styles.socialContainer}>
                            <a href="#" className={styles.social}><i className="fab fa_facebook"></i></a>
                            <a href="#" className={styles.social}><i className="fab fa-google-plus-g"></i></a>
                            <a href="#" className={styles.social}><i className="fab fa_linkedin_in"></i></a>
                        </div>
                        <p className={styles.formText}>or use your account</p>
                        <input className={styles.inputField} type="email" name="email" placeholder="Email" required></input>
                        <input className={styles.inputField} type="password" name="pwd" placeholder="Password" required></input>
                        <a href="#" className={styles.formLink}>Forget your Password?</a>
                        <button className={styles.formButton}>Sign In</button>
                    </form>
                </div>
                <div className={styles.overlayContainer}>
                    <div className={styles.overlay}>
                        <div className={styles.overlayLeft}>
                            <h1>Welcome Back!</h1>
                            <p className={styles.overlayText}>To keep connected with us please login with your personal info</p>
                            <button className={styles.overlayButton} onClick={handleSignInClick}>Sign In</button>
                        </div>
                        <div className={styles.overlayRight}>
                            <h1>Hello, Friend</h1>
                            <p className={styles.overlayText}>Enter your personal details and start journey with us</p>
                            <button className={styles.overlayButton} onClick={handleSignUpClick}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        ) : null
    );
};

export default SignIn_SignUp_PopUp;