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
    this.getProposals = this.getProposals.bind(this)
  }

  /**
   * @description 获取提案相关信息|Get information about the proposal
   */
  getProposals() {
    ;(async () => {
      let launchPeriod = await polkadotAPI.launchPeriod()
      await polkadotAPI.bestNumber(bestNumber => {
        this.setState({
          launchCountdown: launchPeriod - bestNumber.mod(launchPeriod).addn(1)
        })
      })
      await polkadotAPI.publicProps(result => {
        this.setState(
          {
            publicProps: [],
            Actives_Nofixed: [],
            Actives_Nofixedvalue: [],
            Actives_Title: [],
            Index: [],
            balances: []
          },
          () => {
            ;(async () => {
              result.map((item, index) => {
                if (item) {
                  let info = item[1]
                  try {
                    if (item[1].proposal.args.proposal) {
                      info = item[1].proposal.args
                    }
                  } catch (e) {}
                  let { meta, method, section } = Method.findFunction(info.callIndex)
                  this.state.Actives_Title.push({
                    section: section,
                    method: method
                  })
                  this.state.Actives_Nofixedvalue.push(info.args)
                  this.state.Actives_Nofixed.push(meta.args)
                  this.state.publicProps.push(item)
                  this.state.Index.push(item[0])
                }
                this.setState({})
              })
              for (let i = 0; i < this.state.Index.length; i++) {
                let balance = await polkadotAPI.depositOf(this.state.Index[i])
                if (balance) {
                  this.state.balances.push(balance)
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
        )
      })
    })()
  }

  componentDidMount() {
    // InteractionManager.runAfterInteractions(() => {
    ;(async () => {
      let launchPeriod = await polkadotAPI.launchPeriod()

      await polkadotAPI.bestNumber(bestNumber => {
        this.setState({
          launchCountdown: launchPeriod - bestNumber.mod(launchPeriod).addn(1)
        })
      })
      await polkadotAPI.publicProps(result => {
        this.getProposals()
      })
    })()
    // })
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
