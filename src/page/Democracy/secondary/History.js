import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import { VictoryPie } from 'victory-native'
import { ScreenWidth, ScreenHeight } from '../../../util/Common'

const Actives_fixed = [
  {
    name: 'councilVoting.setCooloffPeriod',
    time: '310',
    number: 49,
    Aye: 5042964,
    aye: 368,
    Nay: 2512889,
    nay: 58,
    result: 'Pass',
    Actives_Nofixed: [{ name: 'blocks:Compact<BlockNumber>', num: 256 }]
  },
  {
    name: 'councilVoting.setCooloffPeriod',
    time: '310',
    number: 48,
    Aye: 5042964,
    aye: 368,
    Nay: 2512889,
    nay: 58,
    result: 'NoPass',
    Actives_Nofixed: [{ name: 'Compact<BlockNumber>', num: 252 }]
  },
  {
    name: 'councilVoting.setCooloffPeriod',
    time: '310',
    number: 47,
    Aye: 5042964,
    aye: 368,
    Nay: 2512889,
    nay: 58,
    result: 'Pass',
    Actives_Nofixed: [
      { name: 'who:Address', num: '5rgjhfdkjgbfdkjvbcvbkdjvbdfghjsdffd' },
      { name: 'free:Compact<Balance>', num: 18000 },
      { name: 'reserved:Compact<Balance>', num: 180000 }
    ]
  }
]
export default class History extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {Actives_fixed.map((item, index) => (
          <View key={index} style={{ borderBottomWidth: 1, borderColor: '#C0C0C0' }}>
            <View
              style={{
                borderRadius: ScreenHeight / 200,
                height: ScreenHeight / 30,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  marginLeft: ScreenWidth / 40,
                  fontSize: ScreenWidth / 30
                }}
              >
                {item.name}
              </Text>
              <Image
                source={require('../../../assets/images/staking/Demccrscy_time_icon.png')}
                style={{
                  marginLeft: ScreenWidth / 40,
                  height: ScreenHeight / 50,
                  width: ScreenHeight / 50,
                  resizeMode: 'contain'
                }}
              />
              <Text
                style={{
                  fontWeight: '500',
                  marginLeft: ScreenWidth / 80,
                  color: '#90BD5B',
                  fontSize: ScreenWidth / 35
                }}
              >
                {item.time}
              </Text>
              <Text
                style={{
                  fontWeight: '500',
                  color: '#90BD5B',
                  fontSize: ScreenWidth / 40
                }}
              >
                {' '}
                {' blocks end'}
              </Text>
              <View style={{ flex: 1 }} />
              <Text
                style={{
                  marginRight: ScreenWidth / 70,
                  fontSize: ScreenWidth / 26
                }}
              >
                #{item.number}
              </Text>
            </View>
            {item.Actives_Nofixed.map((itemNo, indexNo) => (
              <View
                key={indexNo}
                style={{
                  marginLeft: ScreenWidth / 30,
                  marginTop: ScreenHeight / 70
                }}
              >
                <Text style={{ color: '#696969', fontSize: ScreenHeight / 51.31 }}>{itemNo.name}</Text>
                <View
                  style={{
                    borderRadius: ScreenHeight / 200,
                    borderWidth: 1,
                    borderColor: '#C0C0C0',
                    marginTop: ScreenHeight / 100,
                    justifyContent: 'center',
                    width: ScreenWidth / 1.7,
                    height: ScreenHeight / 30,
                    backgroundColor: '#DCDCDC',
                    color: '#666666'
                  }}
                >
                  <Text
                    ellipsizeMode="middle"
                    numberOfLines={1}
                    style={{
                      width: ScreenWidth / 2.5,
                      marginLeft: ScreenWidth / 40,
                      color: '#666666',
                      fontSize: ScreenHeight / 51.31
                    }}
                  >
                    {itemNo.num}
                  </Text>
                </View>
              </View>
            ))}
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                marginTop: ScreenHeight / 70,
                marginLeft: ScreenWidth / 40,
                height: ScreenHeight / 30
              }}
            >
              <Text style={{ fontSize: ScreenHeight / 65 }}>Threshold: Super majority approval</Text>
              <View style={{ flex: 1 }} />
              <Text
                style={{
                  marginRight: ScreenWidth / 40,
                  fontSize: ScreenHeight / 65
                }}
              >
                The result of voting:
              </Text>
              <View
                style={{
                  borderRadius: ScreenHeight / 200,
                  marginRight: ScreenWidth / 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: item.result == 'Pass' ? '#7ad52a' : '#fb3232',
                  height: ScreenHeight / 30
                }}
              >
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: 'white',
                    marginHorizontal: ScreenWidth / 60,
                    fontSize: ScreenHeight / 65
                  }}
                >
                  {item.result}
                </Text>
              </View>
            </View>
            <View
              style={{
                borderRadius: ScreenHeight / 200,
                height: ScreenHeight / 30,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <View
                style={{
                  width: 21,
                  height: 11,
                  borderRadius: 6,
                  backgroundColor: '#90ED3F'
                }}
              />
              <Text
                style={{
                  marginLeft: ScreenWidth / 100,
                  fontSize: ScreenWidth / 45
                }}
              >
                {`Aye ${item.Aye}`}
              </Text>
              <Text
                style={{
                  marginLeft: ScreenWidth / 80,
                  fontSize: ScreenWidth / 45,
                  color: '#7ad52a'
                }}
              >
                66.75%
              </Text>
              <Text style={{ fontSize: ScreenWidth / 45 }}>{`(${item.aye})`}</Text>
              <View
                style={{
                  width: 21,
                  height: 11,
                  borderRadius: 6,
                  backgroundColor: '#F14B79'
                }}
              />
              <Text
                style={{
                  marginLeft: ScreenWidth / 100,
                  fontSize: ScreenWidth / 45
                }}
              >
                {`Nay ${item.Nay}`}
              </Text>
              <Text
                style={{
                  marginLeft: ScreenWidth / 80,
                  fontSize: ScreenWidth / 45,
                  color: '#fb3232'
                }}
              >
                33.25%
              </Text>
              <Text style={{ fontSize: ScreenWidth / 45 }}>{`(${item.nay})`}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginLeft: ScreenWidth / 6,
                marginVertical: ScreenHeight / 70
              }}
            >
              <VictoryPie
                colorScale={['#8fec41', '#fb3232']}
                data={[{ x: 1, y: 5 }, { x: 2, y: 2 }]}
                height={ScreenWidth / 5.86}
                innerRadius={ScreenWidth / 29}
                padding={{ top: 0, left: 0 }}
                width={ScreenWidth / 5.86}
              />
              {/* Nay or Aye */}
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end'
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    height: ScreenHeight / 20,
                    width: ScreenWidth * 0.5,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 5,
                      backgroundColor: 'red',
                      height: ScreenHeight / 24,
                      width: ScreenWidth * 0.2
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: ScreenHeight / 60,
                        color: 'white'
                      }}
                    >
                      Nay
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 5,
                      backgroundColor: '#7ad52a',
                      marginLeft: ScreenWidth / 100,
                      height: ScreenHeight / 24,
                      width: ScreenWidth * 0.2
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: ScreenHeight / 60,
                        color: 'white'
                      }}
                    >
                      Aye
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      borderRadius: (ScreenHeight / 24 / 14) * 4,
                      backgroundColor: 'white',
                      position: 'absolute',
                      height: (ScreenHeight / 24 / 7) * 4,
                      width: (ScreenHeight / 24 / 7) * 4,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Text style={{ fontSize: ScreenHeight / 70 }}>or</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    )
  }
}
