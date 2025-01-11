import { config } from 'dotenv';
config();

import fs from 'fs';

import { installMinterContract, upgradeMinterContract } from './minter/install';
import {
  freeMint,
  setConfig,
  nativeMint,
  setWhitelist,
  readMinterContract,
  isAccWhitelistedToMint,
} from './minter/actions';

import { installCep78 } from './cep78/install';
import {
  addNewAclWhitelist,
  readCep78Contract,
  whitelistData,
  nftDataByAccount,
} from './cep78/actions';

import { MINT_SESSION_WASM } from './minter/client/utils';

import { AdminKeypair, User1Keypair } from './accounts';

async function main() {
  //cep78
  // await installCep78();
  // await addNewAclWhitelist();
  // await readCep78Contract();
  // await whitelistData();
  // await nftDataByAccount();
  //minter
  // await installMinterContract();
  // await upgradeMinterContract();
  // await setWhitelist();
  // await setConfig();
  await nativeMint();
  // await freeMint();
  // await readMinterContract();
  // await isAccWhitelistedToMint();
  // console.log(MINT_SESSION_WASM);
  // console.log(AdminKeypair.publicKey.toHex());
  // console.log(User1Keypair.publicKey.toAccountHashStr());
}

main();
