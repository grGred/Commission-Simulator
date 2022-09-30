import { ethers, network, waffle } from 'hardhat';
import { deployContractFixture } from './shared/fixtures';
import { Wallet } from '@ethersproject/wallet';
import { Simulator, TestERC20, WETH9 } from '../typechain';
import { expect } from 'chai';
import { DEADLINE } from './shared/consts';
import { BigNumber as BN, BigNumberish, ContractTransaction } from 'ethers';
const hre = require('hardhat');

const createFixtureLoader = waffle.createFixtureLoader;

// const envConfig = require('dotenv').config();
// const {
//
// } = envConfig.parsed || {};

describe('Tests', () => {
    let wallet: Wallet, other: Wallet;
    let swapToken: TestERC20;
    let simulator: Simulator;
    let wnative: WETH9;

    let loadFixture: ReturnType<typeof createFixtureLoader>;

    before('create fixture loader', async () => {
        [wallet, other] = await (ethers as any).getSigners();
        loadFixture = createFixtureLoader([wallet, other]);
    });

    beforeEach('deploy fixture', async () => {
        ({ simulator, swapToken, wnative } = await loadFixture(deployContractFixture));
    });

    describe('#Tests', () => {
        describe('#funcName', () => {
            it('Should do smth', async () => {
                await swapToken.approve(simulator.address, ethers.constants.MaxUint256);
                await expect(simulator.simulateTransfer(swapToken.address, 100)).to.be.revertedWith(
                    'AmntReceivedSubAmntExpected(95, 100)'
                );
            });
        });
    });
});
