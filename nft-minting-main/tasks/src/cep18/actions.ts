import { CEP18Client } from 'casper-cep18-js-client';
import { CLValueBuilder } from 'casper-js-sdk';
import { BigNumber } from '@ethersproject/bignumber';

import { AdminKeypair, User1Keypair } from '../accounts';
import { NODE_ADDRESS, NETWORK, MINTER_CONTRACT, WETH_CONTRACT } from '../constants';
import { HashType, hashToUnit8Array } from '../utils/input';

const cep18Client = new CEP18Client(NODE_ADDRESS, NETWORK);
cep18Client.setContractHash(WETH_CONTRACT.contractHash as any, WETH_CONTRACT.packageHash as any);

// only installer
export async function mintCep18() {
  const mintDeploy = cep18Client.mint(
    {
      amount: (100 * 1e9).toString(),
      owner: User1Keypair.publicKey,
    },
    (6 * 1e9).toString(),
    User1Keypair.publicKey,
    NETWORK,
    [User1Keypair]
  );

  const deployHash = await mintDeploy.send(NODE_ADDRESS);
  console.log('deployHash', deployHash);
}

export async function approveCep18() {
  const mintDeploy = cep18Client.approve(
    {
      amount: (200 * 1e9).toString(),
      spender: CLValueBuilder.byteArray(
        hashToUnit8Array(HashType.CONTRACT, MINTER_CONTRACT.packageHash)
      ),
    },
    (6 * 1e9).toString(),
    User1Keypair.publicKey,
    NETWORK,
    [User1Keypair]
  );

  const deployHash = await mintDeploy.send(NODE_ADDRESS);
  console.log('deployHash', deployHash);
}

export async function readCep18Contract() {
  const user1Balance: BigNumber = await cep18Client.balanceOf(User1Keypair.publicKey);
  console.log('user1Balance', user1Balance.toString());

  const adminBalance: BigNumber = await cep18Client.balanceOf(AdminKeypair.publicKey);
  console.log('adminBalance', adminBalance.toString());
}
