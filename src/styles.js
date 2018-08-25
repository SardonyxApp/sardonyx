/**
 * @fileoverview stores necessary styles and colors
 * @author Natsu Ozawa, Yuto Takano
 * @license MIT
 * @example import { styles, colors } from './src/styles.js';
 */

import { StyleSheet } from 'react-native';

const colors = {
  'primary': '#d17b46',
  'secondary': '#6e4d12',
  'black': '#332927',
  'gray1': '#d8d8e0',
  'gray2': '#babbc2',
  'darkBackground': '#8c8c8b',
  'lightBackground': '#eee',
  'white': '#fff',
  'error': '#f44138'
};

const styles = StyleSheet.create({
  //apply to any
  error: {
    color: colors.error
  },
  //apply to View
  containerAlignChildrenCenter: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerLightBackgroundBox: {
    backgroundColor: colors.lightBackground,
    borderRadius: 16,
    width: '80%',
    padding: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  //apply to Text
  h1: {
    fontSize: 28,
    marginTop: 5,
    marginBottom: 5
  },
  p: {
    fontSize: 14
  },
  link: {
    color: colors.primary
  },
  textAlignCenter: {
    textAlign: 'center'
  },
  //apply to logo icon
  logoIcon: {
    height: 100,
    width: 100
  }
});

export { styles, colors };