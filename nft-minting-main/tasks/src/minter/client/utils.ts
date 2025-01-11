import fs from 'fs';
import path from 'path';

export function getWASM(wasmPath: string) {
  const wasmFile = path.resolve(__dirname, wasmPath);
  return new Uint8Array(fs.readFileSync(wasmFile).buffer);
}

export const MINTER_CONTRACT_WASM = getWASM(
  '../../../../contract/target/wasm32-unknown-unknown/release/contract.wasm'
);

export const MINT_SESSION_WASM = getWASM(
  '../../../../mint-session/target/wasm32-unknown-unknown/release/public_mint_call.wasm'
);

function toMotes(csprs: number) {
  return (csprs * 1e9).toString();
}

export const GAS = {
  INSTALL: toMotes(140),
  FREE_MINT: toMotes(10000),
  NATIVE_MINT: toMotes(85),
  SET_WHITELIST: toMotes(2),
  SET_CONFIG: toMotes(20),
};
