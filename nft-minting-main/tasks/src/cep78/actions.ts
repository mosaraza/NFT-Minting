import { CustomCEP78Client } from './client';
import { AdminKeypair, User1Keypair } from '../accounts';
import { NODE_ADDRESS, NETWORK, CEP78_CONTRACT, MINTER_CONTRACT } from '../constants';
import { HashType } from '../utils/input';

const cep78Client = new CustomCEP78Client(NODE_ADDRESS, NETWORK);
cep78Client.setContractHash(CEP78_CONTRACT.contractHash, CEP78_CONTRACT.packageHash);

//caller => only installer
export async function addNewAclWhitelist() {
  const aclWhitelist = [
    { type: HashType.ACCOUNT, hash: AdminKeypair.publicKey.toAccountHashStr() },
    { type: HashType.CONTRACT, hash: MINTER_CONTRACT.packageHash },
    { type: HashType.CONTRACT, hash: MINTER_CONTRACT.contractHash },
  ];

  const aclDeploy = cep78Client.setVariables(
    {
      aclWhitelist,
    },
    (6 * 1e9).toString(),
    AdminKeypair.publicKey,
    [AdminKeypair]
  );

  const deployHash = await aclDeploy.send(NODE_ADDRESS);
  console.log('deployHash', deployHash);
}

export async function readCep78Contract() {
  const [
    collectionName,
    collectionSymbol,
    allowMintingConfig,
    burnModeConfig,
    holderModeConfig,
    identifierModeConfig,
    JSONSchemaConfig,
    metadataKindConfig,
    metadataMutabilityConfig,
    NFTKindConfig,
    ownershipModeConfig,
    whitelistModeConfig,
    numOfMintedTokens,
    tokenTotalSupply,
    reportingMode,
  ] = await Promise.all([
    cep78Client.collectionName(),
    cep78Client.collectionSymbol(),
    cep78Client.getAllowMintingConfig(),
    cep78Client.getBurnModeConfig(),
    cep78Client.getHolderModeConfig(),
    cep78Client.getIdentifierModeConfig(),
    cep78Client.getJSONSchemaConfig(),
    cep78Client.getMetadataKindConfig(),
    cep78Client.getMetadataMutabilityConfig(),
    cep78Client.getNFTKindConfig(),
    cep78Client.getOwnershipModeConfig(),
    cep78Client.getWhitelistModeConfig(),
    cep78Client.numOfMintedTokens(),
    cep78Client.tokenTotalSupply(),
    cep78Client.getReportingModeConfig(),
  ]);

  console.log({
    collectionName,
    collectionSymbol,
    allowMintingConfig,
    burnModeConfig,
    holderModeConfig,
    identifierModeConfig,
    JSONSchemaConfig,
    metadataKindConfig,
    metadataMutabilityConfig,
    NFTKindConfig,
    ownershipModeConfig,
    whitelistModeConfig,
    numOfMintedTokens: numOfMintedTokens.toString(),
    tokenTotalSupply: tokenTotalSupply.toString(),
    reportingMode,
  });
}

export async function nftDataByAccount() {
  const [balance, owner, metadata] = await Promise.all([
    cep78Client.getBalanceOf(User1Keypair.publicKey),
    cep78Client.getOwnerOf('0'),
    cep78Client.getMetadataOf('9'),
  ]);

  console.log({ balance, owner, metadata });
}

export async function whitelistData() {
  const [admin, user1, minterContract] = await Promise.all([
    cep78Client.isAccountWhitelisted(AdminKeypair.publicKey),
    cep78Client.isAccountWhitelisted(User1Keypair.publicKey),
    cep78Client.isContractWhitelisted(MINTER_CONTRACT.packageHash),
  ]);

  console.log({ admin, user1, minterContract });
}
