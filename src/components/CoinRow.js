import React, { Component } from 'react'
import { Image, View, TouchableOpacity, Text } from 'react-native'
import moment from 'moment/moment'
import { formatBalance } from '@polkadot/util'
import { ScreenWidth } from '../util/Common'

export default class CoinRow extends Component {
  render() {
    const { item, index, navigation } = this.props
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          navigation.navigate('Transfer_details', { data: item })
        }}
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          height: 64,
          borderBottomWidth: 1,
          borderColor: '#F0F0F0'
        }}
      >
        <View style={{ marginLeft: ScreenWidth / 16.3, flex: 1 }}>
          <Text
            ellipsizeMode="middle"
            numberOfLines={1}
            style={{ fontSize: 14, color: '#3E2D32', width: ScreenWidth * 0.4 }}
          >
            {item.tx_address}
          </Text>
          <Text style={{ marginTop: 5, fontSize: 13, color: '#AAAAAA' }}>
            {moment(item.tx_timestamp).format('DD/MM/YYYY HH:mm:ss')}
          </Text>
        </View>
        {/* 余额 | Balance */}
        <Text
          style={{
            marginRight: ScreenWidth / 20,
            fontSize: 16,
            color: '#3E2D32'
          }}
        >
          {item.tx_type == 'Receive'
            ? `+ ${formatBalance(String(item.tx_value))}`
            : `- ${formatBalance(String(item.tx_value))}`}
        </Text>
        <Image
          source={
            item.tx_type == 'Receive'
              ? require('../assets/images/public/assets_btc_down.png')
              : require('../assets/images/public/assets_btc_up.png')
          }
          style={{ width: 7, height: 12, marginRight: 24 }}
        />
      </TouchableOpacity>
    )
  }
}
