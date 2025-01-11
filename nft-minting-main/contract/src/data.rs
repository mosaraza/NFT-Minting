use casper_contract::{contract_api::runtime, unwrap_or_revert::UnwrapOrRevert};
use casper_types::{Key, U256};
use contract_utils::{Dict, set_key, get_key};

pub const NAMED_KEY_ADMIN: &str = "admin";
pub const NAMED_KEY_FUND_MANAGER: &str = "fund_manager";
pub const NAMED_KEY_MINT_FEE: &str = "mint_fee";
pub const NAMED_KEY_CEP78_PACKAGE_HASH: &str = "cep78_package_hash";
pub const NAMED_KEY_MINT_COUNT: &str = "mint_count";
pub const NAMED_KEY_MAX_MIN: &str  = "max_mint";
pub const NAMED_KEY_WHITELIST_DICT: &str = "whitelist_dict";
pub const NAMED_KEY_ONLY_WHITELIST: &str  = "only_whitelist";
pub const NAMED_KEY_ALLOW_MINT: &str  = "allow_mint";

pub const NAMED_KEY_MINTER_CONTRACT_HASH: &str = "minter_contract_hash";
pub const NAMED_KEY_MINTER_CONTRACT_PACKAGE_HASH: &str = "minter_contract_package_hash";

pub struct Whitelist {
    dict: Dict,
}

impl Whitelist {
    pub fn instance() -> Whitelist {
        Whitelist {
            dict: Dict::instance(NAMED_KEY_WHITELIST_DICT),
        }
    }

    pub fn init() {
        Dict::init(NAMED_KEY_WHITELIST_DICT)
    }

    pub fn reset() {
        runtime::remove_key(NAMED_KEY_WHITELIST_DICT);
        Whitelist::init();
    }

    pub fn get(&self, account: &Key) -> bool {
        self.dict
            .get_by_key(account)
            .unwrap_or(false)
    }

    pub fn set(&self, account: &Key, value: bool) {
        self.dict.set_by_key(account, value);
    }
 
}

pub fn set_admin(admin: Key) {
    set_key(NAMED_KEY_ADMIN, admin);
}

pub fn get_admin() -> Key {
    get_key(NAMED_KEY_ADMIN).unwrap_or_revert()
}

pub fn set_fund_manager(fund_manager: Key) {
    set_key(NAMED_KEY_FUND_MANAGER, fund_manager);
}

pub fn get_fund_manager() -> Key {
    get_key(NAMED_KEY_FUND_MANAGER).unwrap_or_revert()
}

pub fn set_mint_fee(mint_fee:U256) {
    set_key(NAMED_KEY_MINT_FEE, mint_fee);
}

pub fn get_mint_fee() -> U256 {
    get_key(NAMED_KEY_MINT_FEE).unwrap_or_revert()
}

pub fn set_cep78_package_hash(cep78_package_hash: Key) {
    set_key(NAMED_KEY_CEP78_PACKAGE_HASH, cep78_package_hash);
}

pub fn get_cep78_package_hash() -> Key {
    get_key(NAMED_KEY_CEP78_PACKAGE_HASH).unwrap_or_revert()
}

pub fn set_mint_count(mint_count: u64) {
    set_key(NAMED_KEY_MINT_COUNT, mint_count);
}

pub fn get_mint_count() -> u64 {
    get_key(NAMED_KEY_MINT_COUNT).unwrap_or_revert()
}

pub fn set_max_mint(max_mint: u64) {
    set_key(NAMED_KEY_MAX_MIN, max_mint);
}

pub fn get_max_mint() -> u64 {
    get_key(NAMED_KEY_MAX_MIN).unwrap_or_revert()
}

pub fn set_only_whitelist(only_whitelist: bool) {
    set_key(NAMED_KEY_ONLY_WHITELIST, only_whitelist);
}

pub fn get_only_whitelist() -> bool {
    get_key(NAMED_KEY_ONLY_WHITELIST).unwrap_or_revert()
}

pub fn set_allow_mint(allow_mint: bool) {
    set_key(NAMED_KEY_ALLOW_MINT, allow_mint);
}

pub fn get_allow_mint() -> bool {
    get_key(NAMED_KEY_ALLOW_MINT).unwrap_or_revert()
}