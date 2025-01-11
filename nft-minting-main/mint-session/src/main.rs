#![no_std]
#![no_main]

#[cfg(not(target_arch = "wasm32"))]
compile_error!("target arch should be wasm32: compile with '--target wasm32-unknown-unknown'");

use casper_contract::{
    contract_api::{account, runtime, system},
    unwrap_or_revert::UnwrapOrRevert,
};
use casper_types::{
    runtime_args,
    RuntimeArgs,
    U512, URef, Key, 
    ContractPackageHash
};

const ARG_NFT_OWMER: &str = "nft_owner";
const ARG_COUNT: &str = "count";
const ARG_AMOUNT: &str = "amount";
const ARG_MINTER_PACKAGE_HASH: &str = "minter_package_hash";
const ARG_SOURCE_PURSE: &str = "source_purse";

const ENTRY_POINT_NATIVE_MINT: &str = "native_mint"; 

fn purse(amount: U512) -> URef {
    let main_purse: URef = account::get_main_purse();
    let secondary_purse: URef = system::create_purse();
    system::transfer_from_purse_to_purse(main_purse, secondary_purse, amount, None)
        .unwrap_or_revert();
    secondary_purse
}

#[no_mangle]
fn call() {
    let nft_owner = runtime::get_named_arg::<Key>(ARG_NFT_OWMER);
    let count = runtime::get_named_arg::<u64>(ARG_COUNT);
    let amount = runtime::get_named_arg::<U512>(ARG_AMOUNT);
    let minter_package_hash: ContractPackageHash = runtime::get_named_arg::<Key>(ARG_MINTER_PACKAGE_HASH)
        .into_hash()
        .map(ContractPackageHash::new)
        .unwrap();

    runtime::call_versioned_contract(
        minter_package_hash,
        None,
        ENTRY_POINT_NATIVE_MINT,
        runtime_args! {
            ARG_NFT_OWMER => nft_owner,
            ARG_COUNT => count,
            ARG_SOURCE_PURSE => purse(amount)
        }
    )
}
