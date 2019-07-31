import { entropyToMnemonic } from 'bip39'
import { randomBytes } from 'react-native-randombytes'

const STRENGTH_MAP = {
  12: 16 * 8,
  15: 20 * 8,
  18: 24 * 8,
  21: 28 * 8,
  24: 32 * 8
}

/**
 * Generate random bytes
 *
 * @param {Number} length
 * @returns {Buffer} Random bytes
 */
const randomAsU8a = (length = 32) =>
  new Promise((resolve, reject) => {
    randomBytes(length, (err, bytes) => {
      if (err) return reject(err)
      resolve(bytes)
    })
  })

/**
 * Use bip39 to generate mnemonic words
 *
 * @param {Number} words length
 * @returns {String} Mnemonic words
 */
const mnemonicGenerate = async (words = 12) => {
  const strength = STRENGTH_MAP[words]
  const entropy = await randomAsU8a(strength / 8)
  return entropyToMnemonic(entropy)
}

export { mnemonicGenerate, randomAsU8a }
