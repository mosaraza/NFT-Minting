# NFT whitelist minting

Contract for presale NFT (CEP-78) mining on Casper Network, in which owner can charge fees in terms of CSPR Token per NFT. The contract also supports optional whitelisting to allow only whitelisted users to mint NFT.

## Mint Session Code

The minting session code is responsible for charing mint fee in terms of CSPR Tokens from user purse.

## Error Codes

| Code | Error                         |
| ---- | ----------------------------- |
| 1001 | AdminNotSet                   |
| 1002 | InvalidAccountHash            |
| 1003 | InvalidContext                |
| 1004 | InvalidContractPackageHash    |
| 1005 | MintLimitExceed               |
| 1006 | MintNotAllowed                |
| 1007 | MissingContractHashForUpgrade |
| 1008 | MissingContractPackageHash    |
| 1009 | MissingPackageHashForUpgrade  |
| 1010 | NotEnoughBalance              |
| 1011 | NotWhitelisted                |
| 1012 | PermissionDenied              |
| 1013 | UableToReadPurse              |
| 1014 | WrongArguments                |

