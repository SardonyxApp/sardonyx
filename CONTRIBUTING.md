**Important**: We will only accept contributions from trusted authors within Tokyo Metropolitan Kokusai High School.

## Table of Contents

<!-- toc -->

- [The app (mobile client)](#the-app-mobile-client)
  * [Installation](#installation)
  * [Development](#development)
  * [Testing](#testing)
  * [Production](#production)
  * [Ejection](#ejection)
- [The server (backend)](#the-server-backend)
  * [Installation](#installation-1)
  * [Development](#development-1)
    * [Front End](#front-end)
    * [Back End](#back-end)
    * [Full Stack](#full-stack)
  * [Production](#production-1)
    * [Front End](#front-end-1)
    * [Full Stack](#full-stack-1)
- [Guidelines](#guidelines)
  * [Style](#style)
  * [Logo](#logo)
  * [Platform Support](#platform-support)

<!-- tocstop -->

# The app (mobile client)
Tools needed:
* Git
* Node / NPM
* Android Studio (optional)
* Expo Mobile App (optional)

To see the app, either Android Studio or the Expo App is needed.

## Installation
Clone this repository and navigate to it.
```
$ git clone https://github.com/SardonyxApp/sardonyx.git
$ cd sardonyx
```
Install dependencies.
```
$ npm install
```

Do NOT run `npm run audit` or change the React Native version. 

## Development
Run development mode.
```
$ npm start
```
When ready, do one of the following:
* Press `a` to start Android Emulation on Android Studio
* Scan the QR code on the terminal on the Expo Mobile App to test on an actual Android device.
* Press `i` and following the instructions to test on an iOS device.

## Testing
Jest is included with Expo for testing.
```
$ npm run test
```

## Production
This is not necessary except when releasing a new version.

Produce Android app.
```
$ npm run android
```

Produce iOS app.
```
$ npm run ios
```

## Ejection
DO NOT EJECT UNLESS WE AGREE.
```
$ npm run eject
```
Ejection is only necessary when native code is needed. 

# The server (backend)
Tools needed:
* Git
* Node / NPM

## Installation
Clone this repository and navigate to it.
```
$ git clone https://github.com/SardonyxApp/sardonyx-server.git
$ cd sardonyx-server
```
Install dependencies.
```
$ npm install
```
Make and edit a .env file. (`touch` and `vi` command only available on Bash: on windows, just use a text editor)
```
$ touch .env
$ vi .env
```
Define `PORT` as appropriate.
```
PORT=8080
```
Check the server.js file and define any other variables necessary. Variables in `.env` are referred to as `process.env.VARIABLE_NAME`.

## Development
### Front End 
Start the Webpack Dev Server. 
```
$ npm run dev
```
Navigate to `localhost:8080`.

### Back End
Start the Express server. Server will be started at `localhost:PORT` as defined in `.env`.
```
$ npm run server
```

### Full Stack
Start both the Webpack Dev Server and the Express server.
```
$ npm start
```

## Production
### Front End
Compile files using Webpack.
```
$ npm run webpack
```

### Full Stack (Production)
Compile front end files using Webpack and start the Express server that serves the compiled files.
```
$npm run build
```
Navigate to `localhost:PORT` as defined in `.env`

## Deployment (GCP)
Do not deploy broken builds. Deploy with extra care. Code can be tested with console on [Glitch](https://glitch.com).

Login to [Google Cloud Platform](https://console.cloud.google.com).

Navigate to `App Services` and open the shell.

Execute
```
$ cd sardonyx-server
$ gcloud app deploy
```

# Guidelines
## Style
The following colors are primarily used:
* Brown (Primary): `#d17b46`
* Brown (Secondary): `#6e4d12`
* Black: `#332729`
* Gray 1: `#d8d8e0`
* Gray 2: `#babbc2`
* White: `#fff`
* Background Gray: `#8c8c8b`

See `sardonyx/src/styles.js` for more colors.

## Logo
Prefer SVG and transparent background.

## Platform Support
iOS and Android versions supported by React Native and Expo.
