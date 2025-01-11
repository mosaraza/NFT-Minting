import { CEP18Client } from 'casper-cep18-js-client';
import path from 'path';
import fs from 'fs';

import { User1Keypair } from '../accounts';
import { NODE_ADDRESS, NETWORK } from '../constants';

const CEP78_CONTRACT_WASM = path.resolve(__dirname, './contract/contract.wasm');

const cep78Client = new CEP18Client(NODE_ADDRESS, NETWORK);
const contractWasm = new Uint8Array(fs.readFileSync(CEP78_CONTRACT_WASM).buffer);

export async function installCep18() {
  const installDeploy = cep78Client.install(
    contractWasm,
    {
      name: 'Wrapped Eth',
      decimals: 9,
      symbol: 'WETH',
      totalSupply: (200 * 1e9).toString(),
      enableMintAndBurn: true,
    },
    (600 * 1e9).toString(),
    User1Keypair.publicKey,
    NETWORK,
    [User1Keypair]
  );

  const deployHash = await installDeploy.send(NODE_ADDRESS);
  console.log('deployHash', deployHash);
}
