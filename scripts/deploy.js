const hre = require("hardhat");

async function main() {
  const factory = await hre.ethers.getContractFactory("Simulator");
  
  const deploy = await upgrades.deployProxy(factory, [], {initialize: 'initialize'});

  await deploy.deployed();

  console.log("deployed to:", deploy.address);

  await new Promise(r => setTimeout(r, 10000));

    await hre.run("verify:verify", {
    address: '',
    constructorArguments: [],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
