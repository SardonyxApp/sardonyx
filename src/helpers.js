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

/**
 * @description Retrieve Managebac tokens from SecureStore
 * @returns {Promise}
 * @example RetrieveManagebacTokens().then(tokens => console.log(tokens));
 */
export const RetrieveManagebacTokens = async () => {
  return Promise.all([
    SecureStore.getItemAsync('cfdiud'),
    SecureStore.getItemAsync('managebacSession')
  ]).then(arr => {
    if (arr[0] && arr[1]) {
      return JSON.stringify({
        cfdiud: arr[0],
        managebacSession: arr[1]
      });
    }
    //return null if the token is invalid
    return null;
  });
};

/**
 * @description Retreive Managebac tokens, login, and password from SecureStore
 * @returns {Promise}
 * @example RetrieveManagebacToken().then(token => console.log(token));
 */
export const RetrieveManagebacCredentials = async () => {
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
};

/**
 * @description Retrieve requested value from SecureStore
 * @param {string} key
 * @returns {Promise}
 * @example RetrieveValue().then(val => console.log(val));
 */
export const RetrieveValue = async (key) => {
  return SecureStore.getItemAsync(key);
};

/**
 * @description Write Managebac login and password to SecureStore 
 * @param {Object} tokens 
 * @returns {Promise}
 * @example WriteManagebacCredentials().then(() => console.log('done')).catch(err => console.error(err));
 * Must catch error in the case of invalid tokens
 */
export const WriteManagebacTokens = async (tokens) => {
  if (tokens.login && tokens.password) {
    return Promise.all([
      SecureStore.setItemAsync('cfdiud', tokens.cfdiud),
      SecureStore.setItemAsync('managebacSession', tokens.managebacSession)
    ]);
  }
  return new Promise((resolve, reject) => {
    reject(new Error('Invalid server response.'));
  });
};

/**
 * @description Write Managebac credentials to SecureStore
 * @param {Object} credentials
 * @returns {Promise}
 * @example WriteManagebacCredentials().then(() => console.log('done')).catch(err => console.error(err));
 * Musst catch error in the case of invalid credentials
 */
export const WriteManagebacCredentials = async (credentials) => {
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
};

/**
 * @description Write requested key value 
 * @param {String} key 
 * @param {String} value 
 * @returns {Promise}
 * @example WriteValue().then(() => console.log('done')).catch(err => console.error(err));
 * Musts catch error in the case of invalid key or value
 */
export const WriteValue = async (key, value) => {
  return SecureStore.setItemAsync(key, value);
};

