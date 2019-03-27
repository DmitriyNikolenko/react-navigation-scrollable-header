export default function getHeaderHeight(navigation, initialHeight) {
	return navigation.state?.params?.scrolledHeader?.height || initialHeight
}