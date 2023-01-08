import { Web3Button } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { NFT_CONTRACT_ADDRESS } from "../const/Index";
import styles from "../styles/Home.module.css";

const Mint: NextPage = () => {
    const router = useRouter();
    return(
        <div className={styles.container}>
      <h1 className={styles.h1}>Mint An NFT!</h1>

      <p className={styles.explain}>
        This is where we use our <b>NFT Drop</b> contract to allow users to mint
        one of the NFTs that we lazy minted.
      </p>
      <hr className={`${styles.smallDivider} ${styles.detailPageHr}`} />
      <Web3Button
        colorMode="dark"
        accentColor="#5204BF"
        contractAddress={NFT_CONTRACT_ADDRESS}
        action={(contract) => contract.erc721.claim(1)}
        onSuccess={() => {
          alert("NFT Claimed!");
          router.push("/Stake");
        }}
        onError={(error) => {
          alert(error);
        }}
      >
        Claim An NFT
      </Web3Button>
    </div>
    )
}

export default Mint
