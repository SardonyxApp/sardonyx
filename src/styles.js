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
  tiny: {
    fontSize: 8
  },
  link: {
    color: colors.primary
  },
  alignCenter: {
    textAlign: 'center'
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
  loginBox: [styles.alignChildrenCenter, styles.lightBackground, styles.padding20, styles.width90Percent, styles.roundCorners]
};

export { styles, colors, preset };