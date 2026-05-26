// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Navigable = { navigate: (...args: any[]) => void };

/** Switch the bottom tab. */
export function navigateToTab(navigation: Navigable, tab: 'Home' | 'Portfolio' | 'Trade' | 'Marketplace'): void {
  navigation.navigate('Main', { screen: tab });
}
