import React,{ useState } from "react";
import styles from "../styles/Home.module.css";

const Stake = (): JSX.Element => {

    const [inputValue, setInputValue] = useState<number>();

    function handleChange(e: any): void {
        setInputValue(+e.target.value);
        console.log(inputValue)
    }

    return(
        <div className={styles.tokenGrid}>
            <div className={styles.nftDiv}>
                <h1 className={styles.tokenLabel}>Stake NFT</h1>
                <input
                type="number"
                className={styles.input}
                placeholder="Token ID here"
                onChange={handleChange}
                />
                <br />
                <button
                className={`${styles.mainButton} ${styles.spacerTop}`}
                >
                    Stake
                </button>
            </div>
            <div className={styles.nftDiv}> 
                <h1 className={styles.tokenLabel}>Withdraw NFT</h1>
                <input 
                type="number"
                className={styles.input}
                placeholder="Token ID here"
                onChange={handleChange}
                />
                <br />
                <button
                className={`${styles.mainButton} ${styles.spacerTop}`}
                >
                    Withdraw
                </button>
            </div>
        </div>
    )
}

export default Stake