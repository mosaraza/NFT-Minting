import { RuntimeArgs, CLValueBuilder } from 'casper-js-sdk';
import { CEP78Client, ConfigurableVariables } from 'casper-cep78-js-client';
import { CLPublicKey } from 'casper-js-sdk';
import { AsymmetricKey } from 'casper-js-sdk/dist/lib/Keys';
import { Deploy } from 'casper-js-sdk/dist/lib/DeployUtil';

import { HashType, accHashToKey, hashToKey } from '../utils/input';

type CustomConfigurableVariables = ConfigurableVariables & {
  aclWhitelist?: Array<{ type: HashType; hash: string }>;
};

export class CustomCEP78Client extends CEP78Client {
  constructor(
    public nodeAddress: string,
    public networkName: string
  ) {
    super(nodeAddress, networkName);
  }

  private async isWhitelisted(type: HashType, hash: string): Promise<boolean> {
    try {
      const result = await this.contractClient.queryContractDictionary(
        'acl_whitelist',
        hash.slice(type === HashType.ACCOUNT ? 13 : 5)
      );
      return result.data;
    } catch {
      return false;
    }
  }

  public isAccountWhitelisted(account: CLPublicKey) {
    return this.isWhitelisted(HashType.ACCOUNT, account.toAccountHashStr());
  }

  public isContractWhitelisted(contract: string) {
    return this.isWhitelisted(HashType.CONTRACT, contract);
  }

  public setVariables(
    args: CustomConfigurableVariables,
    paymentAmount: string,
    deploySender: CLPublicKey,
    keys?: AsymmetricKey[]
  ): Deploy {
    if (args.allowMinting || args.contractWhitelist) {
      return super.setVariables(args, paymentAmount, deploySender, keys);
    }

    const runtimeArgs = RuntimeArgs.fromMap({});

    if (args.aclWhitelist !== undefined) {
      const value = CLValueBuilder.list(
        args.aclWhitelist.map(acl =>
          acl.type === HashType.ACCOUNT ? accHashToKey(acl.hash) : hashToKey(acl.hash)
        )
      );
      runtimeArgs.insert('acl_whitelist', value);
    }

    const preparedDeploy = this.contractClient.callEntrypoint(
      'set_variables',
      runtimeArgs,
      deploySender,
      this.networkName,
      paymentAmount,
      keys
    );

    return preparedDeploy;
  }
}
