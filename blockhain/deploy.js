// File: blockchain/scripts/deploy.js
async function main() {
  const creditHistory = await hre.ethers.deployContract("CreditHistory");
  await creditHistory.waitForDeployment();
  console.log(`CreditHistory contract deployed to: ${creditHistory.target}`);
}
main().catch((error) => { console.error(error); process.exitCode = 1; });