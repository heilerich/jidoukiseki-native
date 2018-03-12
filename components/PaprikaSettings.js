import React, {Component} from 'react';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {removeAuthString, setAuthString} from '../store/store';

import {Text, StyleSheet} from 'react-native';
import {Form, Item, Input, Label, Card, CardItem,
  Spinner, Body, Right, H3} from 'native-base';

import {PapApi} from './PaprikaApi';

import {LoginButton, LoginState} from './login';

class PaprikaSettings extends Component {
  constructor () {
    super();
    this.state = {
      authenticating: false,
      user: '',
      pass: ''
    };
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  async handleButtonClick (action) {
    if (action === 'login') {
      this.props.setAuthString(this.state.user, this.state.pass);
      this.setState({
        ...this.state,
        authenticating: true
      });
    } else if (action === 'logout') {
      this.props.removeAuthString();
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.authorized && nextProps.authorized) {
      this.checkAuth(nextProps.authString);
    }
  }

  async checkAuth (auth) {
    try {
      const res = await new PapApi(auth).checkAuth();
      if (res.result !== undefined) {
        this.setState({
          ...this.state,
          authenticating: false,
          authFailed: false
        });
      } else {
        this.props.removeAuthString();
        this.setState({
          ...this.state,
          authenticating: false,
          authFailed: true
        });
      }
    } catch (e) {
      this.props.removeAuthString();
      this.setState({
        ...this.state,
        authenticating: false,
        authFailed: true
      });
    }
    return true;
  }

  loginForm () {
    if (this.props.authorized !== true) {
      return (
        <CardItem key='formItems' style={styles.cardItem}>
          {(this.state.authFailed || false) ? <Text>Authentication failed</Text> : null}
          <Form>
            <Item floatingLabel>
              <Label>Username</Label>
              <Input
                target='user'
                onChangeText={(text) => this.setState({user: text})}
                value={this.state.user}
              />
            </Item>
            <Item floatingLabel>
              <Label>Password</Label>
              <Input
                secureTextEntry
                target='pass'
                value={this.state.pass}
                onChangeText={(text) => this.setState({pass: text})}
              />
            </Item>
          </Form>
        </CardItem>
      );
    }
  }

  innerForm (authenticating) {
    if (authenticating) {
      return (
        <CardItem>
          <Spinner />
        </CardItem>
      );
    } else {
      return [
        this.loginForm(),
        <CardItem key='loginButton'>
          <LoginButton
            onPress={this.handleButtonClick}
            authorized={this.props.authorized}
            active={!(this.state && this.state.user && this.state.pass)}
            styles={styles}
          />
        </CardItem>
      ];
    }
  }

  render () {
    return (
      <Card>
        <CardItem header>
          <Body>
            <H3>Paprika Authorization</H3>
          </Body>
          <Right>
            <LoginState
              authenticating={this.state.authenticating}
              authorized={this.props.authorized}
            />
          </Right>
        </CardItem>
        {this.innerForm(this.state.authenticating)}
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  cardItem: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center'
  }
});

const mapStateToProps = ({papStore}) => ({
  authorized: papStore.authorized,
  authString: papStore.authString
});

const mapDispatchToProps = (dispatch) => {
  return {
    setAuthString: bindActionCreators(setAuthString, dispatch),
    removeAuthString: bindActionCreators(removeAuthString, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PaprikaSettings);
