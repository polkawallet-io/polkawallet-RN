import React from 'react';
import { Platform } from 'react-native';
import {
  createNavigationContainer,
  createNavigator,
  TabRouter,
} from 'react-navigation';

import TabView from './views/TabView';
import TabBarTop from './views/TabBarTop';
import TabBarBottom from './views/TabBarBottom';

const createTabNavigator = (routeConfigs, config = {}) => {
  // Use the look native to the platform by default
  const tabsConfig = { ...createTabNavigator.Presets.Default, ...config };

  const router = TabRouter(routeConfigs, tabsConfig);

  const navigator = createNavigator(TabView, router, tabsConfig);

  return createNavigationContainer(navigator);
};

const Presets = {
  iOSBottomTabs: {
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    animationEnabled: false,
    initialLayout: undefined,
  },
  AndroidTopTabs: {
    tabBarComponent: TabBarTop,
    tabBarPosition: 'top',
    swipeEnabled: true,
    animationEnabled: true,
    initialLayout: undefined,
  },
};

/**
 * Use these to get Android-style top tabs even on iOS or vice versa.
 *
 * Example:
 * ```
 * const HomeScreencreateTabNavigator = createTabNavigator({
 *  Chat: {
 *    screen: ChatScreen,
 *  },
 *  ...
 * }, {
 *  ...createTabNavigator.Presets.AndroidTopTabs,
 *  tabBarOptions: {
 *    ...
 *  },
 * });
 *```
 */
createTabNavigator.Presets = {
  iOSBottomTabs: Presets.iOSBottomTabs,
  AndroidTopTabs: Presets.AndroidTopTabs,
  Default:
    Platform.OS === 'ios' ? Presets.iOSBottomTabs : Presets.AndroidTopTabs,
};

export default createTabNavigator;
