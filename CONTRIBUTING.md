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
  * [Testing](#testing-1)
  * [Production](#production-1)
    * [Front End](#front-end-1)
    * [Back End](#back-end-1)
    * [Full Stack](#full-stack-1)
  * [Deployment](#deployment)
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
$ npm test
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
```sh
PORT=3000
```
Check the server.js file and define any other variables necessary. Variables in `.env` are referred to as `process.env.VARIABLE_NAME`.

## Development
### Front End 
Start the Webpack Dev Server. 
```
$ npm run client-dev
```
Navigate to `localhost:8080`.

### Back End
Start the Express server using nodemon. Server will be started at `localhost:PORT` as defined in `.env`.
```
$ npm run server-dev
```

### Full Stack
Start both the Webpack Dev Server and the Express server.
```
$ npm run dev
```

## Testing
Jest tests can be used to test the Express server.
```
$ npm test
```

To run a specific test suite, append the name of the test.
```
$ npm test api
```

You may need to store personal information in the `.env` file. 
```sh
# Managebac cedentials
LOGIN="foo@bar.com"
PASSWORD="foobar1234"

# Managebac cookies 
CFDUID="cfduid=foobar"
MANAGEBAC_SESSION="_managebac_session=foobar"

# A random class page that you want to test 
CLASS_ID="123456"
GROUP_ID="123456"
ASSIGNMENT_ID="123456"
DISUCSSION_ID="123456"
NOTIFICATION_ID="123456"
```

To run a custom test, create a `tmp.test.js` file under `__tests__`. 

## Production
### Front End
Compile files using Webpack.
```
$ npm run client
```

### Back End
Start the Express server. Server will be started at `localhost:PORT` as defined in `.env`.
```
$ npm start
```

### Full Stack
Compile front end files using Webpack and start the Express server that serves the compiled files.
```
$ npm run build
```
Navigate to `localhost:PORT` as defined in `.env`

## Deployment
Do not deploy broken builds. Deploy with extra care. Code can be tested with console on [Glitch](https://glitch.com).

Login to [Google Cloud Platform](https://console.cloud.google.com).

Navigate to `App Engine` and open the shell.

Execute the following:
```
$ cd sardonyx-server
$ npm install 
$ npm run client
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
