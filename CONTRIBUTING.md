**Important**: We will only accept contributions from trusted authors.

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
* Node 10.x or later / NPM
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

In `evn.json`, set the `BASE_URL` environment variable to the url of the sardonyx-server.
```json
{
  "BASE_URL": "http://192.168.x.x:3000" 
}
```
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
See Expo documentation. 

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
* Node (8.x) / NPM 
* MySQL (5.7) or MariaDB (10.13)

Node 10.x is known to have testing problems. 

MySQL 8 will not work with the Node MySQL client unless it is set to authenticate with `mysql_native_password`. 

Anything lower than MySQL 5.6 will require shorter VARCHAR sizes.

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

Configure MySQL to use utf8mb4. (This may not be needed for some Linux installations.)

Modify (or create) `my.cnf`:
```
[mysqld]
character-set-server=utf8mb4

[client]
default-character-set=utf8mb4

[mysql]
default-character-set=utf8mb4
```

Start MySQL.

Open the mysql prompt (steps may differ), and create the database.
```
$ mysql -h localhost -u root -p
mysql > CREATE DATABASE sardonyx;
mysql > USE sardonyx;
mysql > source /path/to/setup.sql
```

Check character set variables. The names set in `my.cnf` should be correct.
```
mysql > SHOW VARIABLES LIKE 'char%';
```

Navigate to the `sardonyx-server` directory, create and edit a .env file. (`touch` and `vi` command only available on Bash: on windows, just use a text editor)
```
$ touch .env
$ vi .env
```

Define environment variables as appropriate.
```sh
PORT=3000
PRIVATE_KEY="abcdef" # Used to encode JWTs
MODE="development" # Options: development or production 

DB_HOST="localhost"
DB_LOGIN="root" # Or however you have set the database up in your machine
DB_PASSWORD="root" 
DB_DATABASE="sardonyx" # Name of the database 
DB_INSTANCE="sardony-app:asia-northeast1:sardonyx-db" # <project name>:<region>:<instance connection name>
```

Check the server files and define any other variables necessary. Variables in `.env` are referred to as `process.env.VARIABLE_NAME`.

## Development
### Front End 
Start Webpack watch. 
```
$ npm run client-dev
```
Navigate to `localhost:8080`.

### Back End
Start the Express server using nodemon. Server will be started at `HOST:PORT` as defined in `.env`.
```
$ npm run server-dev
```

### Full Stack
Start both Webpack watch and the Express server.
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
Do not deploy broken builds.

Login to [Google Cloud Platform](https://console.cloud.google.com).

Navigate to `App Engine` and open the shell.

Make sure the `.env` file is defined properly, as listed in the Installation and Testing sections above.

Execute the following:
```
$ cd sardonyx-server
$ npm ci
$ npm run client 
```

Make sure that the server starts properly:
```
$ npm start
```

Then, deploy.
```
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
