import { CLValueBuilder, CLAccountHash, CLKey, CLByteArray } from 'casper-js-sdk';

export enum HashType {
  ACCOUNT = 0,
  CONTRACT = 1,
}

export function hashToUnit8Array(type: HashType, hash: string) {
  const sliceLength = type === HashType.ACCOUNT ? 13 : 5;
  return Uint8Array.from(Buffer.from(hash.slice(sliceLength), 'hex'));
}

export function accHashToKey(accountHash: string): CLKey {
  const accountHashBytes = hashToUnit8Array(HashType.ACCOUNT, accountHash);
  return CLValueBuilder.key(new CLAccountHash(accountHashBytes));
}

export function hashToKey(hash: string): CLKey {
  const hashBytes = hashToUnit8Array(HashType.CONTRACT, hash);
  return CLValueBuilder.key(new CLByteArray(hashBytes));
}
