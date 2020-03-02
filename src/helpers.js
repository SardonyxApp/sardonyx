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

import * as SecureStore from 'expo-secure-store';

class StorageClass extends React.Component {
  /**
   * @description Retreive login and password from SecureStore
   * @returns {Promise}
   * @example RetrieveCredentials().then(credentials => console.log(credentials));
   */
  async retrieveCredentials() {
    return Promise.all([
      SecureStore.getItemAsync('login'),
      SecureStore.getItemAsync('password')
    ]).then(arr => {
      if (arr[0] && arr[1]) {
        return {
          login: arr[0],
          password: arr[1]
        };
      }
      //return empty object if the store is invalid
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
   * @description Write credentials to SecureStore
   * @param {Object} credentials
   * @returns {Promise}
   * @example WriteCredentials().then(() => console.log('done')).catch(err => console.error(err));
   * Musst catch error in the case of invalid credentials
   */
  async writeCredentials(credentials) {
    if (credentials.login && credentials.password) {
      return Promise.all([
        SecureStore.setItemAsync('login', credentials.login),
        SecureStore.setItemAsync('password', credentials.password),
      ]);
    }
    return new Promise((resolve, reject) => {
      reject(new Error('Invalid credentials.'));
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
   * @description Delete token, login, and password
   * @returns {Promise}
   * @example DeleteCredentials().then(() => console.log('done')).catch(err => console.error(err));
   */
  async deleteCredentials() {
    return Promise.all([
      SecureStore.deleteItemAsync('login'),
      SecureStore.deleteItemAsync('password'),
      SecureStore.deleteItemAsync('sardonyxToken')
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
  }
}

const Storage = new StorageClass(); //instantiate class

/**
   * @description Convert object to formData
   * @param {@Object} obj 
   */
const toFormData = obj => {
  const fd = new FormData();
  for (key in obj) {
    fd.append(key, obj[key]);
  }
  return fd;
};

export { Storage, toFormData };
