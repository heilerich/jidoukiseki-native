import React from 'react';

import {AuthSession} from 'expo';

const CLIENT_ID = '7b1d247eb78e252069e8';
const CLIENT_SECRET = '5c6b0b13d2217ebaf50315159308f3fd7226c31610179eec4fb6bc870b71';

async function postData(url, data) {
  return fetch(url, {
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json'
    },
    method: 'POST',
    redirect: 'follow',
    referrer: 'no-referrer',
  }).then(response => response.json())
}

export default class WunderlistAuthenticator {
  constructor () {
    this.state = {
      redirectUrl: AuthSession.getRedirectUrl(),
      randomState: Math.floor((Math.random() * 100000) + 1).toString()
    };
    console.log(this.state.redirectUrl);
  }

  authenticate = async () => {
    let result = await AuthSession.startAsync({
      authUrl:
        `https://www.wunderlist.com/oauth/authorize?` +
        `state=${this.state.randomState}`+
        `&client_id=${CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(this.state.redirectUrl)}`,
    });
    if (result.type !== 'success') {
      alert('Uh oh, something went wrong');
      throw 'authsession';
    }

    let code = result.params.code;
    let state = result.params.state;
    if (state !== this.state.randomState) {throw 'loginresponse';}

    try {
      let tokenResponse = await postData(
        'https://www.wunderlist.com/oauth/access_token',
        {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code: code
        }
      );
      return {token: tokenResponse.access_token, clientID: CLIENT_ID};
    } catch (e) {
      console.log(`Error authenticating Wunderlist ${e}`);
      throw 'codeexchange';
    }
  }
}