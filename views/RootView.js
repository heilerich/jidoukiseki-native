import React from 'react';
import {connect} from 'react-redux';

import Settings from './Settings';
import List from './List';

import {TabNavigator} from 'react-navigation';
import {Icon} from 'native-base';

const RootNavigator = TabNavigator(
  {
    list: {
      screen: List
    },
    settings: {
      screen: Settings
    }
  },
  {
    navigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused, tintColor}) => {
        const {routeName} = navigation.state;
        let iconName;
        if (routeName === 'list') {
          iconName = `ios-list${focused ? '' : '-outline'}`;
        } else if (routeName === 'settings') {
          iconName = `ios-settings${focused ? '' : '-outline'}`;
        }
        return <Icon name={iconName} style={{fontSize: 25, color: tintColor}} />;
      }
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray'
    }
  }
);

class RootView extends React.Component {
  render () {
    return (
      <RootNavigator />
    );
  }
}

const mapStateToProps = ({wApi, settings}) => ({
  authenticated: wApi.authorized,
  listsSet: (settings.target !== null) && (settings.template !== null)
});

export default connect(mapStateToProps)(RootView);
