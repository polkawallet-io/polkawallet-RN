/*
 * @Description: COPYRIGHT © 2018 POLKAWALLET (HK) LIMITED
 * This file is part of Polkawallet.

 It under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License.
 You should have received a copy of the GNU General Public License
 along with Polkawallet. If not, see <http://www.gnu.org/licenses/>.

 * @Autor: POLKAWALLET LIMITED
 * @Date: 2019-06-18 21:08:00
 */
import Api from '@polkadot/api/promise'
import WsProvider from '@polkadot/rpc-provider/ws'
import AppState from '../mobx/mobx'

/**
 * @description 判断是否为空对象 | Empty object judgment
 * @param {Object} obj 对象 | Object
 * @returns {Boolean} true 空对象 false 非空对象 | True: empty object, false: non-empty object
 */
function judgeObj(obj) {
  let attr
  for (attr in obj) {
    return false
  }
  return true
}
const getAppApi = async () =>
  new Promise(function(resolve, reject) {
    try {
      ;(async () => {
        if (judgeObj(AppState.stateStore.API)) {
          const provider = new WsProvider(AppState.stateStore.ENDPOINT)
          const api = await Api.create(provider)
          AppState.stateStore.API = api
          resolve(api)
        } else {
          resolve(AppState.stateStore.API)
        }
      })()
    } catch (error) {
      reject(error)
    }
  })
const polkadotAPI = {
  timestampNow: cb => {
    if (cb) {
      ;(async () => {
        const api = await getAppApi()
        await api.query.timestamp.now(cb)
      })()
    } else {
      return new Promise(function(resolve, reject) {
        try {
          ;(async () => {
            const api = await getAppApi()
            const _data = await api.query.timestamp.now()
            resolve(_data)
          })()
        } catch (error) {
          reject(error)
        }
      })
    }
  },
  freeBalance: (_address, cb) => {
    if (cb) {
      ;(async () => {
        const api = await getAppApi()
        await api.query.balances.freeBalance(_address, cb)
      })()
    } else {
      return new Promise(function(resolve, reject) {
        try {
          ;(async () => {
            const api = await getAppApi()
            const _data = await api.query.balances.freeBalance(_address)
            resolve(_data)
          })()
        } catch (error) {
          reject(error)
        }
      })
    }
  },
  properties: () =>
    new Promise(function(resolve, reject) {
      try {
        ;(async () => {
          const api = await getAppApi()
          const _data = await api.rpc.system.properties()
          resolve(_data)
        })()
      } catch (error) {
        reject(error)
      }
    }),
  fees: () =>
    new Promise(function(resolve, reject) {
      try {
        ;(async () => {
          const api = await getAppApi()
          const _data = await api.derive.balances.fees()
          resolve(_data)
        })()
      } catch (error) {
        reject(error)
      }
    }),
  accountNonce: address =>
    new Promise(function(resolve, reject) {
      try {
        ;(async () => {
          const api = await getAppApi()
          const _data = await api.query.system.accountNonce(address)
          resolve(_data)
        })()
      } catch (error) {
        reject(error)
      }
    }),
  transfer: (_address, _value) =>
    new Promise(function(resolve, reject) {
      try {
        ;(async () => {
          const api = await getAppApi()
          const _data = api.tx.balances.transfer(_address, _value)
          resolve(_data)
        })()
      } catch (error) {
        reject(error)
      }
    }),
  publicPropCount: cb => {
    if (cb) {
      ;(async () => {
        const api = await getAppApi()
        await api.query.democracy.publicPropCount(cb)
      })()
    } else {
      return new Promise(function(resolve, reject) {
        try {
          ;(async () => {
            const api = await getAppApi()
            const _data = await api.query.democracy.publicPropCount()
            resolve(_data)
          })()
        } catch (error) {
          reject(error)
        }
      })
    }
  },
  referendumCount: cb => {
    if (cb) {
      ;(async () => {
        const api = await getAppApi()
        await api.query.democracy.referendumCount(cb)
      })()
    } else {
      return new Promise(function(resolve, reject) {
        try {
          ;(async () => {
            const api = await getAppApi()
            const _data = await api.query.democracy.referendumCount()
            resolve(_data)
          })()
        } catch (error) {
          reject(error)
        }
      })
    }
  },
  publicProps: cb => {
    if (cb) {
      ;(async () => {
        const api = await getAppApi()
        await api.query.democracy.publicProps(cb)
      })()
    } else {
      return new Promise(function(resolve, reject) {
        try {
          ;(async () => {
            const api = await getAppApi()
            const _data = await api.query.democracy.publicProps()
            resolve(_data)
          })()
        } catch (error) {
          reject(error)
        }
      })
    }
  },
  referendums: cb => {
    if (cb) {
      ;(async () => {
        const api = await getAppApi()
        await api.derive.democracy.referendums(cb)
      })()
    } else {
      return new Promise(function(resolve, reject) {
        try {
          ;(async () => {
            const api = await getAppApi()
            const _data = await api.derive.democracy.referendums()
            resolve(_data)
          })()
        } catch (error) {
          reject(error)
        }
      })
    }
  },
  launchPeriod: () =>
    new Promise(function(resolve, reject) {
      try {
        ;(async () => {
          const api = await getAppApi()
          const _data = await api.query.democracy.launchPeriod()
          resolve(_data)
        })()
      } catch (error) {
        reject(error)
      }
    }),
  bestNumber: cb => {
    if (cb) {
      ;(async () => {
        const api = await getAppApi()
        await api.derive.chain.bestNumber(cb)
      })()
    } else {
      return new Promise(function(resolve, reject) {
        try {
          ;(async () => {
            const api = await getAppApi()
            const _data = await api.derive.chain.bestNumber()
            resolve(_data)
          })()
        } catch (error) {
          reject(error)
        }
      })
    }
  },
  depositOf: index =>
    new Promise(function(resolve, reject) {
      try {
        ;(async () => {
          const api = await getAppApi()
          const _data = await api.query.democracy.depositOf(index)
          resolve(_data)
        })()
      } catch (error) {
        reject(error)
      }
    }),
  vote: (i, tag) =>
    new Promise(function(resolve, reject) {
      try {
        ;(async () => {
          const api = await getAppApi()
          const _data = await api.tx.democracy.vote(i, tag)
          resolve(_data)
        })()
      } catch (error) {
        reject(error)
      }
    }),
  bondExtra: val =>
    new Promise(function(resolve, reject) {
      try {
        ;(async () => {
          const api = await getAppApi()
          const _data = await api.tx.staking.bondExtra(val)
          resolve(_data)
        })()
      } catch (error) {
        reject(error)
      }
    }),
  bond: (controller, val, payee) =>
    new Promise(function(resolve, reject) {
      try {
        ;(async () => {
          const api = await getAppApi()
          const _data = await api.tx.staking.bond(controller, val, payee)
          resolve(_data)
        })()
      } catch (error) {
        reject(error)
      }
    }),
  accountInfo: account =>
    new Promise(function(resolve, reject) {
      try {
        ;(async () => {
          const api = await getAppApi()
          const _data = await api.derive.staking.info(account)
          resolve(_data)
        })()
      } catch (error) {
        reject(error)
      }
    }),
  nominators: stash =>
    new Promise(function(resolve, reject) {
      try {
        ;(async () => {
          const api = await getAppApi()
          const _data = await api.query.staking.nominators(stash)
          resolve(_data)
        })()
      } catch (error) {
        reject(error)
      }
    }),
  nominate: target =>
    new Promise(function(resolve, reject) {
      try {
        ;(async () => {
          const api = await getAppApi()
          const _data = await api.tx.staking.nominate(target)
          resolve(_data)
        })()
      } catch (error) {
        reject(error)
      }
    }),
  setKey: key =>
    new Promise(function(resolve, reject) {
      try {
        ;(async () => {
          const api = await getAppApi()
          const _data = await api.tx.session.setKey(key)
          resolve(_data)
        })()
      } catch (error) {
        reject(error)
      }
    }),
  validate: preferences =>
    new Promise(function(resolve, reject) {
      try {
        ;(async () => {
          const api = await getAppApi()
          const _data = await api.tx.staking.validate(preferences)
          resolve(_data)
        })()
      } catch (error) {
        reject(error)
      }
    }),
  unbond: val =>
    new Promise(function(resolve, reject) {
      try {
        ;(async () => {
          const api = await getAppApi()
          const _data = await api.tx.staking.unbond(val)
          resolve(_data)
        })()
      } catch (error) {
        reject(error)
      }
    }),
  chill: () =>
    new Promise(function(resolve, reject) {
      try {
        ;(async () => {
          const api = await getAppApi()
          const _data = await api.tx.staking.chill()
          resolve(_data)
        })()
      } catch (error) {
        reject(error)
      }
    }),

  validatorCount: () =>
    new Promise(function(resolve, reject) {
      try {
        ;(async () => {
          const api = await getAppApi()
          const _data = await api.query.staking.validatorCount()
          resolve(_data)
        })()
      } catch (error) {
        reject(error)
      }
    }),
  sessionLength: () =>
    new Promise(function(resolve, reject) {
      try {
        ;(async () => {
          const api = await getAppApi()
          const _data = await api.query.session.sessionLength()
          resolve(_data)
        })()
      } catch (error) {
        reject(error)
      }
    }),
  eraLength: () =>
    new Promise(function(resolve, reject) {
      try {
        ;(async () => {
          const api = await getAppApi()
          const _data = await api.derive.session.eraLength()
          resolve(_data)
        })()
      } catch (error) {
        reject(error)
      }
    }),
  sessionProgress: cb => {
    if (cb) {
      ;(async () => {
        const api = await getAppApi()
        await api.derive.session.sessionProgress(cb)
      })()
    } else {
      return new Promise(function(resolve, reject) {
        try {
          ;(async () => {
            const api = await getAppApi()
            const _data = await api.derive.session.sessionProgress()
            resolve(_data)
          })()
        } catch (error) {
          reject(error)
        }
      })
    }
  },
  eraProgress: cb => {
    if (cb) {
      ;(async () => {
        const api = await getAppApi()
        await api.derive.session.eraProgress(cb)
      })()
    } else {
      return new Promise(function(resolve, reject) {
        try {
          ;(async () => {
            const api = await getAppApi()
            const _data = await api.derive.session.eraProgress()
            resolve(_data)
          })()
        } catch (error) {
          reject(error)
        }
      })
    }
  },
  validators: () =>
    new Promise(function(resolve, reject) {
      try {
        ;(async () => {
          const api = await getAppApi()
          const _data = await api.query.session.validators()
          resolve(_data)
        })()
      } catch (error) {
        reject(error)
      }
    }),
  controllers: cb => {
    if (cb) {
      ;(async () => {
        const api = await getAppApi()
        await api.derive.staking.controllers(cb)
      })()
    } else {
      return new Promise(function(resolve, reject) {
        try {
          ;(async () => {
            const api = await getAppApi()
            const _data = await api.derive.staking.controllers()
            resolve(_data)
          })()
        } catch (error) {
          reject(error)
        }
      })
    }
  },
  bonded: address =>
    new Promise(function(resolve, reject) {
      try {
        ;(async () => {
          const api = await getAppApi()
          const _data = await api.query.staking.bonded(address)
          resolve(_data)
        })()
      } catch (error) {
        reject(error)
      }
    }),
  ledger: address =>
    new Promise(function(resolve, reject) {
      try {
        ;(async () => {
          const api = await getAppApi()
          const _data = await api.query.staking.ledger(address)
          resolve(_data)
        })()
      } catch (error) {
        reject(error)
      }
    }),

  blockHash: value =>
    new Promise(function(resolve, reject) {
      try {
        ;(async () => {
          const api = await getAppApi()
          const _data = await api.query.system.blockHash(value)
          resolve(_data)
        })()
      } catch (error) {
        reject(error)
      }
    }),
  referendumVotesFor: (i, cb) => {
    if (cb) {
      ;(async () => {
        const api = await getAppApi()
        await api.derive.democracy.referendumVotesFor(i, cb)
      })()
    } else {
      return new Promise(function(resolve, reject) {
        try {
          ;(async () => {
            const api = await getAppApi()
            const _data = await api.derive.democracy.referendumVotesFor(i)
            resolve(_data)
          })()
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
export default polkadotAPI
