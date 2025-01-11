export enum Network {
  LOCAL = 'casper-net-1',
  TEST = 'casper-test',
  MAIN = 'casper',
}

const NodeAddress: Record<Network, string> = {
  [Network.LOCAL]: 'http://localhost:11101',
  [Network.TEST]: `https://testnet.casper.validationcloud.io/v1/${process.env.VALIDATION_CLOUD_KEY}`,
  [Network.MAIN]: `https://mainnet.casper.validationcloud.io/v1/${process.env.VALIDATION_CLOUD_KEY_MAIN}`,
};

const CEP78Contract = {
  [Network.LOCAL]: {
    contractHash: 'hash-100f84e65b6918d896c5fc45870551e5373663107dc361e3356ac6997a3e7700',
    packageHash: 'hash-8f86deb1ac694d81270becf7301f4f073704b133acbf0561f2fe6278aa813a3c',
  },
  [Network.TEST]: {
    contractHash: 'hash-54feec16c4dfeaffd3dcbda008e9c820db69c22d4717c91f5937fd25bcc3d4ad',
    packageHash: 'hash-a12aee42d59ce868fd2d6d49c77f281fc7f7281151edd569b4511f0af4db8f42',
  },
  [Network.MAIN]: {
    contractHash: '',
    packageHash: '',
  },
};

const MinterContract = {
  [Network.LOCAL]: {
    contractHash: 'hash-1b349329cda30830cb64564c1ee534c6dfe58c8e149886f3541c6c6f547c25fd',
    packageHash: 'hash-fafd7ffb4edccaa4565192075ac81fdeeffe8690636e2ef211f4cc1a28a64725',
  },
  [Network.TEST]: {
    contractHash: 'hash-cdd3e3c7f4d54795d25abbf77c217e36b8550ff941a316df0898724b98e644ef',
    packageHash: 'hash-ecf3bf7a4766c0c9e639b47fef132e482377227904e3882ed4b03b588420ed8d',
  },
  [Network.MAIN]: { contractHash: '', packageHash: '' },
};

const WETHContract = {
  [Network.LOCAL]: {
    contractHash: 'hash-80167344b3d4e90259ecd9335cbd229ee4949cc98e46a1ca4b7f4286c0a17704',
    packageHash: 'hash-9e27c61a5f0fe5cbcf4a487610fbc03b3fb8b33c671604d3dbe172a4d500bc26',
  },
  [Network.TEST]: { contractHash: '', packageHash: '' },
  [Network.MAIN]: { contractHash: '', packageHash: '' },
};

export const NETWORK = process.env.NETWORK as Network;

export const NODE_ADDRESS = NodeAddress[NETWORK];
export const CEP78_CONTRACT = CEP78Contract[NETWORK];
export const MINTER_CONTRACT = MinterContract[NETWORK];
export const WETH_CONTRACT = WETHContract[NETWORK];
