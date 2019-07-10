/**
 * @fileoverview stores necessary styles and colors
 * @author SardonyxApp
 * @license MIT
 * @example import { styles, colors } from './src/styles.js';
 */

import { StyleSheet } from 'react-native';

/**
 * The colors are generated with the following method:
 * dark: [1/2] original (50%) #000000 (50%)
 * dark2: [1/6] original (16.6%) #000000 (83.4%)
 * light: [1/6] original (50%) #ffffff (50%)
 * light2: [1/6] original (16.6%) #ffffff (83.4%)
 */
const colors = {
  primary: '#d17b46',
  darkPrimary: '#693E23',
  darkPrimary2: '#23150C',
  lightPrimary: '#E8BDA3',
  lightPrimary2: '#F7E9E0',

  blue: '#2977b6',
  darkBlue: '#153C5B',
  darkBlue2: '#07141E',
  lightBlue: '#94BBDB',
  lightBlue2: '#DBE8F3',

  error: '#f44138',
  darkError: '#7A211C',
  darkError2: '#290B09',
  lightError: '#FAA09C',
  lightError2: '#FDDFDE',

  black: '#332927',
  gray1: '#d8d8e0',
  gray2: '#babbc2',
  white: '#fff',

  inactive: '#c2c2c2',
  darkBackground: '#8c8c8b',
  lightBackground: '#f8f8fa'
};

const fonts = StyleSheet.create({
  jost200: {
    fontFamily: 'Jost-200'
  },
  jost300: {
    fontFamily: 'Jost-300'
  },
  jost400: {
    fontFamily: 'Jost-400'
  },
  jost500: {
    fontFamily: 'Jost-500'
  },
  jost800: {
    fontFamily: 'Jost-800'
  }
});

const elevations = StyleSheet.create({
  one: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1
  },
  two: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2
  },
  three: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3
  },
  four: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4
  },
  ten: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10
  },
  thirteen: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,

    elevation: 13
  }
});

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
    padding: 20
  },
  hidden: {
    display: 'none'
  },

  //apply to View
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
  },
  icon: {
    height: 24,
    width: 24
  }
});

/*useful abstractions*/
const preset = {
  loginBox: [
    styles.alignChildrenCenter,
    styles.lightBackground,
    styles.padding20,
    styles.width90Percent,
    styles.roundCorners,
    elevations.four
  ],
  inputLine: [
    styles.padding10,
    {
      borderColor: colors.primary,
      borderWidth: 1,
      backgroundColor: colors.white
    }
  ]
};

const labelColors = name => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    let hexaDecimal = (hash >> (i * 8)) & 0xff;
    color += ('00' + hexaDecimal.toString(13)).substr(-2);
  }
  return color;
};

export { styles, colors, preset, labelColors, fonts, elevations };
