/* eslint-disable new-cap */
/* eslint-disable no-undef */
let _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

let _types = require('@polkadot/types')

let _index = _interopRequireDefault(require('@polkadot/rpc-provider/mock/index'))

let _ = require('@polkadot/api')

let mock
beforeEach(() => {
  mock = new _index.default()
})

test('Create API instance with metadata map and makes the runtime, rpc, state & extrinsics available', async () => {
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
  expect(api.query.timestamp.now()).toBeDefined()
  expect(api.rpc.system.properties).toBeDefined()
  expect(api.derive.balances.fees()).toBeDefined()
  expect(api.query.democracy.publicPropCount()).toBeDefined()
  expect(api.query.democracy.referendumCount()).toBeDefined()
  expect(api.query.democracy.publicProps()).toBeDefined()
  expect(api.derive.democracy.referendums()).toBeDefined()
  expect(api.query.democracy.launchPeriod()).toBeDefined()
  expect(api.derive.chain.bestNumber()).toBeDefined()
  expect(api.query.democracy.depositOf).toBeDefined()
  expect(api.tx.staking.chill()).toBeDefined()
  expect(api.query.staking.validatorCount()).toBeDefined()
  expect(api.query.session.sessionLength()).toBeDefined()
  expect(api.derive.session.eraLength()).toBeDefined()
  expect(api.derive.session.sessionProgress()).toBeDefined()
  expect(api.derive.session.eraProgress()).toBeDefined()
  expect(api.query.session.validators()).toBeDefined()
  expect(api.derive.staking.controllers()).toBeDefined()
  expect(api.tx.democracy.vote(1, true)).toBeDefined()
  expect(api.tx.staking.bondExtra(1)).toBeDefined()
  expect(
    api.tx.staking.validate({
      unstakeThreshold: '1',
      validatorPayment: 1
    })
  ).toBeDefined()
  expect(api.tx.staking.unbond(1)).toBeDefined()
  expect(api.derive.democracy.referendumVotesFor(1)).toBeDefined()
  expect(api.query.balances.freeBalance).toBeDefined()
  expect(api.tx.staking.bond).toBeDefined()
  expect(api.derive.staking.info).toBeDefined()
  expect(api.query.staking.nominators).toBeDefined()
  expect(api.tx.staking.nominate).toBeDefined()
  expect(api.tx.session.setKey).toBeDefined()
  expect(api.query.staking.bonded).toBeDefined()
  expect(api.query.staking.ledger).toBeDefined()
  expect(api.query.system.accountNonce).toBeDefined()
  expect(api.tx.balances.transfer).toBeDefined()
})
test('Create API instance without metadata and makes the runtime, rpc, state & extrinsics available', async () => {
  const metadata = {}
  const api = await _.ApiPromise.create({
    provider: mock,
    metadata
  })
  expect(api.query.timestamp.now()).toBeDefined()
  expect(api.rpc.system.properties).toBeDefined()
  expect(api.derive.balances.fees()).toBeDefined()
  expect(api.query.democracy.publicPropCount()).toBeDefined()
  expect(api.query.democracy.referendumCount()).toBeDefined()
  expect(api.query.democracy.publicProps()).toBeDefined()
  expect(api.derive.democracy.referendums()).toBeDefined()
  expect(api.query.democracy.launchPeriod()).toBeDefined()
  expect(api.derive.chain.bestNumber()).toBeDefined()
  expect(api.query.democracy.depositOf).toBeDefined()
  expect(api.tx.staking.chill()).toBeDefined()
  expect(api.query.staking.validatorCount()).toBeDefined()
  expect(api.query.session.sessionLength()).toBeDefined()
  expect(api.derive.session.eraLength()).toBeDefined()
  expect(api.derive.session.sessionProgress()).toBeDefined()
  expect(api.derive.session.eraProgress()).toBeDefined()
  expect(api.query.session.validators()).toBeDefined()
  expect(api.derive.staking.controllers()).toBeDefined()
  expect(api.tx.democracy.vote(1, true)).toBeDefined()
  expect(api.tx.staking.bondExtra(1)).toBeDefined()
  expect(
    api.tx.staking.validate({
      unstakeThreshold: '1',
      validatorPayment: 1
    })
  ).toBeDefined()
  expect(api.tx.staking.unbond(1)).toBeDefined()
  expect(api.derive.democracy.referendumVotesFor(1)).toBeDefined()
  expect(api.query.balances.freeBalance).toBeDefined()
  expect(api.tx.staking.bond).toBeDefined()
  expect(api.derive.staking.info).toBeDefined()
  expect(api.query.staking.nominators).toBeDefined()
  expect(api.tx.staking.nominate).toBeDefined()
  expect(api.tx.session.setKey).toBeDefined()
  expect(api.query.staking.bonded).toBeDefined()
  expect(api.query.staking.ledger).toBeDefined()
  expect(api.query.system.accountNonce).toBeDefined()
  expect(api.tx.balances.transfer).toBeDefined()
})
