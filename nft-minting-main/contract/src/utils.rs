use casper_contract::{contract_api::runtime, ext_ffi};
use casper_types::{api_error, bytesrepr::FromBytes, ApiError};

pub fn get_named_arg_size(name: &str) -> Option<usize> {
    let mut arg_size: usize = 0;
    let ret = unsafe {
        ext_ffi::casper_get_named_arg_size(
            name.as_bytes().as_ptr(),
            name.len(),
            &mut arg_size as *mut usize,
        )
    };
    match api_error::result_from(ret) {
        Ok(_) => Some(arg_size),
        Err(ApiError::MissingArgument) => None,
        Err(e) => runtime::revert(e),
    }
}

pub fn get_optional_named_arg<T: FromBytes>(name: &str) -> Option<T> {
    if let Some(arg_size) = get_named_arg_size(name) {
        if arg_size > 0 {
            return Some(runtime::get_named_arg::<T>(name));
        }
    }
    None
}