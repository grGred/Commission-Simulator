// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

/**

  ___ _   _ ____ _____  _    _   _ _____   ____  ____   _____  ____   __
 |_ _| \ | / ___|_   _|/ \  | \ | |_   _| |  _ \|  _ \ / _ \ \/ /\ \ / /
  | ||  \| \___ \ | | / _ \ |  \| | | |   | |_) | |_) | | | \  /  \ V / 
  | || |\  |___) || |/ ___ \| |\  | | |   |  __/|  _ <| |_| /  \   | |  
 |___|_| \_|____/ |_/_/   \_\_| \_| |_|   |_|   |_| \_\\___/_/\_\  |_|  


*/


import '@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol';

error AmntReceivedSubAmntExpected(uint256 amountReceived, uint256 amountExpected);

/**
    @title InstantProxy
    @author Vladislav Yaroshuk
    @notice Universal proxy dex aggregator contract by Rubic exchange
 */
contract Simulator {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    // function AmntReceivedSubAmntExpected(uint256 amountReceived, uint256 amountExpected) external {}

    constructor () {}

    /**
     * @dev Log the difference of token recieved after _transfer to contract
     *      can be used only in case the msg.sender has allowance to this address
     * @param _tokenIn Token sent
     * @param _amount Amount sent
     */
    function simulateTransfer(address _tokenIn, uint256 _amount) external {
        uint256 balanceBefore = IERC20Upgradeable(_tokenIn).balanceOf(address(this));
        IERC20Upgradeable(_tokenIn).transferFrom(msg.sender, address(this), _amount);
        revert AmntReceivedSubAmntExpected(
            IERC20Upgradeable(_tokenIn).balanceOf(address(this)) - balanceBefore,
            _amount
        );
    }

    /**
     * @dev Log the difference of token recieved after _transfer to msg.sender
     * @notice Use this function in case you don't know which address owns the token
     * @param _dex Dex address performing swap logic
     * @param _tokenIn Token sent
     * @param _amountIn Amount sent
     * @param _tokenOut token received
     * @param _data Data with swap logic, reciver must be contract address
     */
    function simulateSwap(
        address _dex,
        address _tokenIn,
        uint256 _amountIn,
        address _tokenOut,
        bytes calldata _data
    ) external payable {
        AddressUpgradeable.functionCallWithValue(_dex, _data, msg.value);
        
        if (_tokenIn != address(0)) {
            IERC20Upgradeable(_tokenIn).transferFrom(msg.sender, address(this), _amountIn);
            SafeERC20Upgradeable.safeApprove(IERC20Upgradeable(_tokenIn), _dex, _amountIn);
        }
        

        uint256 tokenAmntAfterSwap = IERC20Upgradeable(_tokenOut).balanceOf(address(this));
        uint256 balanceBefore = IERC20Upgradeable(_tokenOut).balanceOf(msg.sender);

        IERC20Upgradeable(_tokenOut).transfer(msg.sender, tokenAmntAfterSwap);
        revert AmntReceivedSubAmntExpected(
            IERC20Upgradeable(_tokenOut).balanceOf(msg.sender) - balanceBefore,
            balanceBefore
        );
    }
}
