import * as React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import Animated from 'react-native-reanimated';
import { CustomButton } from '../../components/button';
import { Nav } from '../../router/navigator';
import PropTypes from 'prop-types';
import Home from './home';

const FirstRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#ff4081' }]} />
);

const SecondRoute = (props) => (
  <View style={[styles.scene, { backgroundColor: '#673ab7' }]}>
    <TouchableOpacity style={{
      width: 200,
      height: 200,
      backgroundColor: 'red'
    }} onPress={()=> {
      Nav({ title: 'props.title', page: 'ark.Home', param: null, ID: props.componentId, header: false })      
    }} />
    </View>
);

const initialLayout = { width: Dimensions.get('window').width };

export default function TabViewExample() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'First' },
    { key: 'second', title: 'Second' },
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute
  });

  const _renderTabBar = (props) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);

    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          const color = Animated.color(
            Animated.round(
              Animated.interpolate(props.position, {
                inputRange,
                outputRange: inputRange.map(inputIndex =>
                  inputIndex === i ? 255 : 0
                ),
              })
            ),
            0,
            0
          );

          return (
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setIndex(i)}>
              <Animated.Text style={{ color }}>{route.title}</Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <TabView
      swipeEnabled
      lazy      
      tabBarPosition={'bottom'}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={_renderTabBar}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
    />
  );
}

TabViewExample.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

SecondRoute.propTypes = {
  navigator: PropTypes.object,
  componentId: PropTypes.string
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    // paddingTop: Constants.statusBarHeight,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
});

