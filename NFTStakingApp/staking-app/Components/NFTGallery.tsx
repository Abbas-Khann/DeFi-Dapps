import React from "react";
import { ThirdwebNftMedia, useAddress, useContract, useOwnedNFTs } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";

const NFTGallery = (): JSX.Element => {

    const connectedWallet = useAddress()
    const CONTRACT_ADDRESS: string = "0x8cBDAd66D9aAf60190613A06e70642B99d79Ca96";
    
    const { contract } = useContract(CONTRACT_ADDRESS);
    const { data: OwnedNFTs, isLoading, error } = useOwnedNFTs(contract, connectedWallet);

    if(isLoading) {
        return(
            <h1>Loading...</h1>
        )
    }

    console.log(OwnedNFTs)
    // console.log(nfts)
    return(
        <div>
            {isLoading ? (
                <p className={styles.name}>Loading...</p>
            )
            :
                <div>
                    {OwnedNFTs?.map((nft) => {
                        <div key={nft?.metadata?.id?.toString()} className={styles.divCard}>
                            <h1 className={styles.name}>{nft.metadata.name}</h1>
                            <ThirdwebNftMedia metadata={nft.metadata} className={styles.image} />
                        </div>
                    })
                    }
                </div>
            }
        </div>
    )
}

export default NFTGallery