import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Method } from '@polkadot/types'
import { observer, inject } from 'mobx-react'
import { ScreenWidth, ScreenHeight } from '../../util/Common'
import ProposalsRow from '../../components/ProposalsRow'
import polkadotAPI from '../../util/polkadotAPI'
import i18n from '../../locales/i18n'

@inject('rootStore')
@observer
class Proposals extends Component {
  constructor(props) {
    super(props)
    this.state = {
      publicProps: [],
      Actives_Nofixed: [],
      Actives_Nofixedvalue: [],
      Actives_Title: [],
      votingCountdown: 0,
      launchCountdown: 0,
      Index: [],
      votingState: [],
      balances: []
    }
    this.balances = this.balances.bind(this)
  }

  balances() {
    ;(async () => {
      let launchPeriod = await polkadotAPI.launchPeriod()
      await polkadotAPI.bestNumber(bestNumber => {
        this.setState({ launchCountdown: launchPeriod - bestNumber.mod(launchPeriod).addn(1) })
      })
      await polkadotAPI.publicProps(result => {
        this.setState({
          publicProps: [],
          Actives_Nofixed: [],
          Actives_Nofixedvalue: [],
          Actives_Title: [],
          Index: [],
          balances: []
        })
        result.map((item, index) => {
          if (item) {
            let { meta, method, section } = Method.findFunction(item[1].callIndex)
            this.state.Actives_Title.push({ section: section, method: method })
            this.state.Actives_Nofixedvalue.push(item[1].args)
            this.state.Actives_Nofixed.push(meta.args)
            this.state.publicProps.push(item)
            this.state.Index.push(item[0])
          }
          this.setState({})
        })
      })
      for (let i = 0; i < this.state.Index.length; i++) {
        let balance = await polkadotAPI.depositOf(this.state.Index[i])
        if (balance) {
          this.state.balances.push(JSON.parse(balance)[0])
        }
        this.setState({})
      }
      for (let i = 0; i < this.state.balances.length; i++) {
        for (let j = 0; j < this.state.balances.length - i - 1; j++) {
          if (this.state.balances[j] < this.state.balances[j + 1]) {
            let tmp = this.state.balances[j]
            this.state.balances[j] = this.state.balances[j + 1]
            this.state.balances[j + 1] = tmp
            let tmp_publicProps = this.state.publicProps[j]
            this.state.publicProps[j] = this.state.publicProps[j + 1]
            this.state.publicProps[j + 1] = tmp_publicProps
            let tmp_Actives_Nofixed = this.state.Actives_Nofixed[j]
            this.state.Actives_Nofixed[j] = this.state.Actives_Nofixed[j + 1]
            this.state.Actives_Nofixed[j + 1] = tmp_Actives_Nofixed
            let tmp_Actives_Nofixedvalue = this.state.Actives_Nofixedvalue[j]
            this.state.Actives_Nofixedvalue[j] = this.state.Actives_Nofixedvalue[j + 1]
            this.state.Actives_Nofixedvalue[j + 1] = tmp_Actives_Nofixedvalue
            this.setState({})
          }
          this.setState({})
        }
        this.setState({})
      }
    })()
  }

  componentWillMount() {
    ;(async () => {
      let launchPeriod = await polkadotAPI.launchPeriod()

      await polkadotAPI.bestNumber(bestNumber => {
        this.setState({ launchCountdown: launchPeriod - bestNumber.mod(launchPeriod).addn(1) })
      })
      await polkadotAPI.publicProps(result => {
        this.balances()
      })
    })()
  }

  render() {
    return (
      <View style={{ flex: 1, width: ScreenWidth, marginBottom: 20 }}>
        {this.state.publicProps[0] == null ? (
          <View
            style={{
              marginTop: ScreenHeight / 15,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Text style={{ fontSize: ScreenWidth / 25, color: '#696969' }}>{i18n.t('Democracy.noProposals')}</Text>
          </View>
        ) : (
          <ProposalsRow
            publicProps={this.state.publicProps}
            Actives_Nofixed={this.state.Actives_Nofixed}
            Actives_Title={this.state.Actives_Title}
            Actives_Nofixedvalue={this.state.Actives_Nofixedvalue}
            launchCountdown={this.state.launchCountdown}
            balances={this.state.balances}
          />
        )}
      </View>
    )
  }
}
export default Proposals
