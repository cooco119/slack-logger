# slack-logger

A node.js package for reading and sending log to slack api. 
You can see your server logs in your slack!

## Getting Started

You first need to setup slack webhook api in here. [Building Slack Apps](https://api.slack.com/slack-apps)

Also, obviously, you need a working server with any logger attached! 

### Prerequisites

You need 
 * [node.js](https://nodejs.org/en/download/)
 * [yarn](https://yarnpkg.com/lang/en/docs/install/#debian-stable)
 
installed in your environment.


### Install & start
* Install node modules
```
  npm install
```

* Change logger.config.json to change `url`, `logfilePath`, `levels`
  * `url`: url to slack hook api
  * `logfilePath`: path to logfile in local filesystem
  * `levels`: logger levels to send (for django, you can select from DEBUG, INFO, ERROR, WARNING)

- Initial implementaion : for django.


* You should change `logger.config.1.json` to `logger.config.json` to use.
  * For security for my own slack app, I made another file `logger.config.1.json` to store my slack api url.

Change this
```javascript
// <index.ts: line 13>
  let data = fs.readFileSync('./logger.config.1.json');
```
into this.
```javascript
// <index.ts: line 13>
  let data = fs.readFileSync('./logger.config.json');
```


* Build
```
  yarn build
```


* Start
```
  yarn start
```
