const hre = require("hardhat");

async function main() {
  const factory = await hre.ethers.getContractFactory("Simulator");
  
  const deploy = await upgrades.deployProxy(factory, [], {initialize: 'initialize'});

  await deploy.deployed();

  console.log("deployed to:", deploy.address);

  await new Promise(r => setTimeout(r, 10000));

    await hre.run("verify:verify", {
    address: '0xf5454e6da76e2af9824b8d88f2af103159a396aa',
    constructorArguments: [],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
