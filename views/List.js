import React from 'react';

import {Container, Content, Icon, Button} from 'native-base';
import {StackNavigator} from 'react-navigation';

import TemplatingList from '../components/TemplatingList';
import PaprikaList from '../components/PaprikaList';

class Settings extends React.Component {
  static navigationOptions = ({navigation}) => {
    const params = navigation.state.params || {};

    return {
      title: 'List',
      headerRight: (
        <Button
          transparent
          onPress={params.resetAction}
        >
          <Icon
            name='ios-refresh'
            style={{fontSize: 35}}
          />
        </Button>
      )
    }
  };

  state = {
    isSwiping: false
  };

  componentWillMount () {
    this.props.navigation.setParams({ resetAction: this.handleResetButton });
  }

  handleResetButton = () => {
    this.refs['templateList'].getWrappedInstance().handleResetButton();
    this.refs['paprikaList'].getWrappedInstance().handleResetButton();
  };

  render () {
    return (
      <Container>
        <Content scrollEnabled={!this.state.isSwiping}>
          <TemplatingList
            setSwipe={(state) => this.setState({isSwiping: state})}
            ref='templateList'/>
          <PaprikaList
            setSwipe={(state) => this.setState({isSwiping: state})}
            ref='paprikaList'
          />
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
    title: 'List'
  };

  render () {
    return (
      <RootStack />
    );
  }
}
