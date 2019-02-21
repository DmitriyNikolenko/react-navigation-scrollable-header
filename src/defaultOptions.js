import { Platform } from 'react-native'
import { Header, } from 'react-navigation'

const defaultHeaderHeight = Platform.select({ios: 44, android: 56, web: 50})

export default Object.freeze({
	minHeight: defaultHeaderHeight, // Header.HEIGHT,
	maxHeight: defaultHeaderHeight, // Header.HEIGHT,
	scrollEventThrottle: 12,
	color: 'white',
})