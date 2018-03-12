import React, {Component} from 'react';

import axios from 'axios';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setTargetList, setTemplateList, removeApiToken, setUserLists,
  setApiToken, setApiClientID } from '../store/store';

import {Card, CardItem, H3, Body, Right, Picker} from 'native-base';
import {LoginButton, LoginState} from './login';
import {Text, StyleSheet} from 'react-native';

import WunderlistAuthenticator from './WunderlistAuthenticator';

class WunderlistSettings extends Component {
  constructor () {
    super();
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }
  async componentDidMount () {
    if (this.props.authorized) {
      this.updateLists();
    }
  }

  async updateLists () {
    const wapi = axios.create({
      baseURL: 'https://a.wunderlist.com/api/v1/',
      headers: {
        'X-Access-Token': this.props.apiToken,
        'X-Client-ID': this.props.apiClientID
      }
    });
    try {
      const res = await wapi.get('lists');
      this.props.setLists(res.data);
    } catch (error) {
      this.props.removeApiToken();
    }
  }

  async handleButtonClick (action) {
    if (action === 'login') {
      const auth = new WunderlistAuthenticator();
      try {
        const {token, clientID} = await auth.authenticate();
        this.props.setApiToken(token);
        this.props.setApiClientID(clientID);
        this.updateLists();
      } catch (error) {
        console.warn(error);
      }
    } else if (action === 'logout') {
      this.props.removeApiToken();
    }
  }

  listContent () {
    if (this.props.lists) {
      return this.props.lists.map((object, key) => {
        return ({key: key, value: object.id, text: object.title});
      });
    } else {
      return [];
    }
  }

  render () {
    const visibleOnLogin = {display: this.props.authorized && this.props.lists !== null ? 'flex' : 'none'};
    return (
      <Card>
        <CardItem header>
          <Body>
            <H3>Wunderlist Authorization</H3>
          </Body>
          <Right>
            <LoginState
              authenticating={false}
              authorized={this.props.authorized}
            />
          </Right>
        </CardItem>
        <CardItem>
          <LoginButton
            onPress={this.handleButtonClick}
            authorized={this.props.authorized}
            active={!(this.state && this.state.user && this.state.pass)}
            styles={styles}
            key='loginButton'
          />
        </CardItem>
        <CardItem style={{...visibleOnLogin}}>
          <Text>Template List</Text>
        </CardItem>
        <CardItem style={{...visibleOnLogin}}>
          <Picker
            selectedValue={this.props.templateValue}
            iosHeader='Select Template List'
            placeholder='Nothing selected'
            onValueChange={(val) => this.props.setTemplateList(val)}
          >
            {this.listContent().map((item) => <Picker.Item key={item.key} label={item.text} value={item.value} />)}
          </Picker>
        </CardItem>
        <CardItem style={{...visibleOnLogin}}>
          <Text>Target List</Text>
        </CardItem>
        <CardItem style={{...visibleOnLogin}}>
          <Picker
            selectedValue={this.props.targetValue}
            iosHeader='Select Target List'
            placeholder='Nothing selected'
            onValueChange={(val) => this.props.setTargetList(val)}
          >
            {this.listContent().map((item) => <Picker.Item key={item.key} label={item.text} value={item.value} />)}
          </Picker>
        </CardItem>
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

const mapStateToProps = ({ wApi, settings, wData }) => ({
  apiToken: wApi.token,
  apiClientID: wApi.clientID,
  targetValue: settings.target,
  templateValue: settings.template,
  authorized: wApi.authorized,
  lists: wData.lists
});

const mapDispatchToProps = (dispatch) => {
  return {
    setTargetList: bindActionCreators(setTargetList, dispatch),
    setTemplateList: bindActionCreators(setTemplateList, dispatch),
    removeApiToken: bindActionCreators(removeApiToken, dispatch),
    setLists: bindActionCreators(setUserLists, dispatch),
    setApiToken: bindActionCreators(setApiToken, dispatch),
    setApiClientID: bindActionCreators(setApiClientID, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WunderlistSettings);
