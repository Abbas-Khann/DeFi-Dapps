import {
    ThirdwebNftMedia,
    useAddress,
    useContract,
    useContractWrite,
    useOwnedNFTs,
  } from "@thirdweb-dev/react";
  import { ConnectWallet } from "@thirdweb-dev/react";
  import { NFT } from "@thirdweb-dev/sdk";
  import { BigNumber } from "ethers";
  import type { NextPage } from "next";
  import { useEffect, useState } from "react";
  import { NFT_CONTRACT_ADDRESS, STAKING_CONTRACT_ADDRESS} from "../const/Index";
  import styles from "../styles/Home.module.css";

  const Stake: NextPage = () => {
    const address = useAddress();
    const { contract: nftDropContract } = useContract(
        NFT_CONTRACT_ADDRESS,
        "nft-drop"
    )
    const { contract, isLoading } = useContract(STAKING_CONTRACT_ADDRESS);
    const { data: ownedNfts } = useOwnedNFTs(nftDropContract, address);
    const { mutateAsync: claimRewards } = useContractWrite(
        contract,
        "claimRewards"
    );
    const [stakedNfts, setStakedNfts] = useState<NFT[]>([]);
    const [claimableRewards, setClaimableRewards] = useState<BigNumber>();
    const [checkedCheckboxes, setCheckedCheckboxes] = useState<any[]>([])
    const handleCheckboxChange = (data: any) => {
        console.log("checkedCheckboxes", checkedCheckboxes)
        console.log(data)
        const isChecked = checkedCheckboxes.some(
          (checkedCheckbox) => checkedCheckbox.value === data.value
        );
        console.log(isChecked)
        if (isChecked) {
          setCheckedCheckboxes(
            checkedCheckboxes.filter(
              (checkedCheckbox) => checkedCheckbox.value !== data.value
            )
          );
        } else {
          setCheckedCheckboxes(checkedCheckboxes.concat(data));
        }
      };

      console.log(stakedNfts, "stakedNFTs")
      console.log(ownedNfts, "ownedNFts")
    useEffect(() => {
        if (!contract) return;
    
        async function loadStakedNfts() {
          const stakedTokens = await contract?.call("getStakeInfo", address);
    
          // For each staked token, fetch it from the sdk
          const stakedNfts = await Promise.all(
            stakedTokens[0]?.map(async (stakedToken: BigNumber) => {
              const nft = await nftDropContract?.get(stakedToken.toNumber());
              return nft;
            })
          );
    
          setStakedNfts(stakedNfts);
        }
    
        if (address) {
          loadStakedNfts();
        }
      }, [address, contract, nftDropContract]);
    //   useEffect(() => {
    //     if (!contract || !address) return;
    
    //     async function loadClaimableRewards() {
    //       const stakeInfo = await contract?.call("getStakeInfo", address);
    //       setClaimableRewards(stakeInfo[1]);
    //     }
    
    //     loadClaimableRewards();
    //   }, [address, contract]);
    
      async function stakeNft(id: any[]) {
        if (!address) return;
        console.log(id)
        const isApproved = await nftDropContract?.isApproved(
          address,
          STAKING_CONTRACT_ADDRESS
        );
        if (!isApproved) {
          await nftDropContract?.setApprovalForAll(STAKING_CONTRACT_ADDRESS, true);
        }
        await contract?.call("stakeNft", [id]);
      }
    
      async function withdraw(id: any[]) {
        await contract?.call("withdrawNFT", [id]);
      }
    
      if (isLoading) {
        return <div>Loading</div>;
      }

      console.log("log outside", checkedCheckboxes)
      

      return (
        <div className={styles.container}>
          <h1 className={styles.h1}>Lock Your NFTs and earn rewards</h1>
          <hr className={`${styles.divider} ${styles.spacerTop}`} />
          {!address ? (
            <ConnectWallet />
          ) : (
            <>
              <button
                className={`${styles.mainButton} ${styles.spacerTop}`}
                onClick={() => claimRewards([])}
              >
                Claim Rewards
              </button>
    
              <hr className={`${styles.divider} ${styles.spacerTop}`} />
              <h2>Your Staked NFTs</h2>
              <div className={styles.nftBoxGrid}>
                {stakedNfts?.map((nft, idx) => (
                  <div className={styles.nftBox} key={nft.metadata.id.toString()}>
                    {nft?.metadata && (
                        <ThirdwebNftMedia
                        metadata={nft.metadata}
                        className={styles.nftMedia}
                        />
                        )}
                    <input
                    key={idx}
                    type="checkbox"
                    className={styles.checkbox}
                    onChange={() => handleCheckboxChange(nft.metadata.id)}
                    />
                    <h3>{nft.metadata.name}</h3>
                  </div>
                ))}
                    <button
                      className={`${styles.mainButton} ${styles.spacerBottom}`}
                      // onClick={} call withdraw here with token ids checked
                    >
                      Withdraw
                    </button>
              </div>
              <hr className={`${styles.divider} ${styles.spacerTop}`} />
              <h2>Your Unstaked NFTs</h2>
              <div className={styles.nftBoxGrid}>
                {ownedNfts?.map((nft, idx) => (
                  <div className={styles.nftBox} key={nft.metadata.id.toString()}>
                    <ThirdwebNftMedia
                      metadata={nft.metadata}
                      className={styles.nftMedia}
                    />
                    <input
                    value={nft.metadata.id}
                    checked=
              {checkedCheckboxes.some((checkedCheckbox) => checkedCheckbox.value === nft.metadata.id)}
                    key={idx}
                    type="checkbox"
                    className={styles.checkbox}
                    onChange={() => handleCheckboxChange(nft.metadata.id)}
                    />
                    <h3>{nft.metadata.name}</h3>
                      </div>
                        ))}
                    <button
                    className={`${styles.mainButton} ${styles.spacerBottom}`}
                    // onClick={} call stake here with token ids
                    >
                      Stake
                    </button>
              </div>
            </>
          )}
        </div>
      );
    };
    
    export default Stake;