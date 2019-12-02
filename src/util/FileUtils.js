// 只适合下载单个文件

import RNFS from 'react-native-fs'

const CONFIG_URL = 'https://chainx-config.oss-cn-hangzhou.aliyuncs.com/polkawallet.json'

const DEFAULT_DOWNLOAD_DEST = `${RNFS.MainBundlePath}/polkawallet.json`

export async function FileDownlad(fileURL = CONFIG_URL) {
  const FILE_URL = DEFAULT_DOWNLOAD_DEST
  await RNFS.downloadFile({ fromUrl: CONFIG_URL, toFile: FILE_URL })

  return new Promise(function(resolve, reject) {
    RNFS.readFile(FILE_URL)
      .then(result => {
        const configJson = JSON.parse(result)
        //configJson.voteUrl = 'http://192.168.0.108:3000/#/nodes'
        resolve(configJson)
      })
      .catch(err => {
        resolve({
          isOpenUniswap: true,
          voteUrl: 'https://dapp.chainx.org/#/nodes'
        })
      })
  })
}
