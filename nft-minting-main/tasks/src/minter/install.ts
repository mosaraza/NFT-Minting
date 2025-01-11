import { MinterClient } from './client';
import { NETWORK, NODE_ADDRESS, CEP78_CONTRACT } from '../constants';
import { AdminKeypair } from '../accounts';

const minterClient = new MinterClient(NODE_ADDRESS, NETWORK);

export async function installMinterContract() {
  const ADMIN_ACCOUNT_HASH = AdminKeypair.publicKey.toAccountHashStr();

  const deploy = minterClient.install(
    {
      adminAccountHash: ADMIN_ACCOUNT_HASH,
      fundManagerAccountHash: ADMIN_ACCOUNT_HASH,
      cep78PackageHash: CEP78_CONTRACT.packageHash,
      mintFee: 80e9,
      onlyWhitelist: true,
      allowMint: true,
      max_mint: 20,
    },
    AdminKeypair.publicKey,
    [AdminKeypair]
  );

  const deployHash = await deploy.send(NODE_ADDRESS);
  console.log('deployHash', deployHash);
}

export async function upgradeMinterContract() {
  const deploy = minterClient.upgrade(
    {
      disableOld: false,
    },
    AdminKeypair.publicKey,
    [AdminKeypair]
  );

  const deployHash = await deploy.send(NODE_ADDRESS);
  console.log('deployHash', deployHash);
}
