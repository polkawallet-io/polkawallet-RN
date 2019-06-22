import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View, Dimensions } from 'react-native'
import i18n from '../locales/i18n'

const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')

const styles = StyleSheet.create({
  loading: {
    backgroundColor: '#10101099',
    height: 80,
    width: 100,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: (height - 80) / 2,
    left: (width - 100) / 2
  },

  loadingTitle: {
    marginTop: 10,
    fontSize: 14,
    color: 'white'
  }
})
export default class Loading extends React.Component {
  constructor(props) {
    super(props)
    this.minShowingTime = 200
    this.state = {
      isLoading: false,
      setIsLoading: isLoading => {
        if (isLoading != this.state.isLoading) {
          const curTimeLong = new Date().getTime()
          if (isLoading) {
            this.startTime = curTimeLong
            this.setState({
              isLoading
            })
          } else {
            const hasShowingTimeLong = curTimeLong - this.startTime
            if (hasShowingTimeLong < this.minShowingTime) {
              setTimeout(() => {
                this.setState({
                  isLoading
                })
              }, this.minShowingTime - hasShowingTimeLong)
            } else {
              this.setState({
                isLoading
              })
            }
          }
        }
      }
    }
  }

  showLoading = () => {
    this.state.setIsLoading(true)
  }

  dismissLoading = () => {
    this.state.setIsLoading(false)
  }

  render() {
    if (!this.state.isLoading) {
      return null
    }
    return (
      <View
        style={{
          flex: 1,
          width,
          height,
          position: 'absolute',
          // backgroundColor:'red',
          backgroundColor: '#10101099'
        }}
      >
        <View style={styles.loading}>
          <ActivityIndicator color="white" />
          <Text style={styles.loadingTitle}>
            {i18n.t('TAB.loading')}
            ...
          </Text>
        </View>
      </View>
    )
  }
}
