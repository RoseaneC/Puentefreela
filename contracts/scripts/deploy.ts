import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy MockUSDC
  console.log("\nDeploying MockUSDC...");
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.deploy();
  await mockUSDC.waitForDeployment();
  const mockUSDCAddress = await mockUSDC.getAddress();
  console.log("MockUSDC deployed to:", mockUSDCAddress);

  // Deploy EscrowJobs
  console.log("\nDeploying EscrowJobs...");
  const EscrowJobs = await ethers.getContractFactory("EscrowJobs");
  const escrowJobs = await EscrowJobs.deploy();
  await escrowJobs.waitForDeployment();
  const escrowJobsAddress = await escrowJobs.getAddress();
  console.log("EscrowJobs deployed to:", escrowJobsAddress);

  console.log("\n=== Deployment Summary ===");
  console.log("MockUSDC:", mockUSDCAddress);
  console.log("EscrowJobs:", escrowJobsAddress);
  console.log("\nCopy these addresses to your frontend contract.ts file!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

