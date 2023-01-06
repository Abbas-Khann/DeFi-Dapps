import { ConnectWallet } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import Rewards from "../Components/Rewards";
import Stake from "../Components/Stake";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
        <div className={styles.connect}>
          <ConnectWallet />
        </div>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to NFT Staking!
        </h1>

        <p className={styles.description}>
          Stake your NFT(ERC721) Token for{" "}
          30 days and earn Staking rewards for the whole month
        </p>
        <div>
        </div>
        <div>
        <Stake />
        <Rewards />
        </div>
      </main>
    </div>
  );
};

export default Home;
