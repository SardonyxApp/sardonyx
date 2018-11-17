/**
 * @fileoverview stores necessary styles and colors
 * @author SardonyxApp
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
  'white': '#fff',
  'blue': '#2977b6',
  'error': '#f44138',
  'inactive': '#c2c2c2',
  'lightPrimary': '#eda67b',
  'darkBackground': '#8c8c8b',
  'lightBackground': '#eee'
};

/*modularized styles*/
const styles = StyleSheet.create({
  //apply to any
  padding5: {
    padding: 5
  },
  padding10: {
    padding: 10
  },
  padding20: {
    padding:20
  },
  hidden: {
    display: 'none'
  },

  //apply to View
  fullScreen: {
    height: '100%',
    width: '100%'
  },
  width90Percent: {
    width: '90%'
  },
  alignChildrenCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  lightBackground: {
    backgroundColor: colors.lightBackground
  },
  transparentBackground: {
    backgroundColor: 'transparent'
  },
  roundCorners: {
    borderRadius: 16
  },

  //apply to Text
  h1: {
    fontSize: 28,
    marginTop: 5,
    marginBottom: 5
  },
  p: {
    fontSize: 12
  },
  small: {
    fontSize: 10
  },
  tiny: {
    fontSize: 8
  },
  link: {
    color: colors.primary
  },
  alignCenter: {
    textAlign: 'center'
  },
  light: {
    fontWeight: '100'
  },
  regular: {
    fontWeight: '400'
  },
  error: {
    color: colors.error
  },

  //apply to Image
  logoIcon: {
    height: 100,
    width: 100
  }
});

/*useful abstractions*/
const preset = {
  loginBox: [styles.alignChildrenCenter, styles.lightBackground, styles.padding20, styles.width90Percent, styles.roundCorners],
  inputLine: [styles.padding10]
};

export { styles, colors, preset };