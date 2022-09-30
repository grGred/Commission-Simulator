import { Fixture } from 'ethereum-waffle';
import { ethers, network } from 'hardhat';
import { Simulator } from '../../typechain';
import { TestERC20 } from '../../typechain';
import { WETH9 } from '../../typechain';
import TokenJSON from '../../artifacts/contracts/test/TestERC20.sol/TestERC20.json';
import WETHJSON from '../../artifacts/contracts/test/WETH9.sol/WETH9.json';
import { expect } from 'chai';

interface DeployContractFixture {
    simulator: Simulator;
    swapToken: TestERC20;
    wnative: WETH9;
}

export const deployContractFixture: Fixture<DeployContractFixture> = async function (
    wallets
): Promise<DeployContractFixture> {
    const swapTokenFactory = await ethers.getContractFactory('TestERC20');
    let swapToken = (await swapTokenFactory.deploy()) as TestERC20;
    swapToken = swapToken.connect(wallets[0]);
    await swapToken.setDefl();

    const wnativeFactory = await ethers.getContractFactory('WETH9');
    let wnative = (await wnativeFactory.deploy()) as WETH9;
    wnative = wnative.connect(wallets[0]);

    const simulatorFactory = await ethers.getContractFactory('Simulator');
    const simulator = (await simulatorFactory.deploy()) as Simulator;

    // part for seting storage
    const abiCoder = ethers.utils.defaultAbiCoder;

    const storageBalancePositionSwap = ethers.utils.keccak256(
        abiCoder.encode(['address'], [wallets[0].address]) +
            abiCoder.encode(['uint256'], [0]).slice(2, 66)
    );

    await network.provider.send('hardhat_setStorageAt', [
        swapToken.address,
        storageBalancePositionSwap,
        abiCoder.encode(['uint256'], [ethers.utils.parseEther('100000')])
    ]);

    expect(await swapToken.balanceOf(wallets[0].address)).to.eq(ethers.utils.parseEther('100000'));

    await network.provider.send('hardhat_setBalance', [
        wallets[0].address,
        '0x152D02C7E14AF6800000' // 100000 eth
    ]);

    return {
        simulator,
        swapToken,
        wnative
    };
};
