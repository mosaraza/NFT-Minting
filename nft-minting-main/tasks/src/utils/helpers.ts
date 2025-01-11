import { CasperClient, Contracts } from 'casper-js-sdk';

import { NODE_ADDRESS, MINTER_CONTRACT } from '../constants';

export function getCasperClient() {
  return new CasperClient(NODE_ADDRESS);
}

export function getContract(contractHash: string, contractPackageHash: string) {
  const casperClient = getCasperClient();
  const contract = new Contracts.Contract(casperClient);
  contract.setContractHash(contractHash, contractPackageHash);
  return contract;
}

export function getMinterContract() {
  return getContract(MINTER_CONTRACT.contractHash, MINTER_CONTRACT.packageHash);
}
