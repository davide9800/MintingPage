import {
  ChainId,
  useClaimedNFTSupply,
  useContractMetadata,
  useNetwork,
  useNFTDrop,
  useUnclaimedNFTSupply,
} from "@thirdweb-dev/react";
import { useNetworkMismatch } from "@thirdweb-dev/react";
import { useAddress, useMetamask } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { useState } from "react";
import styles from "../styles/Theme.module.css";

// Put Your NFT Drop Contract address from the dashboard here
const myNftDropContractAddress = "0x94199256A0B2788dD6A42B3Ad8c032525c526674";

const Home: NextPage = () => {
  const nftDrop = useNFTDrop(myNftDropContractAddress);
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const isOnWrongNetwork = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  const [claiming, setClaiming] = useState<boolean>(false);

  // Load contract metadata
  const { data: contractMetadata } = useContractMetadata(
    myNftDropContractAddress
  );

  // Load claimed supply and unclaimed supply
  const { data: unclaimedSupply } = useUnclaimedNFTSupply(nftDrop);
  const { data: claimedSupply } = useClaimedNFTSupply(nftDrop);

  // Loading state while we fetch the metadata
  if (!nftDrop || !contractMetadata) {
    return <div className={styles.container}>Loading...</div>;
  }

  // Function to mint/claim an NFT
  async function mint() {
    // Make sure the user has their wallet connected.
    if (!address) {
      connectWithMetamask();
      return;
    }

    // Make sure the user is on the correct network (same network as your NFT Drop is).
    if (isOnWrongNetwork) {
      switchNetwork && switchNetwork(ChainId.Mumbai);
      return;
    }

    setClaiming(true);

    try {
      const minted = await nftDrop?.claim(1);
      console.log(minted);
      alert(`Successfully minted NFT!`);
    } catch (error) {
      console.error(error);
      alert(error);
    } finally {
      setClaiming(false);
    }
  }

  return (
    
    <div className={styles.container}>
      <div className={styles.Info}>
        {/* Title of your NFT Collection */}
        <h1>{contractMetadata?.name}</h1>
      </div>

      <div className={styles.imageSide}>
        {/* Image Preview of NFTs */}
        <img
          className={styles.image}
          src={contractMetadata?.image}
          alt={`${contractMetadata?.name} preview image`}
        />

        {/* Amount claimed so far */}
        <div className={styles.mintCompletionArea}>

          <div className={styles.mintAreaLeft}>
            <p>Total Minted</p>
          </div>
          <div className={styles.mintAreaRight}>

            {claimedSupply && unclaimedSupply ? (
              <p>

                {/* Claimed supply so far */}
                <b>{claimedSupply?.toNumber()}</b>
                {" / "}
                {
                  // Add unclaimed and claimed supply to get the total supply
                  claimedSupply?.toNumber() + unclaimedSupply?.toNumber()
                }
              </p>
            ) : (
              // Show loading state if we're still loading the supply
              <p>Loading...</p>
            )}
          </div>
        </div>

        {address ? (
          <button
            className={styles.mainButton}
            onClick={mint}
            disabled={claiming}
          >
            {claiming ? "Minting..." : "Mint"}
          </button>
        ) : (
          <button className={styles.mainButton} onClick={connectWithMetamask}>
            Connect Wallet
          </button>
        )}
      </div>
      <div className={styles.container}>

        {/* Description of your NFT Collection */}
        <p className={styles.description }>{"Inspired by a journey that lend to the center of the universe. Any NFT is a snapshot of this amazing journey"}</p>
        {/* Creator */}
       
        <b className={styles.smallButton}  onClick={() => window.open("https://twitter.com/cosimo_eth")}  >{"Made By Cosimo.eth"}</b>
        <img
          src={"/twitter.png"}
          width={20}
          height={20}
          role="button"
          style={{ cursor: "pointer" }}
          onClick={() => window.open(url, "_blank")}
        />


      </div>
      
    </div>


  );

};

export default Home;
