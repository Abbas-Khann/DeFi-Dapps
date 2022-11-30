import { ConnectWallet } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import NFTGallery from "../Components/NFTGallery";
import TimeLimit from "../Components/TimeLimit";
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
          <code className={styles.code}>30 or more days</code>, And Win{" "}
          <code className={styles.code}>Staking rewards</code> for the whole month
        </p>
        <div>
          <TimeLimit />
        </div>
        {/* <div>
        <h2>NFT Gallery</h2>
        <NFTGallery />
        </div> */}
      </main>
    </div>
  );
};

export default Home;
