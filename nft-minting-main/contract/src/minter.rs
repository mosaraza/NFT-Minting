use alloc::vec::Vec;
use casper_contract::contract_api::system;
use casper_contract::unwrap_or_revert::UnwrapOrRevert;
use casper_types::{account::AccountHash, Key, URef, U256, U512};
use contract_utils::{ContractStorage, ContractContext};

use crate::cep78_utils;
use crate::data::{self, Whitelist};
use crate::error::Error;
use crate::modifiers;

pub trait MINTER<Storage: ContractStorage>: ContractContext<Storage> {
    fn init(
        &self, 
        admin: Key, 
        fund_manager: Key, 
        cep78_package_hash: Key,
        mint_fee: U256,
        only_whitelist: bool,
        allow_mint: bool,
        max_mint: u64
    )  {
        data::set_admin(admin);
        data::set_fund_manager(fund_manager);
        data::set_cep78_package_hash(cep78_package_hash);
        data::set_mint_fee(mint_fee);
        data::set_mint_count(0u64);
        data::set_only_whitelist(only_whitelist);
        data::set_allow_mint(allow_mint);
        data::set_max_mint(max_mint);
        Whitelist::init();
    }

    fn set_config(
        &self, 
        admin: Option<Key>,
        fund_manager: Option<Key>, 
        mint_fee: Option<U256>,
        only_whitelist: Option<bool>,
        allow_mint: Option<bool>,
        max_mint: Option<u64>,
    ) -> Result<(), Error> {
        modifiers::only_admin(self.get_caller())?;
        if let Some(admin) = admin {
            data::set_admin(admin);
        }
        if let Some(fund_manager) = fund_manager {
            data::set_fund_manager(fund_manager);
        }
        if let Some(mint_fee) = mint_fee {
            data::set_mint_fee(mint_fee);
        }
        if let Some(only_whitelist) = only_whitelist {
            data::set_only_whitelist(only_whitelist);
        }
        if let Some(allow_mint) = allow_mint {
            data::set_allow_mint(allow_mint);
        }
        if let Some(max_mint) = max_mint {
            data::set_max_mint(max_mint);
        }
        Ok(())
    }

    fn set_whitelist(&self, accounts: Vec<Key>, values: Vec<bool>) -> Result<(), Error> {
        modifiers::only_admin(self.get_caller())?;
        let whitelist = Whitelist::instance();
        for (key, &value) in accounts.iter().zip(values.iter()) {
            whitelist.set(key, value);
        }
        Ok(())
    }

    fn reset_whitelist(&self, accounts: Vec<Key>, values: Vec<bool>) -> Result<(), Error> {
        modifiers::only_admin(self.get_caller())?;
        Whitelist::reset();
        self.set_whitelist(accounts, values)?;
        Ok(())
    }

    fn get_mint_cost(&self, count: u64) -> U256 {
        data::get_mint_fee()
         .checked_mul(U256::try_from(count).unwrap())
         .unwrap()
     }

    fn mint_nft(&self,  nft_owner: Key, count: u64) -> Result<(), Error> {
        let mut mint_count = data::get_mint_count();
        for _ in 0..count {
            cep78_utils::mint(nft_owner, mint_count);
            mint_count += 1;
        }
        data::set_mint_count(mint_count);
        Ok(())
    }

    fn free_mint(&self,  nft_owner: Key, count: u64) -> Result<(), Error> {
        modifiers::only_admin(self.get_caller())?;
        self.mint_nft(nft_owner, count)?;
        Ok(())
    }

    fn native_mint(&self, nft_owner: Key, count: u64, source_purse: URef) -> Result<(), Error> {
        modifiers::mint_allowed()?;
        modifiers::valid_account(nft_owner)?;
        modifiers::limited_mint(nft_owner, count)?;

        let amount = U512::try_from(self.get_mint_cost(count).as_u128()).unwrap();
        modifiers::enough_native_balance(amount, source_purse)?;

        system::transfer_from_purse_to_account(
            source_purse,
            get_fund_manager(), 
            amount,
            None
        ).unwrap_or_revert();

        self.mint_nft(nft_owner, count)?;
        Ok(())
    }
}

fn get_fund_manager() -> AccountHash {
    data::get_fund_manager()
    .into_account()
    .unwrap_or_revert_with(Error::InvalidAccountHash)
}
