// This code defines an enum for the errors that can occur in the minting contract.
use casper_types::ApiError;

/// An enum for the errors that can occur in the minting contract.
#[derive(Debug)]
#[repr(u16)]
pub enum Error {
    AdminNotSet = 1001,
    InvalidAccountHash = 1002,
    InvalidContext = 1003,
    InvalidContractPackageHash = 1004,
    MintLimitExceed = 1005,
    MintNotAllowed = 1006,
    MissingContractHashForUpgrade = 1007,
    MissingContractPackageHash = 1008,
    MissingPackageHashForUpgrade = 1009,
    NotEnoughBalance = 1010,
    NotWhitelisted = 1011,
    PermissionDenied = 1012,
    UableToReadPurse = 1013,
    WrongArguments = 1014,
}

impl From<Error> for ApiError {
    /// Converts an `Error` to an `ApiError`.
    fn from(error: Error) -> ApiError {
        ApiError::User(error as u16)
    }
}