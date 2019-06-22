/* eslint-disable no-undef */
const { ScreenWidth, ScreenHeight, getUnit, formatData } = require('../src/util/Common')

test('formatData', () => {
  expect(formatData({})).toEqual({})
})

test('ScreenWidth', () => {
  expect(ScreenWidth).not.toBeNull()
})
test('ScreenHeight', () => {
  expect(ScreenHeight).not.toBeNull()
})

test('getUnit femto', () => {
  expect(getUnit('femto')).toBe('1')
})

test('getUnit pico', () => {
  expect(getUnit('pico')).toBe('1000')
})

test('getUnit nano', () => {
  expect(getUnit('nano')).toBe('1000000')
})

test('getUnit micro', () => {
  expect(getUnit('micro')).toBe('1000000000')
})

test('getUnit milli', () => {
  expect(getUnit('milli')).toBe('1000000000000')
})

test('getUnit DOT', () => {
  expect(getUnit('DOT')).toBe('1000000000000000')
})

test('getUnit Kilo', () => {
  expect(getUnit('Kilo')).toBe('1000000000000000000')
})

test('getUnit Mega', () => {
  expect(getUnit('Mega')).toBe('1000000000000000000000')
})

test('getUnit Giga', () => {
  expect(getUnit('Giga')).toBe('1000000000000000000000000')
})

test('getUnit Tera', () => {
  expect(getUnit('Tera')).toBe('1000000000000000000000000000')
})

test('getUnit Peta', () => {
  expect(getUnit('Peta')).toBe('1000000000000000000000000000000')
})

test('getUnit Exa', () => {
  expect(getUnit('Exa')).toBe('1000000000000000000000000000000000')
})

test('getUnit Zeta', () => {
  expect(getUnit('Zeta')).toBe('1000000000000000000000000000000000000')
})

test('getUnit Yotta', () => {
  expect(getUnit('Yotta')).toBe('1000000000000000000000000000000000000000')
})
