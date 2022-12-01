import React,{ useState } from "react";
import styles from "../styles/Home.module.css";
import { useContract } from "@thirdweb-dev/react";

const Stake = (): JSX.Element => {

    const STAKING_CONTRACT_ADDRESS: string = "0x678deE906a62f540a33156fe54dd8b321a37fB1B";
    const NFT_CONTRACT_ADDRESS: string = "0x24c5258769d49951fb2Fffb0c1948B9A53db12D6";
    const [inputValue, setInputValue] = useState<number>();

    const { contract } = useContract(STAKING_CONTRACT_ADDRESS, "custom");
    const { contract: nftDropContract } = useContract(NFT_CONTRACT_ADDRESS, "nft-drop");

    function handleChange(e: any): void {
        setInputValue(+e.target.value);
        console.log(inputValue)
    }

    const stakeNFT = async (): Promise<void> => {
        const stake = await contract?.call("stakeNft", inputValue)
    }

    const approveNft = async (): Promise<void> => {
        const approve = await nftDropContract?.call("approve", STAKING_CONTRACT_ADDRESS, inputValue);
        await stakeNFT();
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
                >
                    Withdraw
                </button>
            </div>
        </div>
    )
}

export default Stake