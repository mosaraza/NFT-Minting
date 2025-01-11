import { BigNumberish } from '@ethersproject/bignumber';

export type InstallArg = {
  adminAccountHash: string;
  fundManagerAccountHash: string;
  cep78PackageHash: string;
  mintFee: BigNumberish;
  onlyWhitelist: boolean;
  allowMint: boolean;
  max_mint: BigNumberish;
};

export type UpgradeArg = {
  disableOld: boolean;
};

export type SetConfigArgs = {
  adminAccountHash?: string;
  fundManagerAccountHash?: string;
  mintFee?: BigNumberish;
  onlyWhitelist?: boolean;
  allowMint?: boolean;
  maxMint?: BigNumberish;
};

export type FreeMintArgs = {
  nftOwnerAccountHash: string;
  nftCount: BigNumberish;
};

export type NativeMintArgs = FreeMintArgs & {
  minterPackageHash: string;
  amount: BigNumberish;
};

export type SetWhitelistArgs = {
  users: Array<{ accountHash: string; value: boolean }>;
};
