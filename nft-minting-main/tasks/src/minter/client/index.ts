import {
  CasperClient,
  Contracts,
  CLByteArray,
  CLPublicKey,
  CLPublicKeyTag,
  CLValueBuilder,
  Keys,
  RuntimeArgs,
  CLKey,
  CLBool,
} from 'casper-js-sdk';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';

import {
  InstallArg,
  UpgradeArg,
  FreeMintArgs,
  NativeMintArgs,
  SetWhitelistArgs,
  SetConfigArgs,
} from './types';
import { MINTER_CONTRACT_WASM, MINT_SESSION_WASM, GAS } from './utils';
import { accHashToKey, hashToKey } from '../../utils/input';

export class MinterClient {
  private casperClient: CasperClient;

  public contractClient: Contracts.Contract;

  constructor(
    public nodeAddress: string,
    public networkName: string
  ) {
    this.casperClient = new CasperClient(nodeAddress);
    this.contractClient = new Contracts.Contract(this.casperClient);
  }

  public setContractHash(contractHash: string, contractPackageHash?: string) {
    this.contractClient.setContractHash(contractHash, contractPackageHash);
  }

  public install(args: InstallArg, deploySender: CLPublicKey, keys: Keys.AsymmetricKey[]) {
    const runtimeArgs = RuntimeArgs.fromMap({
      admin: accHashToKey(args.adminAccountHash),
      fund_manager: accHashToKey(args.fundManagerAccountHash),
      cep78_package_hash: hashToKey(args.cep78PackageHash),
      mint_fee: CLValueBuilder.u256(args.mintFee),
      only_whitelist: CLValueBuilder.bool(args.onlyWhitelist),
      allow_mint: CLValueBuilder.bool(args.allowMint),
      max_mint: CLValueBuilder.u64(args.max_mint),
      name: CLValueBuilder.string('BAYC'),
      disable_old: CLValueBuilder.bool(false),
    });

    return this.contractClient.install(
      MINTER_CONTRACT_WASM,
      runtimeArgs,
      GAS.INSTALL,
      deploySender,
      this.networkName,
      keys
    );
  }

  public upgrade(args: UpgradeArg, deploySender: CLPublicKey, keys: Keys.AsymmetricKey[]) {
    const runtimeArgs = RuntimeArgs.fromMap({
      name: CLValueBuilder.string('BAYC'),
      disable_old: CLValueBuilder.bool(args.disableOld),
    });

    return this.contractClient.install(
      MINTER_CONTRACT_WASM,
      runtimeArgs,
      GAS.INSTALL,
      deploySender,
      this.networkName,
      keys
    );
  }

  public setConfig(args: SetConfigArgs, deploySender: CLPublicKey, keys: Keys.AsymmetricKey[]) {
    const runtimeArgs = RuntimeArgs.fromMap({});

    if (args.adminAccountHash) {
      runtimeArgs.insert('admin', accHashToKey(args.adminAccountHash));
    }

    if (args.fundManagerAccountHash) {
      runtimeArgs.insert('fund_manager', accHashToKey(args.adminAccountHash));
    }

    if (args.mintFee) {
      runtimeArgs.insert('mint_fee', CLValueBuilder.u256(args.mintFee));
    }

    if (args.onlyWhitelist) {
      runtimeArgs.insert('only_whitelist', CLValueBuilder.bool(args.onlyWhitelist));
    }

    if (args.allowMint) {
      runtimeArgs.insert('allow_mint', CLValueBuilder.bool(args.allowMint));
    }

    if (args.maxMint) {
      runtimeArgs.insert('max_mint', CLValueBuilder.u64(args.maxMint));
    }

    return this.contractClient.callEntrypoint(
      'set_config',
      runtimeArgs,
      deploySender,
      this.networkName,
      GAS.SET_CONFIG,
      keys
    );
  }

  public freeMint(args: FreeMintArgs, deploySender: CLPublicKey, keys: Keys.AsymmetricKey[]) {
    const runtimeArgs = RuntimeArgs.fromMap({
      nft_owner: accHashToKey(args.nftOwnerAccountHash),
      count: CLValueBuilder.u64(args.nftCount),
    });

    return this.contractClient.callEntrypoint(
      'free_mint',
      runtimeArgs,
      deploySender,
      this.networkName,
      GAS.FREE_MINT,
      keys
    );
  }

  public nativeMint(args: NativeMintArgs, deploySender: CLPublicKey, keys: Keys.AsymmetricKey[]) {
    const runtimeArgs = RuntimeArgs.fromMap({
      nft_owner: accHashToKey(args.nftOwnerAccountHash),
      count: CLValueBuilder.u64(args.nftCount),
      minter_package_hash: hashToKey(args.minterPackageHash),
      amount: CLValueBuilder.u512(args.amount),
    });

    return this.contractClient.install(
      MINT_SESSION_WASM,
      runtimeArgs,
      GAS.NATIVE_MINT,
      deploySender,
      this.networkName,
      keys
    );
  }

  public whitelist(
    entryPoint: 'set_whitelist' | 'reset_whitelist',
    args: SetWhitelistArgs,
    deploySender: CLPublicKey,
    keys: Keys.AsymmetricKey[]
  ) {
    const { accounts, values } = args.users.reduce<{
      accounts: Array<CLKey>;
      values: Array<CLBool>;
    }>(
      (accum, { accountHash, value }) => {
        accum['accounts'] = accum['accounts'].concat(accHashToKey(accountHash));
        accum['values'] = accum['values'].concat(CLValueBuilder.bool(value));
        return accum;
      },
      { accounts: [], values: [] }
    );

    const runtimeArgs = RuntimeArgs.fromMap({
      whitelist_accounts: CLValueBuilder.list(accounts),
      whitelist_values: CLValueBuilder.list(values),
    });

    return this.contractClient.callEntrypoint(
      entryPoint,
      runtimeArgs,
      deploySender,
      this.networkName,
      GAS.SET_WHITELIST,
      keys
    );
  }

  public async admin() {
    const raw: CLByteArray = await this.contractClient.queryContractData(['admin']);
    const accountHash = new CLPublicKey(raw.data, CLPublicKeyTag.ED25519).toAccountHashStr();
    return { accountHash, raw };
  }

  public async fundManager() {
    const raw: CLByteArray = await this.contractClient.queryContractData(['fund_manager']);
    const accountHash = new CLPublicKey(raw.data, CLPublicKeyTag.ED25519).toAccountHashStr();
    return { accountHash, raw };
  }

  public async cep78PackageHash() {
    const raw: CLByteArray = await this.contractClient.queryContractData(['cep78_package_hash']);
    const hash = new CLPublicKey(raw.data, CLPublicKeyTag.ED25519).toHex();
    return { hash, raw };
  }

  public mintFee(): Promise<BigNumber> {
    return this.contractClient.queryContractData(['mint_fee']);
  }

  public mintCount(): Promise<BigNumber> {
    return this.contractClient.queryContractData(['mint_count']);
  }

  public maxMint(): Promise<BigNumber> {
    return this.contractClient.queryContractData(['max_mint']);
  }

  public onlyWhitelist(): Promise<Boolean> {
    return this.contractClient.queryContractData(['only_whitelist']);
  }

  public allowMint(): Promise<Boolean> {
    return this.contractClient.queryContractData(['allow_mint']);
  }

  public async isWhitelisted(accountHash: string): Promise<Boolean> {
    try {
      const isWhitelisted = await this.contractClient.queryContractDictionary(
        'whitelist_dict',
        accountHash.slice(13)
      );
      return isWhitelisted.data.val.data;
    } catch {
      return false;
    }
  }

  public async getMintCost(count: BigNumberish): Promise<BigNumber> {
    const mintFee = await this.mintFee();
    return mintFee.mul(count);
  }
}
