use casper_types::{Key, URef, U512};
use casper_contract::{contract_api::system, unwrap_or_revert::UnwrapOrRevert};

use crate::cep78_utils;
use crate::data::{self, Whitelist};
use crate::error::Error;

/// Checks if the caller is admin.
///
/// # Arguments
///
/// * `caller`: The key of caller.
///
/// # Returns
///
/// A `Result`. If the caller is admin, the result will be `Ok(())`.
pub fn only_admin(caller: Key) -> Result<(), Error> {
    if caller != data::get_admin() {
        return Err(Error::PermissionDenied);
    }
    Ok(())
}

/// Checks if the minting is allowed.
///
/// # Returns
///
/// A `Result`. If the minting is allowed, the result will be `Ok(())`.
pub fn mint_allowed() -> Result<(), Error> {
    if !data::get_allow_mint() {
        return Err(Error::MintNotAllowed);
    }
    Ok(())
}

/// Checks if the NFT owner max NFT holding exceeds.
///
/// # Arguments
///
/// * `nft_owner`: The key of NFT owner.
/// * `count`: The number of NFTs owner want to mint.
///
/// # Returns
///
/// A `Result`. If the limit of NFT holding not exceed, the result will be `Ok(())`.
pub fn limited_mint(nft_owner: Key, count: u64) -> Result<(), Error> {
    let mut owner_holding = cep78_utils::balance_of(nft_owner);
    owner_holding += count;
    if owner_holding > data::get_max_mint() {
        return Err(Error::MintLimitExceed);
    }
    Ok(())
}

/// Checks if the account is whitelisted for minting.
///
/// # Arguments
///
/// * `account`: The key of NFT owner.
///
/// # Returns
///
/// A `Result`. If the account is whitelisted, the result will be `Ok(())`.
pub fn valid_account(account: Key) -> Result<(), Error> {
    if data::get_only_whitelist() {
        let whitelist = Whitelist::instance();
        if !whitelist.get(&account) {
            return Err(Error::NotWhitelisted);
        }
    }
    Ok(())
}

/// Checks if the purse hold enough CSPR tokens.
///
/// # Arguments
///
/// * `amount`: The required amount that the purse should have.
/// * `purse`: The purse URef.
///
/// # Returns
///
/// A `Result`. If the purse have required balance, the result will be `Ok(())`.
pub fn enough_native_balance(amount: U512, purse: URef) -> Result<(), Error> {
    let balance = system::get_purse_balance(purse).unwrap_or_revert_with(Error::UableToReadPurse);
    if amount > balance {
        return Err(Error::NotEnoughBalance);
    }
    Ok(())
}