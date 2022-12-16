import React from "react";
import styles from "../styles/Home.module.css";
import {useContract} from "@thirdweb-dev/react";

const Rewards = (): JSX.Element => {

    const STAKING_CONTRACT_ADDRESS : string = "0x678deE906a62f540a33156fe54dd8b321a37fB1B";
    // pasting the staking contract address variable in the useContract hook
    const { contract } = useContract(STAKING_CONTRACT_ADDRESS);

    // claimRewards will be an async function and it will call the claimRewards function from the staking contract
    const claimRewards = async (): Promise<void> => {
        const claim = await contract?.call("claimRewards");
    }
    
    return(
        <div className={styles.rewardsDiv}>
                <button
                className={`${styles.mainButton} ${styles.spacerTop}`}
                // calling the claimRewards function here
                onClick={() => claimRewards()}
                >
                Claim Rewards
                </button>
        </div>
    )
}

export default Rewards