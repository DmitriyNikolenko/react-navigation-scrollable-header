import React from 'react'
import PropTypes from 'prop-types'
import { Animated, Dimensions, } from 'react-native'
import hoistNonReactStatic from 'hoist-non-react-statics'
import defaultOptions from './defaultOptions'
import { isOrientationLandscape, } from './helpers'

export default function withScrollableHeader(customOptions) {
	const { minHeight, maxHeight, scrollEventThrottle, color, } = Object.assign({}, defaultOptions, customOptions)
	const scrolledHeight = maxHeight - minHeight

	return (WrappedScreen) => {
		class ScrolledHeaderWrapper extends React.Component {
			static propTypes = {
				navigation: PropTypes.object.isRequired,
			}

			state = {
			    scrollY: new Animated.Value(0),
			}

			clamp = Animated.diffClamp(this.state.scrollY, 0, scrolledHeight)

			height = this.clamp.interpolate({
			        inputRange: [ 0, scrolledHeight ],
			        outputRange: [ customOptions.maxHeight, minHeight ],
			    })

			progress = this.clamp.interpolate({
			        inputRange: [ 0, scrolledHeight ],
			        outputRange: [ 0, 1 ],
			    })

			regress = this.clamp.interpolate({
			    inputRange: [ 0, scrolledHeight ],
			    outputRange: [ 1, 0 ],
			})

			collapsed = this.clamp.interpolate({
			    inputRange: [ 0, scrolledHeight * 0.9, scrolledHeight ],
			    outputRange: [ 0, 0, 1 ],
			})

			appHeaderProps = {
			    height: this.height,
			    progress: this.progress,
			    regress: this.regress,
				collapsed: this.collapsed,
				minHeight,
				maxHeight,
				color,
			}

			componentDidMount() {
			    const { navigation, } = this.props
				navigation.setParams({ scrolledHeader: this.appHeaderProps, })

				Dimensions.addEventListener('change', this.orientationListner)
			}

			componentWillUnmount(){
				Dimensions.removeEventListener('change', this.orientationListner)
				this.props.navigation.state.params = undefined
			}

			orientationListner = ({ window, }) => {
				this.props.navigation.setParams({ isLandscape: isOrientationLandscape(window), })
			}

			handleScroll = Animated.event(
				[ { nativeEvent: { contentOffset: { y: this.state.scrollY, }, }, } ],
				{ isInteraction: false, }
			)

			scrolledHeaderProps = {
			    onScroll: this.handleScroll,
				scrollEventThrottle,
				bounces: false,
			};

			render() {
			    return (
			        <WrappedScreen {...this.props} scrolledHeader={this.scrolledHeaderProps} />
			    )
			}
		}

		hoistNonReactStatic(ScrolledHeaderWrapper, WrappedScreen)

		return ScrolledHeaderWrapper
	}
}