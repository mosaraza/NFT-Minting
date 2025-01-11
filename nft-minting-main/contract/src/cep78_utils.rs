use alloc::{format, string::String};
use casper_contract::{contract_api::runtime, unwrap_or_revert::UnwrapOrRevert};
use casper_types::{ContractPackageHash, Key, RuntimeArgs, URef, runtime_args};

use crate::data;
use crate::error::Error;

fn get_cep78_package_hash() -> ContractPackageHash {
    data::get_cep78_package_hash()
        .into_hash()
        .map(ContractPackageHash::new)
        .unwrap_or_revert_with(Error::InvalidContractPackageHash)
}

fn generate_metadata(count: u64) -> String {
    format!(r#"{{ 
        "name": "BoredApeYachtClub", 
        "symbol": "BAYC", 
        "token_uri": "ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/{}" 
    }}"#, count)
}

pub fn balance_of(nft_owner: Key) -> u64 {
    let cep78_package_hash = get_cep78_package_hash();

    let balance = runtime::call_versioned_contract::<u64>(
        cep78_package_hash, 
        None, 
        "balance_of", 
        runtime_args! {
            "token_owner" => nft_owner,
        }
    );

    return balance;
}

pub fn mint(nft_owner: Key, mint_count:u64) {
    let cep78_package_hash = get_cep78_package_hash();

    runtime::call_versioned_contract::<(String, URef)>(
        cep78_package_hash, 
        None, 
        "register_owner", 
        runtime_args! {
            "token_owner" => nft_owner,
        }
    );

    runtime::call_versioned_contract::<(String, Key, String)>(
        cep78_package_hash, 
        None, 
        "mint", 
        runtime_args! {
            "token_owner" => nft_owner,
            "token_meta_data" => generate_metadata(mint_count)
        }
    );
}