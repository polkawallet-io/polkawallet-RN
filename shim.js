process.browser = true

if (typeof global.Buffer !== 'undefined') {
  // running on VSCode debugger
  global.Buffer = undefined
}

require('crypto')

const asm = require('@polkadot/wasm-crypto/wasm_asm')
asm.isReady = () => true
asm.waitReady = () => new Promise.resolve(true)
