# code injection
sed -i -e $'s/var randomBytes = require(\'randombytes\')*/var randomBytes = require(\'crypto\').randomBytes/g' ./node_modules/bip39/index.js
sed -i -e $'s/exports.ext_/exports./g' ./node_modules/@polkadot/wasm-crypto/wasm_asm.js
sed -i -e $'s/_wasmCrypto.default/_wasmCrypto/g' ./node_modules/@polkadot/util-crypto/index.js
