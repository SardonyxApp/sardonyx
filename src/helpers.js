/**
 * @fileoverview Helper modules to import
 * @author SardonyxApp
 * @license MIT 
 * @example import * from './src/helpers.js'
 */

import React from 'react';

/**
 * Interface with SecureStore
 */

import { SecureStore } from 'expo';

class StorageClass extends React.Component {
  /**
   * @description Retrieve Managebac tokens from SecureStore
   * @returns {Promise}
   * @example RetrieveTokens().then(tokens => console.log(tokens));
   */
  async retrieveTokens() {
    const arr = await Promise.all([
      SecureStore.getItemAsync('cfdiud'),
      SecureStore.getItemAsync('managebacSession')
    ]);
    if (arr[0] && arr[1]) {
      return JSON.stringify({
        cfdiud: arr[0],
        managebacSession: arr[1]
      });
    }
    //return null if the token is invalid
    return null;
  }

  /**
   * @description Retreive Managebac tokens, login, and password from SecureStore
   * @returns {Promise}
   * @example RetrieveCredentials().then(credentials => console.log(credentials));
   */
  async retrieveCredentials() {
    return Promise.all([
      SecureStore.getItemAsync('cfdiud'),
      SecureStore.getItemAsync('managebacSession'),
      SecureStore.getItemAsync('login'),
      SecureStore.getItemAsync('password')
    ]).then(arr => {
      if (arr[0] && arr[1] && arr[2] && arr[3]) {
        return JSON.stringify({
          cfdiud: arr[0],
          managebacSession: arr[1],
          login: arr[2],
          password: arr[3]
        });
      }
      //return null if the token is invalid
      return '{}';
    });
  }

  /**
   * @description Retrieve requested value from SecureStore
   * @param {string} key
   * @returns {Promise}
   * @example RetrieveValue().then(val => console.log(val));
   */
  async retrieveValue(key) {
    return SecureStore.getItemAsync(key);
  }

  /**
   * @description Write Managebac login and password to SecureStore 
   * @param {Object} tokens 
   * @returns {Promise}
   * @example WriteTokens().then(() => console.log('done')).catch(err => console.error(err));
   * Must catch error in the case of invalid tokens
   */
  async writeTokens(tokens) {
    if (tokens.login && tokens.password) {
      return Promise.all([
        SecureStore.setItemAsync('cfdiud', tokens.cfdiud),
        SecureStore.setItemAsync('managebacSession', tokens.managebacSession)
      ]);
    }
    return new Promise((resolve, reject) => {
      reject(new Error('Invalid server response.'));
    });
  }

  /**
   * @description Write Managebac credentials to SecureStore
   * @param {Object} credentials
   * @returns {Promise}
   * @example WriteCredentials().then(() => console.log('done')).catch(err => console.error(err));
   * Musst catch error in the case of invalid credentials
   */
  async writeCredentials(credentials) {
    if (credentials.cfdiud && credentials.managebacSession && credentials.login && credentials.password) {
      return Promise.all([
        SecureStore.setItemAsync('cfdiud', credentials.cfdiud),
        SecureStore.setItemAsync('managebacSession', credentials.managebacSession),
        SecureStore.setItemAsync('login', credentials.login),
        SecureStore.setItemAsync('password', credentials.password)
      ]);
    }
    return new Promise((resolve, reject) => {
      reject(new Error('Invalid server response.'));
    });
  }

  /**
   * @description Write requested key value 
   * @param {String} key 
   * @param {String} value 
   * @returns {Promise}
   * @example WriteValue().then(() => console.log('done')).catch(err => console.error(err));
   * Musts catch error in the case of invalid key or value
   */
  async writeValue(key, value) {
    return SecureStore.setItemAsync(key, value);
  }

  /**
   * @description Delete Managebac tokens, login, and password
   * @returns {Promise}
   * @example DeleteCredentials().then(() => console.log('done')).catch(err => console.error(err));
   */
  async deleteCredentials() {
    return Promise.all([
      SecureStore.deleteItemAsync('cfdiud'),
      SecureStore.deleteItemAsync('managebacSession'),
      SecureStore.deleteItemAsync('login'),
      SecureStore.deleteItemAsync('password')
    ]);
  }

  /**
   * @description Delete Managebac tokens 
   * @returns {Promise}
   * @example DeleteTokens().then(() => console.log('done')).catch(err => console.error(err));
   */
  async deleteTokens() {
    return Promise.all([
      SecureStore.deleteItemAsync('cfdiud'),
      SecureStore.deleteItemAsync('managebacSession')
    ]);
  }

  /**
   * @description Delete requested key value
   * @param {String} key
   * @returns {Promise}
   * @example DeleteValue().then(() => console.log('done')).catch(err => console.error(err));
   */
  async deleteValue(key) {
    return SecureStore.deleteItemAsync(key);
  };
}

const Storage = new StorageClass(); //instantiate class
export { Storage };