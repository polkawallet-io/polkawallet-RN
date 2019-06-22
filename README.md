# polkawallet-RN
polkawallet react native implementation

### How to compile
`$ git clone https://github.com/polkawallet-io/polkawallet-RN.git`  
`$ cd polkawallet-RN && npm install`  

`$ react-native start`  

Open a new terminal:  
`$ react-native run-android`  
or:  
`$ react-native run-ios`

### Project introduce:

 [Polkawallet](http://polkawallet.io) provide Cross-chain asset one-stop management, convenient staking and governance, the private key is self-owned. 

![_20190104141328](https://user-images.githubusercontent.com/34789555/50725634-2dc2e200-113b-11e9-8e9a-8f7d8a7cc6a3.png)

In order to give users a more humane and more convenient experience, as the entrance of the polkadot network, the user is provided with more intuitive visual data and status change display to guarantee the user's right to know and network participation.

![_20190104144252](https://user-images.githubusercontent.com/34789555/50725635-31eeff80-113b-11e9-959c-582a63b98418.png)

- Users can add assets, support Relaychain and Parachain to transfer, receive, and view the transfer history and state. Have the visual asset change analysis chart, make it easier for users to analyze assets. Users are notified when they receive the asset and can view the transfer details data.

  The private key is self-owned, and have the Gesture,Fingerprint, Facial recognition, Hot and cold wallet mechanism, users can set their own scheme. Our team is developing a new encryption scheme -- high - dimensional fractal encryption, will be used to safeguard the security of a user using the polkawallet.

![](https://qiniu.netsafe.org.cn/images/3.png)

![screen4-1546691772332](https://user-images.githubusercontent.com/34789555/50725645-66fb5200-113b-11e9-9e41-370d5c7092b9.png)

- Polkawallet makes it easier for validators and nominal ators to make their contributions, by making the charts more intuitive and having a detailed history of each validators, for better analysis and research.

![](https://qiniu.netsafe.org.cn/images/4.png)
![_ _20190105203945](https://user-images.githubusercontent.com/34789555/50725650-82fef380-113b-11e9-974f-55d5f7b1b1df.png)

- Polkawallet provides a more intuitive and convenient entry point for participating in governance. If there is a new referendum/proposals, the user is reminded and you can view the details. Users can governance directly from polkawallet and view the history governance records. So polkawallet also improves public Referenda engagement.

  ![](https://qiniu.netsafe.org.cn/images/5.png)

![screen3](https://user-images.githubusercontent.com/34789555/50725655-9ad67780-113b-11e9-96e3-31ac85f2f442.png)

- Polkawallet will follow in Polkadot footsteps and continue to expand the cross-chain ecosystem, which is a module for the near future. It will quickly integrate suitable cross-chain applications, and we believe that it will be a colorful page. Cross-chain asset exchange is just a side application.

![](https://qiniu.netsafe.org.cn/images/6.png)

- Available for all major mobile platforms. Currently react native is used as a cross-platform solution, which will be developed separately in the future.


[Complete SohowDemo](https://qiniu.netsafe.org.cn/images/polkawalletshowDemo.gif)


----

## THE PLAN


- [x] Project architecture (2018.12.11 - 13)

- [x] Prototype design (2018.12.14 - 19)

  <https://pro.modao.cc/app/defcf5bd8d309f7e776afc80c4d65a85c03cf3fb> （password, call me in the Riot）

- [x] Draw renderings and mark them (2018.12.20 - 29)

![_ _20190105215211](https://user-images.githubusercontent.com/34789555/50725697-6ca56780-113c-11e9-95da-d0c4e90e8c5d.png)


- [x] Polkadot js api debugging for react native (2018.12.17 - plan 2019.01.15 done)[actual: 01.07 done]

  Problems arise when importing Polkadot js API to the React Native, Special thanks to @jacogr  helped me debug the API for a long time, https://github.com/polkadot-js/api/issues/481. We've made a breakthrough, but there are still incompatibilities on the Android side.https://github.com/polkadot-js/api/issues/526. 

![_ _20181221211242](https://user-images.githubusercontent.com/34789555/50725734-0bca5f00-113d-11e9-9854-d1ef1c8f7787.gif)


- [x] Display page jump logic (plan: 2019.01.15 done)


- [x] Display page implementation (plan: 2019.01.26 done)
(then have the Chinese New Year, 14 days holiday)
- [x] Functional & logic implementation  (plan: 2019.02. 27 done)[actual: 02.22 done] 
- [x] Release Beta version (plan: 2019.02.28 release)[actual: 02.23 done] 
- [x] Optimization and development
- [ ] Integrate Parity Signer to Polkawallet
- [ ] New and more functions, including finance, cross-chain ecosystem

