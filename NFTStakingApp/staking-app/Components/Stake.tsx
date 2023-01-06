import React,{ useState } from "react";
import styles from "../styles/Home.module.css";
import { useContract } from "@thirdweb-dev/react";

const Stake = (): JSX.Element => {

    const STAKING_CONTRACT_ADDRESS = "0xDd22afB50D50708143214060aDdEA64B8444298E";
    const NFT_CONTRACT_ADDRESS = "0x3D14251a40b92cA69a0Fca961C6D792cdD081a67";
    // taking the input value in this state
    const [inputValue, setInputValue] = useState<number>();
    // pasting the contract address and the type
    const { contract } = useContract(STAKING_CONTRACT_ADDRESS, "custom");
    console.log("Contract here", contract)
    // adding the type of the contract and the address here again
    const { contract: nftDropContract } = useContract(NFT_CONTRACT_ADDRESS, "nft-drop");


    // picking up the value using this function and converting it into a number with the +
    function handleChange(e: any): void {
        setInputValue(+e.target.value);
    }

    // stakeNFT will be used to Stake the NFT
    const stakeNFT = async (): Promise<void> => {
        // calling the stakeNft function from the contract and passing in the inputValue state
        try {
            const stake = await contract?.call("stakeNft", inputValue)
        } catch (err) {
            console.error(err)
        }
    }

    // The token needs to be approved before it can be used for staking so we will approve the particular NFT before performing the staking
    const approveNft = async (): Promise<void> => {
        try {
                // Here we are approving the NFT to the staking contract with the tokenID
                const approve = await nftDropContract?.call("approve", STAKING_CONTRACT_ADDRESS, inputValue);
                await stakeNFT();
        } catch (err) {
            console.error(err)
        }
    }

    // NFT withdrawal here
    const withdrawNft = async (): Promise<void> => {
        try {
            // similar process as the stakeNft function but this will withdraw the NFT
            const withdraw = await contract?.call("withdrawNFT", inputValue);
        } 
        catch (err) {
            console.error(err)    
        }
        
    }


    return(
        <div className={styles.tokenGrid}>
            <div className={styles.nftDiv}>
                <h1 className={styles.tokenLabel}>Stake NFT</h1>
                <input
                type="number"
                className={styles.input}
                placeholder="Token ID here"
                // onChange we will call the handleChange function to pick up the values
                onChange={handleChange}
                />
                <br />
                <button
                className={`${styles.mainButton} ${styles.spacerTop}`}
                // onClick we will call the approveNft function
                onClick={approveNft}
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
                // onClick we will call the withdrawal function
                onClick={withdrawNft}
                >
                    Withdraw
                </button>
            </div>
        </div>
    )
}

export default Stake