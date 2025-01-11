import { MinterClient } from './client';
import { NETWORK, NODE_ADDRESS, MINTER_CONTRACT } from '../constants';
import { AdminKeypair, User1Keypair } from '../accounts';

const minterClient = new MinterClient(NODE_ADDRESS, NETWORK);
minterClient.setContractHash(MINTER_CONTRACT.contractHash, MINTER_CONTRACT.packageHash);

//only admin
export async function setWhitelist() {
  const users = [
    {
      accountHash: User1Keypair.publicKey.toAccountHashStr(),
      value: true,
    },
    {
      accountHash: 'account-hash-d6aacbe25dffddbde464bf53cd663a63821b1796e72e980bdbf5b1eae7935bfe',
      value: true,
    },
    {
      accountHash: 'account-hash-b0d9133bcafa2340a67e08b8776bee58a76855347b53f13123fc1bc4feb507c1',
      value: true,
    },
    {
      accountHash: 'account-hash-0edef6ff850f4ca98ba4d2889a9e33d2c5b7e601a32b9aa7332299aaa69ebcbd',
      value: true,
    },
    {
      accountHash: 'account-hash-0852813808922eff2ffc7bd5ff639bad6d59cec694ad55b89acbf2f04bbe4c4c',
      value: true,
    },
    {
      accountHash: 'account-hash-7b16ac8cb4d7f038e4f407df44dd2c46697f3f9053170f49e35e877c1ca12f38',
      value: true,
    },
    {
      accountHash: 'account-hash-f65a97541eb321b5090f500effbba6e586b4711aef30ba33c7a648d709be49d3',
      value: true,
    },
    {
      accountHash: 'account-hash-9b5307b34b3928a3351cfe7d4fee4636eb1452cece1bda681d455e181b186536',
      value: true,
    },
    {
      accountHash: 'account-hash-1dc555fb71b297f1ffa4ba445b340d24c5daca3a20c67b0c6740f762f94e1aaa',
      value: true,
    },
    {
      accountHash: 'account-hash-62adbef1ae716b55daf469948793707bfb3855a1e164cde0f96df3ee1d2f168d',
      value: true,
    },
  ];

  const deploy = minterClient.whitelist('set_whitelist', { users }, AdminKeypair.publicKey, [
    AdminKeypair,
  ]);

  const deployHash = await deploy.send(NODE_ADDRESS);
  console.log('deployHash', deployHash);
}

//only admin
export async function setConfig() {
  const deploy = minterClient.setConfig(
    { adminAccountHash: User1Keypair.publicKey.toAccountHashStr() },
    AdminKeypair.publicKey,
    [AdminKeypair]
  );

  const deployHash = await deploy.send(NODE_ADDRESS);
  console.log('deployHash', deployHash);
}

//only admin
export async function freeMint() {
  const deploy = minterClient.freeMint(
    {
      nftOwnerAccountHash: User1Keypair.publicKey.toAccountHashStr(),
      nftCount: 1000,
    },
    AdminKeypair.publicKey,
    [AdminKeypair]
  );
  const deployHash = await deploy.send(NODE_ADDRESS);
  console.log('deployHash', deployHash);
}

export async function nativeMint() {
  const NFT_COUNT = 3;
  const mintCost = await minterClient.getMintCost(NFT_COUNT);
  const deploy = minterClient.nativeMint(
    {
      nftOwnerAccountHash: User1Keypair.publicKey.toAccountHashStr(),
      nftCount: NFT_COUNT,
      minterPackageHash: MINTER_CONTRACT.packageHash,
      amount: mintCost,
    },
    User1Keypair.publicKey,
    [User1Keypair]
  );
  const deployHash = await deploy.send(NODE_ADDRESS);
  console.log('deployHash', deployHash);
}

export async function readMinterContract() {
  const [
    admin,
    fundManager,
    cep78PackageHash,
    mintFee,
    mintCount,
    onlyWhitelist,
    allowMint,
    maxMint,
  ] = await Promise.all([
    minterClient.admin(),
    minterClient.fundManager(),
    minterClient.cep78PackageHash(),
    minterClient.mintFee(),
    minterClient.mintCount(),
    minterClient.onlyWhitelist(),
    minterClient.allowMint(),
    minterClient.maxMint(),
  ]);

  console.log({
    admin: admin.accountHash,
    fundManager: fundManager.accountHash,
    cep78PackageHash: cep78PackageHash.hash,
    mintFee: mintFee.toString(),
    mintCount: mintCount.toString(),
    onlyWhitelist,
    allowMint,
    maxMint: maxMint.toString(),
  });
}

export async function isAccWhitelistedToMint() {
  const [admin, user1] = await Promise.all([
    minterClient.isWhitelisted(AdminKeypair.publicKey.toAccountHashStr()),
    minterClient.isWhitelisted(User1Keypair.publicKey.toAccountHashStr()),
  ]);

  console.log('whitelisted => ', { admin, user1 });
}
