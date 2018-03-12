import axios from "axios";

const DEBUG = false;

export default class WunderlistApi {
  constructor (token, clientID) {
    this.wapi = axios.create({
      baseURL: 'https://a.wunderlist.com/api/v1/',
      headers: {
        'X-Access-Token': token,
        'X-Client-ID': clientID
      }
    });
    this.wapi.interceptors.request.use(function (config) {
      if (DEBUG) console.log(`Request ${JSON.stringify(config)}`);
      return config;
    }, function (error) {
      if (DEBUG) console.log(`Request Error ${JSON.stringify(error)}`);
      return Promise.reject(error);
    });

    this.wapi.interceptors.response.use(function (response) {
      if (DEBUG) console.log(`Response ${JSON.stringify(response)}`);
      return response;
    }, function (error) {
      if (DEBUG) console.log(`Response Error ${JSON.stringify(error)}`);
      return Promise.reject(error);
    });
  }
}
