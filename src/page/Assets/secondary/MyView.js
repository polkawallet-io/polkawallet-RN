import React from 'react'
import PropTypes from 'prop-types'
import { View, ViewPropTypes } from 'react-native'

const MyView = props => {
  const { children, hide, style } = props
  if (hide) {
    return null
  }
  const that = this
  return (
    <View {...that.props} style={style}>
      {children}
    </View>
  )
}

MyView.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.element]))
  ]).isRequired,
  style: ViewPropTypes.style,
  hide: PropTypes.bool
}

export default MyView
