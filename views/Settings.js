import React from 'react';

import PaprikaSettings from '../components/PaprikaSettings';
import WunderlistSettings from '../components/WunderlistSettings';

import {Container, Content, Icon} from 'native-base';
import {StackNavigator} from 'react-navigation';

class Settings extends React.Component {
  static navigationOptions = {
    title: 'Settings'
  };

  render () {
    return (
      <Container>
        <Content>
          <WunderlistSettings />
          <PaprikaSettings />
        </Content>
      </Container>
    );
  }
}

const RootStack = StackNavigator({
  settingsRoot: Settings
});

export default class rootView extends React.Component {
  static navigationOptions = {
    title: 'Settings'
  };

  render () {
    return (
      <RootStack />
    );
  }
}
