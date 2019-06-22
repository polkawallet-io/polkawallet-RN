import Assets from './Assets/index'
import Staking from './Staking/index'
import Democracy from './Democracy/index'
import Profile from './Profile/index'

export default {
  TAB: {
    Assets: 'Assets',
    Staking: 'Staking',
    Democracy: 'Democracy',
    Profile: 'Profile',
    ChangeLanguages: 'Change Languages',
    PasswordMistake: 'Password mistake.',
    PasswordCorrect: 'Password is correct.',
    Reset: 'Reset',
    Save: 'Save',
    Exit: 'Exit',
    Copy: 'Copy',
    Continue: 'Continue',
    Cancel: 'Cancel',
    StakingOption: 'Assets change record, Unit(xxx) ',
    Receive: 'Receive',
    Received: 'Received',
    Send: 'Send',
    loadMore: 'To load more ~',
    Bottom: '~ Bottom',
    noResponse: 'Long time no response, please try again.',
    enterInformation: 'Please enter relevant information.',
    signMess: 'You are about to sign a message from',
    unlockPassword: 'unlock account using password',
    loading: 'loading',
    CopySuccess: 'Copy success'
  },
  Assets: {
    ...Assets
  },
  Staking: {
    ...Staking
  },
  Democracy: {
    ...Democracy
  },
  Profile: {
    ...Profile
  }
}
