import React from 'react';

import {CardItem, Button, Icon} from 'native-base';
import {View, Text} from 'react-native';

export class LoginButton extends React.Component {
  btnProps = {
    style: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center'
    }
  };

  btnTextProps = {
    style: {
      color: 'white',
      fontWeight: 'bold'
    }
  };

  cardProps = {
    style: this.props.styles.cardItem,
    key: 'formButton',
    flexDirection: 'row',
    justifyContent: 'center'
  };

  render () {
    if (this.props.authorized === true) {
      return (
        <CardItem {...this.cardProps}>
          <Button
            {...this.btnProps}
            onPress={() => this.props.onPress('logout')}
            danger
          >
            <Text {...this.btnTextProps}>Logout</Text>
          </Button>
        </CardItem>
      );
    } else if (this.props.authorized === false) {
      return (
        <CardItem {...this.cardProps}>
          <Button
            {...this.btnProps}
            onPress={() => this.props.onPress('login')}
            active={this.props.active}
          >
            <Text {...this.btnTextProps}>Login</Text>
          </Button>
        </CardItem>
      );
    } else {
      return (<Button disabled {...this.btnProps} />);
    }
  }
}

export class LoginState extends React.Component{
  render () {
    if (this.props.authenticating) { return <View />; }
    return (
      <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
        {this.props.authorized
          ? <Icon style={{color: 'green', flex: 1}} name='ios-checkmark' />
          : <Icon style={{color: 'red', flex: 1}} name='ios-close' />}
        <Text style={{flex: 8}}>
          {this.props.authorized
            ? 'Logged in'
            : 'Not logged in'}
        </Text>
      </View>
    );
  }
}