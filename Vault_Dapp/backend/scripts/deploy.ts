import { ethers } from "hardhat";
import { GoldToken, GoldToken__factory, Vault, Vault__factory } from "../typechain-types";

const main = async (): Promise <void> => {

  const tokenFactory: GoldToken__factory = await ethers.getContractFactory("GoldToken");

  const deployedTokenFactory: GoldToken = await tokenFactory.deploy(1000);

  await deployedTokenFactory.deployed();

  const goldTokenAddress: string = deployedTokenFactory.address

  console.log("GOLD TOKEN ADDRESS: ", goldTokenAddress);
  
  const vaultContractFactory: Vault__factory = await ethers.getContractFactory("Vault");

  const deployedVaultContract: Vault = await vaultContractFactory.deploy(goldTokenAddress);

  await deployedVaultContract.deployed();

  const vaultContractAddress: string = deployedVaultContract.address

  console.log("Vault Contract Address: ", vaultContractAddress)

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
