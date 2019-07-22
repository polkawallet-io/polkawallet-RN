/* eslint-disable new-cap */
/* eslint-disable no-undef */
let _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

let _types = require('@polkadot/types')

let _index = _interopRequireDefault(require('@polkadot/rpc-provider/mock/index'))

let _ = require('@polkadot/api')

// Copyright 2017-2019 @polkadot/api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

describe.skip('Metadata queries', () => {
  let mock
  beforeEach(() => {
    jest.setTimeout(3000000)
    mock = new _index.default()
  })
  it('Create API instance with metadata map and makes the runtime, rpc, state & extrinsics available', async () => {
    const rpcData = await mock.send('state_getMetadata', [])
    const genesisHash = new _types.Hash(await mock.send('chain_getBlockHash', [])).toHex()
    const specVersion = 0
    const metadata = {}
    const key = ''.concat(genesisHash, '-').concat(specVersion)
    metadata[key] = rpcData
    const api = await _.ApiPromise.create({
      provider: mock,
      metadata
    })
    expect(api.genesisHash).toBeDefined()
    expect(api.runtimeMetadata.toJSON()).toEqual(new _types.Metadata(rpcData).toJSON())
    expect(api.runtimeVersion).toBeDefined()
    expect(api.rpc).toBeDefined()
    expect(api.query).toBeDefined()
    expect(api.tx).toBeDefined()
    expect(api.derive).toBeDefined()
  })
  it('Create API instance without metadata and makes the runtime, rpc, state & extrinsics available', async () => {
    const metadata = {}
    const api = await _.ApiPromise.create({
      provider: mock,
      metadata
    })
    expect(api.genesisHash).toBeDefined()
    expect(api.runtimeMetadata).toBeDefined()
    expect(api.runtimeVersion).toBeDefined()
    expect(api.rpc).toBeDefined()
    expect(api.query).toBeDefined()
    expect(api.tx).toBeDefined()
    expect(api.derive).toBeDefined()
  })
})
