import { Platform } from 'react-native'
import SInfo from 'react-native-sensitive-info'
import { TYPE_CHAINX, TYPE_KUSMA } from './Constant'

const getWalletAccounts = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await SInfo.getAllItems({
        sharedPreferencesName: 'Polkawallet',
        keychainService: 'PolkawalletKey'
      })

      let UserAccounts = []

      if (Platform.OS == 'android') {
        for (let o in result) {
          try {
            type = JSON.parse(result[o]).meta.type
            if (!type) {
              type = TYPE_CHAINX
            }
          } catch (err) {
            type = TYPE_KUSMA
          }
          UserAccounts.push({
            account: JSON.parse(result[o]).meta.name,
            address: JSON.parse(result[o]).address,
            type: JSON.parse(result[o]).meta.type,
            keyStore: ''
          })
        }
      } else {
        result.map(async item => {
          item.map(async item => {
            let type = TYPE_KUSMA
            try {
              type = JSON.parse(item.value).meta.type
              if (!type) {
                type = TYPE_KUSMA
              }
            } catch (err) {
              type = TYPE_KUSMA
            }
            UserAccounts.push({
              account: JSON.parse(item.value).meta.name,
              address: item.key,
              type: type,
              keyStore: ''
            })
          })
        })
      }
      resolve(UserAccounts)
    } catch (error) {
      reject(error)
    }
  })
}

const AccountsApi = {
  getKeyStoreFromAddress: async _address => {
    return new Promise(function(resolve, reject) {
      try {
        SInfo.getItem(props.address, {
          sharedPreferencesName: 'Polkawallet',
          keychainService: 'PolkawalletKey'
        }).then(result => {
          resolve(result)
        })
      } catch (error) {
        reject(error)
      }
    })
  },
  getAccountIndex: async _address => {
    return new Promise(function(resolve, reject) {
      try {
        ;(async () => {
          const userAccounts = await getWalletAccounts()
          let currentIndex = 0
          userAccounts.map((item, index) => {
            if (item.address != _address) {
              currentIndex = index
            }
          })
          resolve(currentIndex)
        })()
      } catch (error) {
        reject(error)
      }
    })
  },
  getUserAddress: async () => {
    return new Promise(function(resolve, reject) {
      try {
        ;(async () => {
          const userAccounts = await getWalletAccounts()
          let ksmAddress = []
          let chainxAddress = []
          userAccounts.map((item, index) => {
            if (item.type != TYPE_CHAINX) {
              ksmAddress.push({
                address: item.address,
                account: item.account,
                type: TYPE_KUSMA
              })
            } else {
              chainxAddress.push({
                address: item.address,
                account: item.account,
                type: TYPE_CHAINX
              })
            }
          })
          resolve({
            ksm: ksmAddress,
            chainx: chainxAddress
          })
        })()
      } catch (error) {
        reject(error)
      }
    })
  },
  getAllAccountsArray: async () => {
    return new Promise(async (resolve, reject) => {
      try {
        ;(async () => {
          let UserAccounts = await getWalletAccounts()
          resolve(UserAccounts)
        })()
      } catch (error) {
        console.warn('aaaaa 啊啊啊啊啊 我错了')
        reject(error)
      }
    })
  }
}

export default AccountsApi
